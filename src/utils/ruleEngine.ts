import { UserProfile, Scheme, EvaluatedSchemeResult, EligibilityStatus } from '../types';

/**
 * Calculates a dedicated profession relevance score (0 - 100) and custom badge
 * for a scheme given the citizen's professional profile.
 */
export function calculateProfessionRelevance(profile: UserProfile, scheme: Scheme): {
  professionScore: number;
  badge?: string;
  matchReason?: string;
} {
  const occ = profile.occupation;
  const isFarmer = profile.isFarmer || occ === 'Farmer' || (profile.landholdingAcres || 0) > 0;
  const isStudent = profile.isActiveStudent || occ === 'Student';
  const isJobSeeker = occ === 'Unemployed / Job Seeker';
  const isArtisanOrVendor = occ === 'Self-Employed / Artisan' || occ === 'Street Vendor / Micro-Entrepreneur';
  const isHomemaker = occ === 'Homemaker';
  const isEmployee = occ === 'Private Sector Employee' || occ === 'Government Employee';

  const titleLower = scheme.title.toLowerCase();
  const descLower = scheme.description.toLowerCase();
  const catLower = scheme.category.toLowerCase();
  const eligLower = scheme.eligibilityDescription.toLowerCase();
  const ministryLower = scheme.ministry.toLowerCase();
  const subCatLower = (scheme.subCategory || '').toLowerCase();
  const beneficiariesLower = (scheme.beneficiaries || []).map(b => b.toLowerCase()).join(' ');

  let score = 0;
  let badge: string | undefined = undefined;
  let matchReason: string | undefined = undefined;

  // 1. STUDENT & SCHOLARSHIPS LOGIC
  if (isStudent) {
    const studentKeywords = [
      'scholarship', 'student', 'tuition', 'fellowship', 'education', 'vidyarthi',
      'shiksha', 'study', 'internship', 'higher education', 'merit', 'school',
      'college', 'aicte', 'ugc', 'pm-shri', 'nmms', 'post matric', 'pre matric',
      'pragati', 'saksham', 'inspire', 'degree', 'coaching', 'laptop', 'hostel',
      'exam', 'youth', 'polytechnic', 'phd', 'fellow'
    ];

    let matches = 0;
    if (catLower.includes('education') || catLower.includes('scholarship') || catLower.includes('skills')) matches += 3;
    if (scheme.rules.requiresStudent) matches += 5;
    if (beneficiariesLower.includes('student') || beneficiariesLower.includes('children')) matches += 3;

    for (const kw of studentKeywords) {
      if (titleLower.includes(kw)) matches += 4;
      if (descLower.includes(kw)) matches += 1;
      if (eligLower.includes(kw)) matches += 2;
    }

    if (matches > 0) {
      score = Math.min(100, 50 + matches * 8);
      badge = titleLower.includes('scholarship') || catLower.includes('scholarship')
        ? '🎓 Top Scholarship for Students'
        : '🎓 Student Education & Career Grant';
      matchReason = `🎓 Prioritized for your Student profile: High-impact scholarship, fee assistance & educational advancement.`;
    }
  }

  // 2. FARMER & AGRICULTURE LOGIC
  else if (isFarmer) {
    const farmerKeywords = [
      'kisan', 'farmer', 'fasal', 'crop', 'agriculture', 'krishi', 'landholding',
      'pm-kisan', 'soil', 'irrigation', 'seed', 'tractor', 'dairy', 'horticulture',
      'matsya', 'animal husbandry', 'fertilizer', 'nabard', 'mandis', 'pmksy',
      'kcc', 'rkvy', 'harvest', 'pesticide', 'organic farming', 'livestock',
      'fisheries', 'grain', 'agri', 'farm', 'sheti', 'krushak'
    ];

    let matches = 0;
    if (catLower.includes('agri') || catLower.includes('rural')) matches += 3;
    if (scheme.rules.requiresFarmer) matches += 5;
    if (beneficiariesLower.includes('farmer') || beneficiariesLower.includes('rural')) matches += 3;

    for (const kw of farmerKeywords) {
      if (titleLower.includes(kw)) matches += 4;
      if (descLower.includes(kw)) matches += 1;
      if (eligLower.includes(kw)) matches += 2;
    }

    if (matches > 0) {
      score = Math.min(100, 50 + matches * 8);
      badge = titleLower.includes('kisan') || titleLower.includes('fasal') || titleLower.includes('credit card')
        ? '🌾 Direct Kisan & Agri Benefit'
        : '🌾 Tailored for Farmers';
      matchReason = `🌾 Prioritized for your Farmer profile: Direct agricultural income support, crop loss insurance & input subsidies.`;
    }
  }

  // 3. ARTISANS, TRADERS & MICRO-ENTREPRENEURS LOGIC
  else if (isArtisanOrVendor) {
    const artisanKeywords = [
      'vishwakarma', 'artisan', 'mudra', 'svanidhi', 'msme', 'vendor', 'credit',
      'collateral-free', 'pmegp', 'stand up india', 'startup', 'craftsman',
      'weavers', 'self-employed', 'tool kit', 'handloom', 'micro-enterprise',
      'business loan', 'subsidy', 'working capital', 'trader', 'shopkeeper'
    ];

    let matches = 0;
    if (catLower.includes('business') || catLower.includes('entrepreneur') || catLower.includes('msme') || catLower.includes('skills')) matches += 3;
    if (beneficiariesLower.includes('entrepreneur') || beneficiariesLower.includes('worker')) matches += 3;

    for (const kw of artisanKeywords) {
      if (titleLower.includes(kw)) matches += 4;
      if (descLower.includes(kw)) matches += 1;
      if (eligLower.includes(kw)) matches += 2;
    }

    if (matches > 0) {
      score = Math.min(100, 50 + matches * 8);
      badge = titleLower.includes('vishwakarma') || titleLower.includes('svanidhi')
        ? '🛠️ Tailored for Artisans & Vendors'
        : '💼 Business & MSME Capital Grant';
      matchReason = `🛠️ Prioritized for your Self-Employed / Artisan profile: Collateral-free working capital, tool kit incentives & subsidized credit.`;
    }
  }

  // 4. UNEMPLOYED & JOB SEEKERS LOGIC
  else if (isJobSeeker) {
    const jobKeywords = [
      'pmkvy', 'skill', 'training', 'employment', 'rozgar', 'apprenticeship',
      'stipend', 'job', 'mgnrega', 'career', 'vocational', 'ddu-gky',
      'placement', 'internship', 'livelihood', 'unemployed'
    ];

    let matches = 0;
    if (catLower.includes('skills') || catLower.includes('employment') || catLower.includes('education')) matches += 3;
    if (beneficiariesLower.includes('job') || beneficiariesLower.includes('worker')) matches += 3;

    for (const kw of jobKeywords) {
      if (titleLower.includes(kw)) matches += 4;
      if (descLower.includes(kw)) matches += 1;
      if (eligLower.includes(kw)) matches += 2;
    }

    if (matches > 0) {
      score = Math.min(100, 50 + matches * 8);
      badge = '💼 Top Pick for Job Seekers';
      matchReason = `💼 Prioritized for your Job Seeker profile: Certified skill training programs, monthly stipends & direct employment placement.`;
    }
  }

  // 5. HOMEMAKERS & WOMEN ENTREPRENEURS
  else if (isHomemaker) {
    const homemakerKeywords = [
      'ujjwala', 'mahila', 'lakhpati didi', 'self-help group', 'shg', 'nrlm',
      'matru vandana', 'poshan', 'women', 'mother', 'nutrition', 'sukanya',
      'ladli', 'sanitation', 'kitchen', 'health', 'ration'
    ];

    let matches = 0;
    if (catLower.includes('women') || catLower.includes('health') || catLower.includes('social')) matches += 3;
    if (beneficiariesLower.includes('women')) matches += 3;

    for (const kw of homemakerKeywords) {
      if (titleLower.includes(kw)) matches += 4;
      if (descLower.includes(kw)) matches += 1;
      if (eligLower.includes(kw)) matches += 2;
    }

    if (matches > 0) {
      score = Math.min(100, 50 + matches * 8);
      badge = '👩 Curated for Homemakers & SHGs';
      matchReason = `👩 Prioritized for your Homemaker profile: Women empowerment grants, SHG microcredit & household healthcare.`;
    }
  }

  // 6. EMPLOYEES & SALARIED CITIZENS
  else if (isEmployee) {
    const employeeKeywords = [
      'epfo', 'insurance', 'pension', 'ayushman', 'housing', 'pmay', 'swasthya',
      'tax', 'cghs', 'esi', 'pradhan mantri suraksha', 'jeevan jyoti'
    ];

    let matches = 0;
    if (catLower.includes('banking') || catLower.includes('health') || catLower.includes('housing')) matches += 2;

    for (const kw of employeeKeywords) {
      if (titleLower.includes(kw)) matches += 3;
      if (descLower.includes(kw)) matches += 1;
    }

    if (matches > 0) {
      score = Math.min(100, 40 + matches * 8);
      badge = '🏢 Tailored for Salaried Professionals';
      matchReason = `🏢 Matched for your Salaried Employee profile: Social security, healthcare coverage & affordable housing finance.`;
    }
  }

  return { professionScore: score, badge, matchReason };
}

export function evaluateEligibility(profile: UserProfile, scheme: Scheme): EvaluatedSchemeResult {
  const rules = scheme.rules;
  const matchReasons: string[] = [];
  const missingReqs: string[] = [];
  let scorePoints = 100;
  let maxPoints = 100;

  // 1. Profession Relevance Assessment
  const { professionScore, badge, matchReason } = calculateProfessionRelevance(profile, scheme);
  if (professionScore > 0 && matchReason) {
    matchReasons.unshift(matchReason);
  }

  // 2. Gender check
  if (rules.genderConstraint && rules.genderConstraint !== 'Any') {
    maxPoints += 20;
    if (profile.gender === rules.genderConstraint) {
      scorePoints += 20;
      matchReasons.push(`Gender requirement matched (${profile.gender}).`);
    } else {
      missingReqs.push(`Restricted to ${rules.genderConstraint} applicants.`);
    }
  }

  // 3. State constraint check
  if (rules.statesAllowed && rules.statesAllowed.length > 0 && !rules.statesAllowed.includes('All')) {
    maxPoints += 25;
    if (rules.statesAllowed.includes(profile.state)) {
      scorePoints += 25;
      matchReasons.push(`State residency match (${profile.state}).`);
    } else {
      missingReqs.push(`Available specifically for residents of ${rules.statesAllowed.join(', ')}.`);
    }
  } else if (scheme.origin === 'central') {
    matchReasons.push(`Central scheme accessible to all Indian residents in ${profile.state || 'India'}.`);
  }

  // 4. Age constraints
  if (rules.minAge !== undefined) {
    maxPoints += 15;
    if (profile.age >= rules.minAge) {
      scorePoints += 15;
      matchReasons.push(`Age criteria satisfied (${profile.age} yrs ≥ min ${rules.minAge} yrs).`);
    } else {
      missingReqs.push(`Minimum age requirement is ${rules.minAge} years (You entered ${profile.age}).`);
    }
  }

  if (rules.maxAge !== undefined) {
    maxPoints += 15;
    if (profile.age <= rules.maxAge) {
      scorePoints += 15;
      matchReasons.push(`Age within maximum threshold (${profile.age} yrs ≤ max ${rules.maxAge} yrs).`);
    } else {
      missingReqs.push(`Maximum age allowed is ${rules.maxAge} years (You entered ${profile.age}).`);
    }
  }

  // 5. Annual Income check
  if (rules.maxAnnualIncome !== undefined) {
    maxPoints += 25;
    if (profile.annualFamilyIncome <= rules.maxAnnualIncome) {
      scorePoints += 25;
      matchReasons.push(`Annual family income (₹${profile.annualFamilyIncome.toLocaleString('en-IN')}) is below eligibility cap of ₹${rules.maxAnnualIncome.toLocaleString('en-IN')}.`);
    } else {
      missingReqs.push(`Family annual income exceeds maximum ceiling of ₹${rules.maxAnnualIncome.toLocaleString('en-IN')}.`);
    }
  }

  // 6. Occupation check
  if (rules.allowedOccupations && rules.allowedOccupations.length > 0) {
    maxPoints += 25;
    if (rules.allowedOccupations.includes(profile.occupation)) {
      scorePoints += 25;
      matchReasons.push(`Occupation (${profile.occupation}) directly matches designated target beneficiaries.`);
    } else {
      missingReqs.push(`Targeted for ${rules.allowedOccupations.join(' / ')} (Your profile: ${profile.occupation}).`);
    }
  }

  // 7. Special toggles
  if (rules.requiresFarmer) {
    maxPoints += 30;
    if (profile.isFarmer || profile.occupation === 'Farmer' || (profile.landholdingAcres || 0) > 0) {
      scorePoints += 30;
      matchReasons.push('Verified farmer / cultivable agricultural landholding status.');
    } else {
      missingReqs.push('Requires landholding agricultural farmer status.');
    }
  }

  if (rules.requiresStudent) {
    maxPoints += 30;
    if (profile.isActiveStudent || profile.occupation === 'Student') {
      scorePoints += 30;
      matchReasons.push('Enrolled active student / scholar status matched.');
    } else {
      missingReqs.push('Requires active school, college, or university enrollment.');
    }
  }

  if (rules.requiresSeniorCitizen) {
    maxPoints += 20;
    if (profile.isSeniorCitizen || profile.age >= 60) {
      scorePoints += 20;
      matchReasons.push('Senior citizen age bracket (60+ yrs) confirmed.');
    } else {
      missingReqs.push('Requires age 60 or above (Senior Citizen).');
    }
  }

  if (rules.requiresDisability) {
    maxPoints += 25;
    if (profile.isDisabilityPwD) {
      scorePoints += 25;
      matchReasons.push('Disability (PwD) certificate holder match.');
    } else {
      missingReqs.push('Requires certified physical disability (PwD) status.');
    }
  }

  if (rules.requiresBpl) {
    maxPoints += 20;
    if (profile.hasBplRationCard) {
      scorePoints += 20;
      matchReasons.push('BPL / Antyodaya Ration Cardholder verified.');
    } else {
      missingReqs.push('Requires verified BPL / EWS Ration Card.');
    }
  }

  // Calculate base match score
  let matchPercentage = Math.round((scorePoints / maxPoints) * 100);

  // Apply a dynamic boost if this scheme directly answers their primary occupation
  if (missingReqs.length === 0 && professionScore >= 60) {
    matchPercentage = Math.min(100, matchPercentage + 10);
  }

  let status: EligibilityStatus = 'ineligible';
  if (missingReqs.length === 0 && matchPercentage >= 80) {
    status = 'highly_eligible';
  } else if (missingReqs.length === 0 && matchPercentage >= 65) {
    status = 'eligible';
  } else if (missingReqs.length <= 1 && matchPercentage >= 45) {
    status = 'needs_docs';
  } else {
    status = 'ineligible';
  }

  const defaultWhy = matchReasons.length > 0
    ? matchReasons.slice(0, 3).join(' ')
    : 'Matches general citizenship and demographic criteria.';

  const steps = [
    `Gather all listed required documents (${scheme.requiredDocs.slice(0, 2).join(', ')}).`,
    `Visit the official portal (${new URL(scheme.officialWebsiteUrl).hostname}) or nearest CSC / Seva Kendra.`,
    'Complete mobile eKYC verification using Aadhaar OTP.',
    'Submit the online application form and keep the tracking acknowledgment number safe.'
  ];

  return {
    scheme,
    matchScore: Math.min(100, Math.max(0, matchPercentage)),
    status,
    whyYouQualify: defaultWhy,
    missingRequirements: missingReqs,
    checklistDocs: scheme.requiredDocs,
    applicationSteps: steps,
    professionScore,
    professionBadge: badge,
    professionMatchReason: matchReason,
  };
}

/**
 * Evaluates all schemes and sorts them strictly based on citizen's profession,
 * placing highly relevant scholarships for students and agricultural schemes for farmers
 * at the top of the list!
 */
export function evaluateAllSchemes(profile: UserProfile, schemes: Scheme[]): EvaluatedSchemeResult[] {
  const evaluated = schemes.map(scheme => evaluateEligibility(profile, scheme));

  return evaluated.sort((a, b) => {
    // 1. Eligibility Status Hierarchy (Eligible > Needs Docs > Ineligible)
    const statusWeight: Record<EligibilityStatus, number> = {
      highly_eligible: 400,
      eligible: 300,
      needs_docs: 150,
      ineligible: 0,
    };

    const statusScoreA = statusWeight[a.status] || 0;
    const statusScoreB = statusWeight[b.status] || 0;

    // 2. Profession Alignment Score (0 - 100)
    // A student looking at scholarships or a farmer looking at agri schemes gets a 2.5x multiplier!
    const profScoreA = (a.professionScore || 0) * 2.5;
    const profScoreB = (b.professionScore || 0) * 2.5;

    // 3. Match Score (0 - 100)
    const matchScoreA = a.matchScore;
    const matchScoreB = b.matchScore;

    // 4. Financial Benefit magnitude
    const benefitA = (a.scheme.benefitNumericMax || a.scheme.benefitNumericMin || 0) / 100000;
    const benefitB = (b.scheme.benefitNumericMax || b.scheme.benefitNumericMin || 0) / 100000;

    // Total Composite Ranking Score
    const totalRankA = statusScoreA + profScoreA + matchScoreA + benefitA;
    const totalRankB = statusScoreB + profScoreB + matchScoreB + benefitB;

    return totalRankB - totalRankA;
  });
}
