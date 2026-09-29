export const MOCK_STANDARDS = [
  {
    id: 'is-placeholder-1',
    number: 'IS [Placeholder A]',
    title: 'Stainless Steel Utensils and Cookware — Specification',
    status: 'Current',
    year: '2023',
    scope: 'This standard specifies requirements for stainless steel utensils and cookware intended for food contact and domestic use, including material composition, surface finish, and dimensional tolerances.',
    relevance: 'High',
    certRequired: true,
    testingRequired: true,
    tags: ['Kitchenware', 'Food Contact', 'Stainless Steel'],
    division: 'CHD (Chemicals)',
  },
  {
    id: 'is-placeholder-2',
    number: 'IS [Placeholder B]',
    title: 'Wrought Stainless Steels — Composition and Mechanical Properties',
    status: 'Current',
    year: '2022',
    scope: 'Covers compositional requirements and mechanical property testing for wrought stainless steel grades used in general purpose applications including consumer products and industrial use.',
    relevance: 'Medium',
    certRequired: false,
    testingRequired: true,
    tags: ['Materials', 'Steel', 'Mechanical Testing'],
    division: 'MTD (Metallurgy)',
  },
  {
    id: 'is-placeholder-3',
    number: 'IS [Placeholder C]',
    title: 'Food Grade Materials for Containers and Articles — General Requirements',
    status: 'Current',
    year: '2021',
    scope: 'Specifies the general requirements for materials and articles intended to contact food, including migration limits and safety criteria applicable to stainless steel and other metallic articles.',
    relevance: 'Medium',
    certRequired: true,
    testingRequired: true,
    tags: ['Food Safety', 'Containers', 'Migration Testing'],
    division: 'FAD (Food and Agriculture)',
  },
  {
    id: 'is-placeholder-4',
    number: 'IS [Placeholder D]',
    title: 'Domestic Electrical Appliances — Safety Requirements',
    status: 'Current',
    year: '2022',
    scope: 'Safety requirements for household and similar electrical appliances including kettles, heaters, and cooking appliances intended for domestic use connected to an electricity supply.',
    relevance: 'High',
    certRequired: true,
    testingRequired: true,
    tags: ['Electrical Safety', 'Domestic', 'CRS'],
    division: 'ETD (Electrotechnical)',
  },
  {
    id: 'is-placeholder-5',
    number: 'IS [Placeholder E]',
    title: 'Toys — Safety Requirements — General',
    status: 'Current',
    year: '2023',
    scope: 'Specifies general safety requirements for toys intended for use by children under 14 years of age, covering mechanical, physical, and chemical safety aspects.',
    relevance: 'High',
    certRequired: true,
    testingRequired: true,
    tags: ['Toys', 'Child Safety', 'BIS Mandatory'],
    division: 'CHD (Chemicals)',
  },
];

export const MOCK_CERTIFICATIONS = [
  {
    id: 'cert-1',
    title: 'Product Certification Scheme (ISI Mark)',
    scheme: 'Scheme I',
    description: 'The ISI Mark certification scheme for products covered under mandatory certification under the BIS Act and those voluntarily seeking BIS product certification.',
    applicability: 'Products notified by the Government of India under mandatory certification, and manufacturers voluntarily seeking BIS product certification.',
    documents: [
      'Application form (as prescribed by BIS)',
      'Product test reports from BIS-recognised laboratory',
      'Manufacturing process details and quality control plan',
      'Site plan and factory layout',
      'List of plant, machinery, and testing equipment',
    ],
  },
  {
    id: 'cert-2',
    title: 'Foreign Manufacturer Certification Scheme (FMCS)',
    scheme: 'FMCS',
    description: 'Certification scheme for foreign manufacturers intending to export products to India that require mandatory BIS certification. Enables foreign manufacturers to obtain the BIS licence.',
    applicability: 'Foreign manufacturers of products under mandatory BIS certification seeking to supply to the Indian market.',
    documents: [
      'Application form',
      'Factory audit report from BIS-empanelled auditor',
      'Test reports from BIS-recognised laboratory',
      'Authorised Indian Representative details',
      'Sample submission',
    ],
  },
  {
    id: 'cert-3',
    title: 'Compulsory Registration Scheme (CRS)',
    scheme: 'CRS',
    description: 'Registration scheme for electronics and IT products notified under the Electronics and IT Goods (Requirement for Compulsory Registration) Order, requiring registration before import or sale in India.',
    applicability: 'Electronics and IT products listed under the CRS notification issued under the BIS Act.',
    documents: [
      'Self-declaration of conformity',
      'Test reports from BIS-recognised laboratory',
      'Product details and model numbers',
      'Authorised representative details (for foreign manufacturers)',
    ],
  },
];

export const MOCK_LABS = [
  {
    id: 'lab-1',
    name: 'BIS Central Laboratory',
    location: 'Sahibabad, Uttar Pradesh',
    capabilities: ['Material testing', 'Chemical analysis', 'Mechanical testing', 'Electrical safety testing', 'Food contact migration testing'],
    standards: ['Multiple IS standards across divisions'],
    type: 'BIS Laboratory',
  },
  {
    id: 'lab-2',
    name: 'BIS Regional Testing Centre (Placeholder — Mumbai)',
    location: 'Mumbai, Maharashtra',
    capabilities: ['Consumer goods testing', 'Food contact materials', 'Packaging testing', 'Textiles testing'],
    standards: ['IS [Placeholder A]', 'IS [Placeholder C]'],
    type: 'BIS Laboratory',
  },
  {
    id: 'lab-3',
    name: 'BIS Regional Testing Centre (Placeholder — Chennai)',
    location: 'Chennai, Tamil Nadu',
    capabilities: ['Electrical goods testing', 'Electronics testing', 'Safety evaluation', 'CRS product testing'],
    standards: ['IS [Placeholder D]', 'IS [Placeholder E]'],
    type: 'BIS Laboratory',
  },
  {
    id: 'lab-4',
    name: 'Recognised Private Laboratory (Placeholder)',
    location: 'Bengaluru, Karnataka',
    capabilities: ['Mechanical testing', 'Chemical analysis', 'Environmental testing'],
    standards: ['IS [Placeholder B]'],
    type: 'Recognised Laboratory',
  },
];

export const SUGGESTED_QUERIES = [
  'Which standard applies to my product?',
  'How do I apply for BIS certification?',
  'What testing is required for electronics?',
  'How does hallmarking work?',
  'What is the ISI Mark?',
  'Which products need mandatory BIS certification?',
];

export const RECENT_QUERIES = [
  { id: 'q1', title: 'Electric kettle — applicable standards', date: '15 Jan 2024', category: 'Standards' },
  { id: 'q2', title: 'BIS certification process for toys', date: '14 Jan 2024', category: 'Certification' },
  { id: 'q3', title: 'Hallmark verification process', date: '12 Jan 2024', category: 'Hallmarking' },
  { id: 'q4', title: 'Testing requirements for LED lights', date: '10 Jan 2024', category: 'Testing' },
  { id: 'q5', title: 'CRS registration for imported electronics', date: '8 Jan 2024', category: 'Certification' },
];

export const DEMO_RESPONSE = {
  query: 'I manufacture stainless-steel water bottles. Which Indian Standards may apply and what BIS requirements should I check?',
  product: 'Stainless Steel Water Bottle',
  answer: 'Based on available BIS information, stainless steel water bottles for consumer use may fall under several Indian Standards covering material composition, food contact safety, and product requirements. BIS certification (ISI Mark) may be applicable depending on current product notifications. I recommend verifying against the current Schedule of Mandatory Certification to confirm whether your specific product and intended market requires mandatory BIS certification.',
  standards: MOCK_STANDARDS.slice(0, 3),
  certNote: 'Stainless steel kitchenware and food contact articles may be subject to mandatory BIS certification under the BIS Act. Verify the current list of notified products under the Schedule of Mandatory Certification for applicability to your product category and manufacturing context.',
  testingNote: 'Testing typically covers: material composition (chemical analysis for grade compliance), migration testing for food contact safety, mechanical properties (hardness, tensile strength), and surface finish evaluation. Tests must generally be conducted at BIS-recognised or NABL-accredited laboratories.',
  sources: [
    { title: 'BIS Standards Catalogue — Food Contact Materials', section: 'CHD Division — Food Contact Materials', clause: 'Section 4', page: '—', type: 'Official BIS source' },
    { title: 'Schedule of Products for Mandatory Certification', section: 'Kitchenware and Food Articles', clause: '—', page: '—', type: 'Official BIS source' },
  ],
};

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'info' as const, title: 'Compliance summary ready', body: 'Your BIS requirements summary for stainless steel products has been generated.', time: '2 hours ago', read: false },
  { id: 'n2', type: 'update' as const, title: 'Saved standard updated', body: 'A standard in your saved list may have been revised. Verify against official BIS sources.', time: '1 day ago', read: false },
  { id: 'n3', type: 'info' as const, title: 'New query history saved', body: 'Your recent session on BIS certification for toys has been saved to history.', time: '2 days ago', read: true },
];
