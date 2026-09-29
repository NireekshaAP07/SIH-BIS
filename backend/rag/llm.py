"""
BIS RAG LLM Client
Configurable LLM integration — supports Gemini, OpenAI, and Ollama.
Provider is selected via the LLM_PROVIDER environment variable.
"""

import os
import re
from dotenv import load_dotenv

load_dotenv(override=True)

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()


# ──────────────────────────────────────────────────────────────────────────────
# Prompt Templates — Easy-to-understand for everyday Indian citizens
# ──────────────────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are the official BIS Assistant — a friendly, knowledgeable AI guide designed to help ordinary Indian citizens, consumers, homebuilders, small business owners (MSMEs), shopkeepers, and students understand Bureau of Indian Standards (BIS) regulations, Indian Standards (IS), ISI marks, and gold hallmarking.

CRITICAL INSTRUCTION ON TONE AND SIMPLICITY:
Your reader is an everyday person in India, NOT a legal expert or research scientist. You MUST write in simple, clear, conversational language that is very easy to read and understand at a glance.

Guidelines:
1. **Explain in Plain Words**: Avoid dense bureaucratic or legal jargon. Whenever you mention an official acronym or term, immediately explain what it means in brackets:
   - "ISI Mark (the official BIS quality stamp on products)"
   - "Quality Control Order or QCO (a compulsory Indian government law making certification mandatory)"
   - "CRS (Compulsory Registration Scheme for electronics like chargers and laptops)"
   - "HUID (6-digit unique alphanumeric code laser-marked on hallmarked gold)"
   - "CM/L Number (the 7-digit license number printed near the ISI mark)"
2. **Use Clear Visual Sections**:
   Always format your answer with these clean, friendly sections:
   - 💡 **In Simple Words**: 2-3 short sentences giving the bottom-line answer.
   - ⚖️ **Is It Compulsory by Law in India?**: Clear "YES (Compulsory by Law)" or "Voluntary", explaining what happens if someone sells without it.
   - 🔍 **What You Should Check as a Buyer / Consumer**: Practical checklist of what to inspect (embossed marks, license number, grade, packaging).
   - 📋 **Applicable Indian Standard(s)**: The exact IS number and name, explained simply.
   - 🏢 **For Businesses & Sellers (How to Comply)**: Simple 3-step explanation of the certification process (online application, testing, factory audit).
   - 📲 **Quick Tip (BIS Care App)**: Remind the user to download the free official BIS Care Mobile App to verify any ISI mark or Gold HUID in seconds.
3. **Multilingual Support for Indian Citizens**:
   - The system supports English ("en"), Hindi ("hi"), Kannada ("kn"), and Tamil ("ta").
   - If the user asks in Hindi or target language is "hi", write the COMPLETE response fluently in clear Hindi using Devanagari script.
   - If the user asks in Kannada or target language is "kn", write the COMPLETE response fluently in clear Kannada using Kannada script.
   - If the user asks in Tamil or target language is "ta", write the COMPLETE response fluently in clear Tamil using Tamil script.
   - If the user asks in English or target language is "en", write in clear everyday English.
4. **Strict Grounding**: Base all facts, numbers, and standards strictly on the provided context. If a detail is missing, advise checking on bis.gov.in. Never invent standards.
"""

USER_PROMPT_TEMPLATE = """BIS KNOWLEDGE BASE CONTEXT:
{context}

---

USER QUERY: {query}

Please provide an answer that a normal Indian citizen (homebuilder, consumer, or small business owner) can understand very easily. Follow the structured format:
- 💡 **In Simple Words**
- ⚖️ **Is It Compulsory by Law in India?**
- 🔍 **What You Should Check as a Buyer / Consumer**
- 📋 **Applicable Indian Standard(s)**
- 🏢 **For Businesses & Sellers (How to Comply)**
- 📲 **Quick Verification Tip (BIS Care App)**
"""


def build_prompt(query: str, context_chunks: list[dict], language: str = "en") -> str:
    """Build the full user prompt with retrieved context and language instruction."""
    context_parts = []
    for i, chunk in enumerate(context_chunks, 1):
        source_label = chunk.get("is_number") or chunk.get("section") or chunk.get("source_file", "BIS Document")
        context_parts.append(f"[Source {i}: {source_label}]\n{chunk['content']}")

    context = "\n\n---\n\n".join(context_parts)
    prompt = USER_PROMPT_TEMPLATE.format(context=context, query=query)

    lang_instructions = {
        "hi": "\n\nIMPORTANT LANGUAGE REQUIREMENT: Write your ENTIRE response in Hindi (हिंदी). Use standard Devanagari script for all explanations and section headings.",
        "kn": "\n\nIMPORTANT LANGUAGE REQUIREMENT: Write your ENTIRE response in Kannada (ಕನ್ನಡ). Use standard Kannada script for all explanations and section headings.",
        "ta": "\n\nIMPORTANT LANGUAGE REQUIREMENT: Write your ENTIRE response in Tamil (தமிழ்). Use standard Tamil script for all explanations and section headings.",
        "en": "\n\nIMPORTANT LANGUAGE REQUIREMENT: Write in simple, conversational English easily understandable by an ordinary citizen in India.",
    }
    return prompt + lang_instructions.get(language, lang_instructions["en"])


# ──────────────────────────────────────────────────────────────────────────────
# Provider Implementations
# ──────────────────────────────────────────────────────────────────────────────

async def call_gemini(prompt: str) -> str:
    """Call Google Gemini API using the new google-genai SDK with automatic model fallback."""
    from google import genai
    from google.genai import types

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set in .env")

    client = genai.Client(api_key=api_key)

    preferred_model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")
    # Valid Gemini models in preferred order (fast → capable)
    candidate_models = [preferred_model, "gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash"]
    # Deduplicate while preserving order
    models_to_try = list(dict.fromkeys(candidate_models))

    last_error = None
    for model_name in models_to_try:
        try:
            response = await client.aio.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.3,
                    max_output_tokens=2000,
                ),
            )
            if response and response.text:
                return response.text
        except Exception as err:
            print(f"[BIS LLM] Attempt with {model_name} failed: {err}")
            last_error = err
            continue

    raise last_error or RuntimeError("All Gemini model attempts failed.")


async def call_openai(prompt: str) -> str:
    """Call OpenAI API."""
    from openai import AsyncOpenAI

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not set in .env")

    model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    client = AsyncOpenAI(api_key=api_key)
    response = await client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=2000,
    )
    return response.choices[0].message.content


async def call_ollama(prompt: str) -> str:
    """Call Ollama local LLM."""
    import httpx

    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    model_name = os.getenv("OLLAMA_MODEL", "llama3.1")

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{base_url}/api/chat",
            json={
                "model": model_name,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                "stream": False,
                "options": {"temperature": 0.3},
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["message"]["content"]


def extract_fallback_response(query: str, context_chunks: list[dict], language: str = "en") -> str:
    """
    Synthesize a clear, simple, consumer-friendly compliance guide directly from retrieved
    BIS knowledge chunks when the external AI API is rate-limited or during offline mode.
    Outputs in the chosen language (en, hi, kn, ta).
    """
    standards_found = []
    schemes_found = set()
    is_mandatory = False
    qco_orders = []
    testing_info = []

    for chunk in context_chunks:
        content = chunk.get("content", "")
        is_num = chunk.get("is_number")
        section = chunk.get("section", "")

        if is_num and is_num not in [s["number"] for s in standards_found]:
            scope_match = re.search(r"SCOPE:\s*(.*?)(?=\n\n[A-Z ]+:|$)", content, re.DOTALL)
            scope = scope_match.group(1).strip() if scope_match else ""
            if len(scope) > 220:
                scope = scope[:217] + "..."

            standards_found.append({
                "number": is_num,
                "title": section.replace(f"{is_num} — ", ""),
                "scope": scope,
            })

        if "MANDATORY: Yes" in content or "mandatory" in content.lower() or "qco" in content.lower():
            is_mandatory = True
            qco_match = re.search(r"QCO(?:\s+ORDER)?:\s*(.*?)(?=\n|$)", content, re.IGNORECASE)
            if qco_match and qco_match.group(1).strip() not in qco_orders:
                qco_orders.append(qco_match.group(1).strip())

        if "Scheme I" in content or "ISI Mark" in content:
            schemes_found.add("Scheme I (ISI Mark — Product Certification)")
        if "Compulsory Registration Scheme" in content or "CRS" in content:
            schemes_found.add("Scheme II (CRS — Compulsory Registration for Electronics)")
        if "Hallmarking" in content:
            schemes_found.add("Scheme IV (Hallmarking for Gold & Silver Jewellery)")
        if "FMCS" in content or "Foreign Manufacturers" in content:
            schemes_found.add("Scheme I (FMCS — For Foreign Manufacturers Exporting to India)")

        if "TEST LABORATORIES:" in content or "TESTING" in content:
            labs_match = re.search(r"TEST LABORATORIES:\s*(.*?)(?=\n\n[A-Z ]+:|$)", content, re.DOTALL)
            if labs_match:
                testing_info.append(labs_match.group(1).strip())

    HEADINGS = {
        "hi": {
            "simple": "💡 **सरल शब्दों में**",
            "compulsory": "⚖️ **क्या यह भारत में कानूनन अनिवार्य है?**",
            "check": "🔍 **उपभोक्ता या खरीदार के रूप में क्या जांचें**",
            "standards": "📋 **लागू भारतीय मानक**",
            "business": "🏢 **निर्माताओं और विक्रेताओं के लिए (प्रक्रिया)**",
            "tip": "📲 **त्वरित सत्यापन टिप: BIS Care App**",
            "mandatory_yes": "**हाँ — कानूनन अनिवार्य।** सरकार के क्वालिटी कंट्रोल ऑर्डर (QCO) के तहत बिना वैध BIS लाइसेंस और ISI मार्क के इसे भारत में बनाना या बेचना कानूनन अपराध है।",
            "mandatory_vol": "**स्वैच्छिक प्रमाणीकरण (जब तक किसी विशेष QCO द्वारा अधिसूचित न हो)।** गुणवत्ता और उपभोक्ता विश्वास के लिए निर्माता स्वेच्छा से ISI मार्क ले सकते हैं।",
            "app_tip": "निःशुल्क **BIS Care App** डाउनलोड करें और उत्पाद पर छपा 7-अंकों का CM/L नंबर डालकर तुरंत जांचें कि उत्पाद असली है या नकली।"
        },
        "kn": {
            "simple": "💡 **ಸರಳ ಮಾತುಗಳಲ್ಲಿ**",
            "compulsory": "⚖️ **ಭಾರತದಲ್ಲಿ ಕಾನೂನಿನ ಪ್ರಕಾರ ಕಡ್ಡಾಯವೇ?**",
            "check": "🔍 **ಗ್ರಾಹಕರಾಗಿ ನೀವು ಏನು ಪರಿಶೀಲಿಸಬೇಕು**",
            "standards": "📋 **ಅನ್ವಯವಾಗುವ ಭಾರತೀಯ ಮಾನದಂಡಗಳು**",
            "business": "🏢 **ತಯಾರಕರು ಮತ್ತು ಮಾರಾಟಗಾರರಿಗೆ (ಪ್ರಕ್ರಿಯೆ)**",
            "tip": "📲 **ತ್ವರಿತ ಪರಿಶೀಲನೆ ಸಲಹೆ: BIS Care App**",
            "mandatory_yes": "**ಹೌದು — ಕಾನೂನಿನ ಪ್ರಕಾರ ಕಡ್ಡಾಯವಾಗಿದೆ.** ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಆದೇಶದ (QCO) ಅಡಿಯಲ್ಲಿ ಮಾನ್ಯ BIS ಪರವಾನಗಿ ಮತ್ತು ISI ಗುರುತು ಇಲ್ಲದೆ ಈ ಉತ್ಪನ್ನವನ್ನು ಭಾರತದಲ್ಲಿ ಮಾರಾಟ ಮಾಡುವುದು ಕಾನೂನುಬಾಹಿರ.",
            "mandatory_vol": "**ಐಚ್ಛಿಕ ಪ್ರಮಾಣೀಕರಣ.** ಗುಣಮಟ್ಟ ಮತ್ತು ಗ್ರಾಹಕರ ನಂಬಿಕೆಗಾಗಿ ತಯಾರಕರು ಸ್ವಯಂಪ್ರೇರಿತರಾಗಿ ISI ಮುದ್ರೆಯನ್ನು ಪಡೆಯಬಹುದು.",
            "app_tip": "ಉಚಿತ **BIS Care App** ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು 7-ಅಂಕಿಯ CM/L ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ಉತ್ಪನ್ನ ಅಸಲಿಯೇ ಅಥವಾ ನಕಲಿಯೇ ಎಂದು ತಕ್ಷಣ ಪರಿಶೀಲಿಸಿ."
        },
        "ta": {
            "simple": "💡 **எளிய சொற்களில்**",
            "compulsory": "⚖️ **இது இந்தியாவில் சட்டப்படி கட்டாயமா?**",
            "check": "🔍 **நுகர்வோராக நீங்கள் என்ன சரிபார்க்க வேண்டும்**",
            "standards": "📋 **பொருந்தக்கூடிய இந்திய தரநிலைகள்**",
            "business": "🏢 **உற்பத்தியாளர்கள் மற்றும் விற்பனையாளர்களுக்கு (நடைமுறை)**",
            "tip": "📲 **விரைவு சரிபார்ப்பு குறிப்பு: BIS Care App**",
            "mandatory_yes": "**ஆம் — சட்டப்படி கட்டாயமானது.** தரக் கட்டுப்பாட்டு உத்தரவின் (QCO) கீழ் செல்லுபடியாகும் BIS உரிமம் மற்றும் ISI முத்திரை இல்லாமல் இதை இந்தியாவில் விற்பது சட்டவிரோதமானது.",
            "mandatory_vol": "**விருப்ப சான்றிதழ்.** தரத்தை உறுதிப்படுத்தவும் நுகர்வோர் நம்பிக்கையை உருவாக்கவும் உற்பத்தியாளர்கள் தாமாக முன்வந்து ISI முத்திரையை பெறலாம்.",
            "app_tip": "இலவச **BIS Care App** செயலியை பதிவிறக்கம் செய்து, தயாரிப்பில் உள்ள 7 இலக்க CM/L எண்ணை உள்ளிட்டு அது அசல் என்பதை உடனடியாக சரிபார்க்கவும்."
        },
        "en": {
            "simple": "💡 **In Simple Words**",
            "compulsory": "⚖️ **Is It Compulsory by Law in India?**",
            "check": "🔍 **What You Should Check as a Buyer / Consumer**",
            "standards": "📋 **Applicable Indian Standard(s)**",
            "business": "🏢 **For Manufacturers & Sellers (How to Comply)**",
            "tip": "📲 **Quick Tip: How to Verify Instantly**",
            "mandatory_yes": "**YES — 100% Mandatory by Law.** Under the Government's Quality Control Order (QCO), no manufacturer or importer is allowed to produce, stock, or sell this product in India without a valid BIS license and ISI mark. Selling uncertified goods is a legal offense under the BIS Act, 2016.",
            "mandatory_vol": "**Voluntary Certification (unless notified under a specific industry QCO).** Manufacturers can apply voluntarily for the ISI mark to prove superior quality, build customer trust, and qualify for government tenders.",
            "app_tip": "Download the free government **BIS Care App** (available on Android & iOS). Use the **'Verify License Details'** feature and enter the 7-digit CM/L number from any product. The app will immediately confirm if the brand is genuine, active, or counterfeit."
        }
    }

    t_dict = HEADINGS.get(language, HEADINGS["en"])
    lines = []

    # 1. In Simple Words
    lines.append(t_dict["simple"])
    if standards_found:
        primary_std = standards_found[0]
        if language == "hi":
            lines.append(f"यदि आप **{primary_std['number']}** ({primary_std['title']}) के अंतर्गत उत्पादों की खरीद, बिक्री या उत्पादन कर रहे हैं, तो उन्हें भारतीय मानक ब्यूरो (BIS) द्वारा निर्धारित सुरक्षा और गुणवत्ता मानकों को पूरा करना होगा।")
        elif language == "kn":
            lines.append(f"ನೀವು **{primary_std['number']}** ({primary_std['title']}) ಅಡಿಯಲ್ಲಿ ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸುತ್ತಿದ್ದರೆ, ಮಾರಾಟ ಮಾಡುತ್ತಿದ್ದರೆ ಅಥವಾ ಉತ್ಪಾದಿಸುತ್ತಿದ್ದರೆ, ಅವು BIS ನಿಗದಿಪಡಿಸಿದ ಗುಣಮಟ್ಟದ ಮಾನದಂಡಗಳನ್ನು ಪೂರೈಸಬೇಕು.")
        elif language == "ta":
            lines.append(f"நீங்கள் **{primary_std['number']}** ({primary_std['title']}) இன் கீழ் தயாரிப்புகளை வாங்கினால், விற்றால் அல்லது உற்பத்தி செய்தால், அவை BIS நிர்ணயித்த பாதுகாப்பு மற்றும் தர அளவுகோல்களை பூர்த்தி செய்ய வேண்டும்.")
        else:
            lines.append(f"If you are buying, selling, or producing products under **{primary_std['number']}** ({primary_std['title']}), they must meet quality and safety benchmarks set by the Bureau of Indian Standards (BIS).")
    else:
        if language == "hi":
            lines.append(f"**\"{query}\"** के संबंध में, यहां भारतीय मानक ब्यूरो (BIS) द्वारा निर्धारित मुख्य सुरक्षा और अनुपालन दिशानिर्देश दिए गए हैं।")
        elif language == "kn":
            lines.append(f"**\"{query}\"** ಕುರಿತು, ಭಾರತೀಯ ಮಾನಕ ಬ್ಯೂರೋ (BIS) ನಿಗದಿಪಡಿಸಿದ ಪ್ರಮುಖ ಮಾರ್ಗಸೂಚಿಗಳು ಇಲ್ಲಿವೆ.")
        elif language == "ta":
            lines.append(f"**\"{query}\"** தொடர்பாக, இந்திய தர நிறுவனம் (BIS) பரிந்துரைத்த முக்கிய பாதுகாப்பு மற்றும் இணக்க வழிகாட்டுதல்கள் இங்கே கொடுக்கப்பட்டுள்ளன.")
        else:
            lines.append(f"Regarding your question on **\"{query}\"**, here are the key safety and quality guidelines mandated by the Bureau of Indian Standards (BIS).")
    lines.append("")

    # 2. Is it Compulsory by Law?
    lines.append(t_dict["compulsory"])
    if is_mandatory:
        qco_text = f" ({qco_orders[0]})" if qco_orders else ""
        lines.append(t_dict["mandatory_yes"] + (f" (QCO: {qco_orders[0]})" if qco_orders and language == "en" else ""))
    else:
        lines.append(t_dict["mandatory_vol"])
    lines.append("")

    # 3. What to Check as a Consumer / Buyer
    lines.append(t_dict["check"])
    if language == "hi":
        lines.append("जब भी आप यह सामान बाज़ार या ऑनलाइन खरीदें, हमेशा ये बातें जांचें:")
        lines.append("1. **आधिकारिक BIS / ISI मार्क**: उत्पाद या उसकी पैकेजिंग पर स्पष्ट रूप से उभरा हुआ या छपा होना चाहिए।")
        lines.append("2. **7-अंकों का CM/L लाइसेंस नंबर**: ISI मार्क के ठीक नीचे `CM/L-XXXXXXX` नंबर होना अनिवार्य है।")
        lines.append("3. **भारतीय मानक संख्या**: मार्क के ऊपर मानक कोड (जैसे `IS 1786`) लिखा होना चाहिए।")
        lines.append("4. **नकली से सावधान रहें**: बिना वैध लाइसेंस नंबर वाले स्टिकर कभी स्वीकार न करें।")
    elif language == "kn":
        lines.append("ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಅಥವಾ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಖರೀದಿಸುವಾಗ ಯಾವಾಗಲೂ ಈ ಕೆಳಗಿನವುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ:")
        lines.append("1. **ಅಧಿಕೃತ BIS / ISI ಮುದ್ರೆ**: ಉತ್ಪನ್ನ ಅಥವಾ ಪ್ಯಾಕೆಟ್ ಮೇಲೆ ಸ್ಪಷ್ಟವಾಗಿ ಮುದ್ರಿಸಿರಬೇಕು.")
        lines.append("2. **7-ಅಂಕಿಯ CM/L ಪರವಾನಗಿ ಸಂಖ್ಯೆ**: ISI ಗುರುತಿನ ಕೆಳಗೆ `CM/L-XXXXXXX` ಸಂಖ್ಯೆ ಇರಬೇಕು.")
        lines.append("3. **ಭಾರತೀಯ ಮಾನದಂಡ ಸಂಖ್ಯೆ**: ಗುರುತಿನ ಮೇಲೆ ಮಾನದಂಡ ಕೋಡ್ (ಉದಾ. `IS 1786`) ಇರಬೇಕು.")
        lines.append("4. **ನಕಲಿಗಳಿಂದ ಎಚ್ಚರ**: ಪರವಾನಗಿ ಸಂಖ್ಯೆ ಇಲ್ಲದ ಸ್ಟಿಕ್ಕರ್‌ಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಬೇಡಿ.")
    elif language == "ta":
        lines.append("சந்தை அல்லது ஆன்லைனில் இந்த பொருளை வாங்கும் போது எப்போதும் சரிபார்க்கவும்:")
        lines.append("1. **அதிகாரப்பூர்வ BIS / ISI முத்திரை**: தயாரிப்பு அல்லது பேக்கிங் மீது தெளிவாக அச்சிடப்பட்டிருக்க வேண்டும்.")
        lines.append("2. **7 இலக்க CM/L உரிம எண்**: ISI முத்திரைக்கு கீழே `CM/L-XXXXXXX` எண் இருக்க வேண்டும்.")
        lines.append("3. **இந்திய தரநிலை எண்**: முத்திரையின் மேல் தரநிலை குறியீடு (எ.கா. `IS 1786`) இருக்க வேண்டும்.")
        lines.append("4. **போலிகளை தவிர்க்கவும்**: உரிம எண் இல்லாத ஸ்டிக்கர்களை ஏற்க வேண்டாம்.")
    else:
        lines.append("Whenever you purchase this item in the market or online, always look for:")
        lines.append("1. **The Official BIS / ISI Mark**: Must be clearly visible (embossed, printed, or engraved) on the product or its retail pack.")
        lines.append("2. **7-Digit License (CM/L) Number**: Directly below the ISI mark, you should see `CM/L-XXXXXXX`. This is the manufacturer's unique ID.")
        lines.append("3. **Indian Standard Number**: The standard code (e.g. `IS 1786` or similar) printed on top of the mark.")
        lines.append("4. **Beware of Fakes**: Never accept stickers or unverified logos without the 7-digit license number.")
    lines.append("")

    # 4. Applicable Standards
    if standards_found:
        lines.append(t_dict["standards"])
        for s in standards_found:
            lines.append(f"- **{s['number']}** — *{s['title']}*")
            if s["scope"]:
                lines.append(f"  > **What it covers**: {s['scope']}")
        lines.append("")

    # 5. How to Comply
    lines.append(t_dict["business"])
    scheme_str = ", ".join(sorted(schemes_found)) if schemes_found else "Scheme I (ISI Mark Certification)"
    if language == "hi":
        lines.append(f"- **लागू योजना**: {scheme_str}")
        lines.append("- **प्रमाणीकरण के चरण**:")
        lines.append("  1. आधिकारिक पोर्टल (**manakonline.in**) पर पंजीकरण करें।")
        lines.append("  2. BIS या मान्यता प्राप्त प्रयोगशाला में नमूना परीक्षण करवाएं।")
        lines.append("  3. BIS अधिकारी फैक्ट्री ऑडिट करेंगे।")
        lines.append("  4. सफल सत्यापन पर ISI मार्क उपयोग करने का लाइसेंस जारी किया जाता है।")
    elif language == "kn":
        lines.append(f"- **ಅನ್ವಯವಾಗುವ ಯೋಜನೆ**: {scheme_str}")
        lines.append("- **ಪ್ರಮಾಣೀಕರಣದ ಹಂತಗಳು**:")
        lines.append("  1. ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ (**manakonline.in**) ನೋಂದಾಯಿಸಿ.")
        lines.append("  2. BIS ಮಾನ್ಯತೆ ಪಡೆದ ಲ್ಯಾಬ್‌ನಲ್ಲಿ ಮಾದರಿ ಪರೀಕ್ಷೆ ಮಾಡಿಸಿ.")
        lines.append("  3. ಕಾರ್ಖಾನೆ ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ.")
        lines.append("  4. ISI ಮುದ್ರೆ ಬಳಸಲು ಅಧಿಕೃತ ಪರವಾನಗಿ ಪಡೆಯಿರಿ.")
    elif language == "ta":
        lines.append(f"- **பொருந்தக்கூடிய திட்டம்**: {scheme_str}")
        lines.append("- **சான்றிதழ் பெறும் படிகள்**:")
        lines.append("  1. அதிகாரப்பூர்வ போர்ட்டலில் (**manakonline.in**) பதிவு செய்யவும்.")
        lines.append("  2. BIS அங்கீகரிக்கப்பட்ட ஆய்வகத்தில் மாதிரி பரிசோதனை செய்யவும்.")
        lines.append("  3. தொழிற்சாலை தணிக்கை நடைபெறும்.")
        lines.append("  4. ISI முத்திரை பயன்படுத்த உரிமம் பெறவும்.")
    else:
        lines.append(f"- **Applicable Scheme**: {scheme_str}")
        lines.append("- **Steps to get certified**:")
        lines.append("  1. Register on the official BIS portal (**manakonline.in**).")
        lines.append("  2. Test samples at a BIS Central/Regional lab or NABL-accredited BIS-recognized lab.")
        lines.append("  3. BIS officers conduct a factory audit to verify quality control.")
        lines.append("  4. Receive the official BIS license to stamp the ISI mark on your products.")
    lines.append("")

    # 6. Consumer Tip - BIS Care App
    lines.append(t_dict["tip"])
    lines.append(t_dict["app_tip"])

    return "\n".join(lines)


# ──────────────────────────────────────────────────────────────────────────────
# Main Entry Point
# ──────────────────────────────────────────────────────────────────────────────

async def generate_response(query: str, context_chunks: list[dict], language: str = "en") -> str:
    """
    Generate a BIS-grounded LLM response using the configured provider.
    Gracefully falls back to extractive synthesis if API keys are not yet configured.

    Args:
        query: The user's question
        context_chunks: Retrieved BIS knowledge chunks from ChromaDB
        language: Target response language ('en', 'hi', 'kn', 'ta')

    Returns:
        The LLM-generated answer string
    """
    provider = os.getenv("LLM_PROVIDER", "gemini").lower()
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()

    # Check if a usable API key exists
    has_gemini = gemini_key and "your_" not in gemini_key.lower()
    has_openai = openai_key and "your_" not in openai_key.lower()

    prompt = build_prompt(query, context_chunks, language=language)

    if provider == "gemini":
        if not has_gemini:
            return extract_fallback_response(query, context_chunks, language=language)
        try:
            return await call_gemini(prompt)
        except Exception as e:
            print(f"[BIS LLM] Gemini call failed ({e}), using extractive fallback.")
            return extract_fallback_response(query, context_chunks, language=language)

    elif provider == "openai":
        if not has_openai:
            return extract_fallback_response(query, context_chunks, language=language)
        try:
            return await call_openai(prompt)
        except Exception as e:
            print(f"[BIS LLM] OpenAI call failed ({e}), using extractive fallback.")
            return extract_fallback_response(query, context_chunks, language=language)

    elif provider == "ollama":
        try:
            return await call_ollama(prompt)
        except Exception as e:
            print(f"[BIS LLM] Ollama call failed ({e}), using extractive fallback.")
            return extract_fallback_response(query, context_chunks, language=language)

    else:
        return extract_fallback_response(query, context_chunks, language=language)
