export interface HelpCenter {
  id: string;
  name: string;
  type: 'CSC Digital Seva Kendra' | 'Tehsil / Revenue Office' | 'e-District Seva Kendra' | 'Post Office Seva Kendra' | 'Municipal Corporation Suvidha Center';
  address: string;
  landmark: string;
  pincode: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  workingHours: string;
  operatorName: string;
  vleCode?: string;
  servicesProvided: string[];
  rating: number;
  reviewCount: number;
  isVerifiedGovtSpot: boolean;
  distanceKm?: number;
}

export const HELP_CENTERS_DATABASE: HelpCenter[] = [
  // Pune & Maharashtra
  {
    id: 'hc-pune-01',
    name: 'Jan Seva Kendra - Shivajinagar CSC',
    type: 'CSC Digital Seva Kendra',
    address: 'Shop No. 12, Ground Floor, District Collectorate Premises, Shivajinagar',
    landmark: 'Near District Court',
    pincode: '411005',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5308,
    longitude: 73.8474,
    phone: '+91 20 2553 4100',
    email: 'pune.csc01@digitalindia.gov.in',
    workingHours: '09:00 AM - 06:30 PM (Mon-Sat)',
    operatorName: 'Suresh Deshmukh',
    vleCode: 'VLE-MH-20419',
    servicesProvided: [
      'Aadhaar eKYC & Mobile Update',
      'Income & Domicile Certificate',
      'PM-KISAN Farmer Registration & Land Seeding',
      'Ayushman Bharat Golden Card Printing',
      'Ration Card eKYC Seeding',
      'E-Shram Card Registration'
    ],
    rating: 4.8,
    reviewCount: 342,
    isVerifiedGovtSpot: true,
  },
  {
    id: 'hc-pune-02',
    name: 'Haveli Tehsil Revenue & e-District Office',
    type: 'Tehsil / Revenue Office',
    address: 'Revenue Administrative Complex, Near Swargate Bus Stand',
    landmark: 'Opposite Police Station, Swargate',
    pincode: '411042',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5018,
    longitude: 73.8636,
    phone: '+91 20 2444 8812',
    email: 'tehsildar.haveli@maharashtra.gov.in',
    workingHours: '10:00 AM - 05:30 PM (Mon-Fri)',
    operatorName: 'Sub-Divisional Officer (SDO)',
    servicesProvided: [
      '7/12 Land Record Mutation & Extract',
      'Caste Certificate Verification',
      'Non-Creamy Layer (NCL) Certificate',
      'Senior Citizen ID Card Issuance',
      'Disability (PwD) Local Board Verification'
    ],
    rating: 4.6,
    reviewCount: 189,
    isVerifiedGovtSpot: true,
  },
  {
    id: 'hc-pune-03',
    name: 'Head Post Office Aadhaar Seva Kendra',
    type: 'Post Office Seva Kendra',
    address: 'Pune GPO, Sadhu Vaswani Chowk, Near Pune Railway Station',
    landmark: 'Adjacent to Central Telegraph Office',
    pincode: '411001',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5284,
    longitude: 73.8742,
    phone: '+91 20 2612 2110',
    email: 'punegpo@indiapost.gov.in',
    workingHours: '09:30 AM - 05:00 PM (Mon-Sat)',
    operatorName: 'India Post Payments Bank Team',
    servicesProvided: [
      'Aadhaar Biometric Update & Child Enrolment',
      'India Post Payments Bank (IPPB) DBT Account Opening',
      'Sukanya Samriddhi Yojana Account Opening',
      'National Pension Scheme (NPS) Assistance'
    ],
    rating: 4.9,
    reviewCount: 520,
    isVerifiedGovtSpot: true,
  },

  // Mumbai & Thane
  {
    id: 'hc-mum-01',
    name: 'MahaOnline Citizen Facilitation Center (CFC)',
    type: 'e-District Seva Kendra',
    address: 'Brihanmumbai Municipal Corporation (BMC) Ward Office, Fort',
    landmark: 'Opposite CST Railway Station',
    pincode: '400001',
    district: 'Mumbai City',
    state: 'Maharashtra',
    latitude: 18.9400,
    longitude: 72.8353,
    phone: '+91 22 2262 0251',
    email: 'cfc.fort@mcgm.gov.in',
    workingHours: '09:00 AM - 06:00 PM (Mon-Sat)',
    operatorName: 'MahaOnline Helpdesk',
    servicesProvided: [
      'Income & Caste Certificate Application',
      'Property Tax & Trade License Assistance',
      'Birth & Death Certificate Verification',
      'Ladki Bahin Yojana Application Helpdesk'
    ],
    rating: 4.7,
    reviewCount: 410,
    isVerifiedGovtSpot: true,
  },

  // New Delhi
  {
    id: 'hc-delhi-01',
    name: 'e-District Delhi Citizen Service Center',
    type: 'e-District Seva Kendra',
    address: 'DC Office Complex, 14 Daryaganj, Central Delhi',
    landmark: 'Near Golcha Cinema',
    pincode: '110002',
    district: 'Central Delhi',
    state: 'Delhi',
    latitude: 28.6415,
    longitude: 77.2410,
    phone: '+91 11 2327 8000',
    email: 'edistrict.delhi@gov.in',
    workingHours: '09:30 AM - 05:00 PM (Mon-Sat)',
    operatorName: 'Delhi e-Governance Society',
    servicesProvided: [
      'Income Certificate & Domicile Proof',
      'Delhi Ladli & Girl Child Pension Scheme',
      'Senior Citizen Pension Renewal',
      'Ration Card Smart NFC Renewal'
    ],
    rating: 4.8,
    reviewCount: 630,
    isVerifiedGovtSpot: true,
  },
  {
    id: 'hc-delhi-02',
    name: 'Connaught Place Post Office Aadhaar Seva Kendra',
    type: 'Post Office Seva Kendra',
    address: 'A-Block Post Office, Inner Circle, Connaught Place',
    landmark: 'Near Rajiv Chowk Metro Gate 7',
    pincode: '110001',
    district: 'New Delhi',
    state: 'Delhi',
    latitude: 28.6315,
    longitude: 77.2167,
    phone: '+91 11 2332 1102',
    email: 'cp.post@indiapost.gov.in',
    workingHours: '09:00 AM - 05:30 PM (Mon-Sat)',
    operatorName: 'IPPB Aadhaar Cell',
    servicesProvided: [
      'Aadhaar Biometric & Address Change',
      'DBT Bank Account Seeding',
      'PPF & Post Scheme Deposit'
    ],
    rating: 4.9,
    reviewCount: 890,
    isVerifiedGovtSpot: true,
  },

  // Bengaluru
  {
    id: 'hc-blr-01',
    name: 'Bengaluru One Citizen Service Center - MG Road',
    type: 'e-District Seva Kendra',
    address: 'BBMP Shopping Complex, Next to Utility Building, MG Road',
    landmark: 'Near Trinity Metro Station',
    pincode: '560001',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    latitude: 12.9756,
    longitude: 77.6065,
    phone: '+91 80 2297 5555',
    email: 'bengaluruone@karnataka.gov.in',
    workingHours: '08:00 AM - 07:00 PM (All 7 Days)',
    operatorName: 'Karnataka e-Governance Dept',
    servicesProvided: [
      'Seva Sindhu Scheme Applications',
      'Gruha Lakshmi & Gruha Jyoti Assistance',
      'Caste & Income Certificate',
      'Ration Card eKYC & Modification'
    ],
    rating: 4.8,
    reviewCount: 750,
    isVerifiedGovtSpot: true,
  },

  // Lucknow & UP
  {
    id: 'hc-lko-01',
    name: 'Jan Seva Kendra CSC - Hazratganj',
    type: 'CSC Digital Seva Kendra',
    address: 'Tehsil Compound, Near District Magistrate Office, Hazratganj',
    landmark: 'Behind GPO',
    pincode: '226001',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    latitude: 26.8467,
    longitude: 80.9462,
    phone: '+91 522 223 9102',
    email: 'lucknow.csc@up.gov.in',
    workingHours: '09:00 AM - 06:00 PM (Mon-Sat)',
    operatorName: 'Ramesh Chandra Verma',
    vleCode: 'VLE-UP-10928',
    servicesProvided: [
      'e-District UP Income & Domicile',
      'Khasra Khatauni Land Extracts',
      'PM-KISAN eKYC & Verification',
      'Kanya Sumangala Yojana'
    ],
    rating: 4.7,
    reviewCount: 420,
    isVerifiedGovtSpot: true,
  },

  // Jaipur & Rajasthan
  {
    id: 'hc-jpr-01',
    name: 'e-Mitra Citizen Center - District Collectorate',
    type: 'e-District Seva Kendra',
    address: 'Mini Secretariat Premises, Bani Park',
    landmark: 'Near Jaipur Collectorate',
    pincode: '302016',
    district: 'Jaipur',
    state: 'Rajasthan',
    latitude: 26.9260,
    longitude: 75.7928,
    phone: '+91 141 220 1200',
    email: 'emitra.jaipur@rajasthan.gov.in',
    workingHours: '09:30 AM - 06:00 PM (Mon-Sat)',
    operatorName: 'DOIT&C Rajasthan',
    servicesProvided: [
      'Jan Aadhaar Card Verification & Updates',
      'Chiranjeevi / Ayushman Health Card',
      'Palanhar Scheme Application',
      'Bonafide Residence & Caste Certificate'
    ],
    rating: 4.8,
    reviewCount: 510,
    isVerifiedGovtSpot: true,
  },

  // Hyderabad
  {
    id: 'hc-hyd-01',
    name: 'MeeSeva Center - Banjara Hills',
    type: 'e-District Seva Kendra',
    address: 'Road No. 12, Opposite Municipal Park, Banjara Hills',
    landmark: 'Near MLA Quarters',
    pincode: '500034',
    district: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.4156,
    longitude: 78.4487,
    phone: '+91 40 2335 1100',
    email: 'meeseva.hyd@telangana.gov.in',
    workingHours: '09:00 AM - 06:30 PM (Mon-Sat)',
    operatorName: 'Telangana e-Gov MeeSeva',
    servicesProvided: [
      'Income & Residence Certificate',
      'Arogyasri Card Assistance',
      'Rythu Bandhu & Land Record Verification',
      'Mahalakshmi Scheme Processing'
    ],
    rating: 4.9,
    reviewCount: 680,
    isVerifiedGovtSpot: true,
  },

  // Chennai & Tamil Nadu
  {
    id: 'hc-chn-01',
    name: 'e-Sevai Citizen Center - T. Nagar',
    type: 'e-District Seva Kendra',
    address: 'Corporation Community Hall, South Usman Road, T. Nagar',
    landmark: 'Near Panagal Park',
    pincode: '600017',
    district: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0418,
    longitude: 80.2341,
    phone: '+91 44 2434 8900',
    email: 'esevai.chn@tnega.gov.in',
    workingHours: '09:00 AM - 06:00 PM (Mon-Sat)',
    operatorName: 'TNeGA e-Sevai Helpdesk',
    servicesProvided: [
      'Kalaignar Magalir Urimai Thittam',
      'Community & Nativity Certificate',
      'Chief Minister Comprehensive Health Insurance',
      'First Graduate Certificate'
    ],
    rating: 4.8,
    reviewCount: 540,
    isVerifiedGovtSpot: true,
  },

  // Kolkata & West Bengal
  {
    id: 'hc-kol-01',
    name: 'Bangla Sahayata Kendra (BSK) - Salt Lake',
    type: 'e-District Seva Kendra',
    address: 'Bikash Bhavan Administrative Complex, Sector 1, Salt Lake City',
    landmark: 'Near Karunamoyee Bus Terminus',
    pincode: '700091',
    district: 'Kolkata',
    state: 'West Bengal',
    latitude: 22.5867,
    longitude: 88.4178,
    phone: '+91 33 2334 5600',
    email: 'bsk.saltlake@wb.gov.in',
    workingHours: '10:00 AM - 05:30 PM (Mon-Fri)',
    operatorName: 'P&AR Department West Bengal',
    servicesProvided: [
      'Lakshmir Bhandar Registration',
      'Swasthya Sathi Card Verification',
      'Krishak Bandhu Scheme Seeding',
      'Caste & Income Certificate Application'
    ],
    rating: 4.7,
    reviewCount: 490,
    isVerifiedGovtSpot: true,
  },

  // Ahmedabad & Gujarat
  {
    id: 'hc-ahmd-01',
    name: 'Jan Seva Kendra - Collectorate Complex',
    type: 'CSC Digital Seva Kendra',
    address: 'District Collector Office Compound, Subhash Bridge, Ashram Road',
    landmark: 'Near Gandhi Ashram',
    pincode: '380027',
    district: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 23.0560,
    longitude: 72.5850,
    phone: '+91 79 2755 1200',
    email: 'janseva.ahmedabad@gujarat.gov.in',
    workingHours: '09:30 AM - 06:00 PM (Mon-Sat)',
    operatorName: 'Digital Gujarat Team',
    servicesProvided: [
      'Digital Gujarat Portal Services',
      'Mukhyamantri Amrutam (MA) Card',
      '7/12 & 8A Land Record Extracts',
      'Non-Creamy Layer & Domicile Proof'
    ],
    rating: 4.8,
    reviewCount: 620,
    isVerifiedGovtSpot: true,
  },

  // Patna & Bihar
  {
    id: 'hc-pat-01',
    name: 'RTPS Citizen Service Counter - Sadar Block',
    type: 'Tehsil / Revenue Office',
    address: 'Block Development Office, Gandhi Maidan South',
    landmark: 'Opposite Mona Cinema',
    pincode: '800001',
    district: 'Patna',
    state: 'Bihar',
    latitude: 25.6154,
    longitude: 85.1415,
    phone: '+91 612 222 4100',
    email: 'rtps.patna@bihar.gov.in',
    workingHours: '10:00 AM - 05:00 PM (Mon-Sat)',
    operatorName: 'RTPS Bihar Portal Cell',
    servicesProvided: [
      'RTPS Caste, Income & Residential Certificate',
      'Mukhyamantri Kanya Utthan Yojana',
      'Bihar Student Credit Card Guidance',
      'Lakhpati Didi Self-Help Group Verification'
    ],
    rating: 4.6,
    reviewCount: 380,
    isVerifiedGovtSpot: true,
  },

  // Chandigarh & Punjab/Haryana
  {
    id: 'hc-chd-01',
    name: 'Sampark Center - Sector 17',
    type: 'e-District Seva Kendra',
    address: 'Central Plaza, Opposite Neelam Cinema, Sector 17',
    landmark: 'Sector 17 Bus Stand Area',
    pincode: '160017',
    district: 'Chandigarh',
    state: 'Chandigarh',
    latitude: 30.7398,
    longitude: 76.7827,
    phone: '+91 172 270 0017',
    email: 'sampark.chd@nic.in',
    workingHours: '08:00 AM - 08:00 PM (Mon-Sat)',
    operatorName: 'Chandigarh Administration e-Gov',
    servicesProvided: [
      'Aadhaar Enrolment & PVC Card Print',
      'Senior Citizen & PwD Bus Pass',
      'Residence & SC/BC Certificate',
      'Revenue & Water Connection Billing'
    ],
    rating: 4.9,
    reviewCount: 910,
    isVerifiedGovtSpot: true,
  }
];

// Helper formula to calculate distance in km between two lat/long points
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}
