// Lead scoring engine — calculates close probability based on form answers

export interface LeadAnswers {
  issues: string[];
  // Basement
  waterEntry?: string;
  waterFrequency?: string;
  visibleMold?: string;
  // Foundation
  crackType?: string;
  stickingDoorsWindows?: string;
  wallBowing?: string;
  priorRepairs?: string;
  // Crawl Space
  mustySmell?: string;
  saggingFloors?: string;
  crawlMoisture?: string;
  existingVaporBarrier?: string;
  // Concrete
  concreteLocation?: string;
  affectedArea?: string;
  tripHazard?: string;
  // General
  timeline?: string;
  source?: string;
  notes?: string;
  photosUploaded?: boolean;
}

export function calculateLeadScore(answers: LeadAnswers): number {
  let score = 0;

  // Standing water present (+20)
  if (
    answers.waterFrequency === "standing_water_always" ||
    answers.crawlMoisture === "yes"
  ) {
    score += 20;
  }

  // Horizontal crack — most serious (+15)
  if (answers.crackType === "horizontal") {
    score += 15;
  }

  // Visible mold or efflorescence (+15)
  if (answers.visibleMold === "yes") {
    score += 15;
  }

  // Sagging floors (+15)
  if (answers.saggingFloors === "yes") {
    score += 15;
  }

  // ASAP timeline (+15)
  if (answers.timeline === "asap") {
    score += 15;
  }

  // Multiple issues selected (+10)
  if (answers.issues && answers.issues.length > 1) {
    score += 10;
  }

  // Trip hazard on concrete (+10)
  if (answers.tripHazard === "yes") {
    score += 10;
  }

  // Photos uploaded (+10)
  if (answers.photosUploaded) {
    score += 10;
  }

  // Referral source (+5)
  if (answers.source === "referral") {
    score += 5;
  }

  // Notes written (+5)
  if (answers.notes && answers.notes.trim().length > 0) {
    score += 5;
  }

  // "Just exploring" timeline (-10)
  if (answers.timeline === "just_exploring") {
    score -= 10;
  }

  // No visible symptoms reported (-5)
  const hasSymptoms =
    answers.visibleMold === "yes" ||
    answers.saggingFloors === "yes" ||
    answers.wallBowing === "yes" ||
    answers.tripHazard === "yes" ||
    answers.crawlMoisture === "yes" ||
    answers.waterFrequency === "standing_water_always" ||
    answers.waterFrequency === "every_rain" ||
    answers.crackType === "horizontal" ||
    answers.crackType === "wide_vertical" ||
    answers.stickingDoorsWindows === "yes" ||
    answers.mustySmell === "yes";

  if (!hasSymptoms) {
    score -= 5;
  }

  // Clamp score to 0-100
  return Math.max(0, Math.min(100, score));
}

export function getScoreLabel(score: number): {
  label: string;
  color: string;
  emoji: string;
  bgColor: string;
} {
  if (score >= 70) {
    return {
      label: "HOT LEAD",
      color: "text-red-600",
      emoji: "🔴",
      bgColor: "bg-red-100",
    };
  }
  if (score >= 40) {
    return {
      label: "WARM LEAD",
      color: "text-yellow-600",
      emoji: "🟡",
      bgColor: "bg-yellow-100",
    };
  }
  return {
    label: "COOL LEAD",
    color: "text-green-600",
    emoji: "🟢",
    bgColor: "bg-green-100",
  };
}
