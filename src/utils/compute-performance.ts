export function computeQuestionsPerformance(
  rightQuestions?: number | null,
  wrongQuestions?: number | null,
) {
  const right = rightQuestions ?? 0;
  const wrong = wrongQuestions ?? 0;
  const total = right + wrong;
  if (total <= 0) return 0;

  return Math.round((right * 100) / total);
}

export function computeStudingTime(
  scanningReadingDurationSec?: number | null,
  skimmingReadingDurationSec?: number | null,
  questionsDurationSec?: number | null,
) {
  const scanning = scanningReadingDurationSec ?? 0;
  const skimming = skimmingReadingDurationSec ?? 0;
  const questions = questionsDurationSec ?? 0;
  return Math.round(scanning + skimming + questions);
}
