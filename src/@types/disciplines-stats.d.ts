export type DisciplinesStats = {
  disciplineId: string;
  disciplineName: string;
  topicsCount: number;
  pagesReaded: number;
  rightQuestions: number;
  wrongQuestions: number;
  skimmingReadingDurationSec: number;
  scanningReadingDurationSec: number;
  questionsDurationSec: number;
  performancePercentage: Prisma.Decimal | null;
  avarageSecondsPerPage: number | null;
  avarageSecondsPerQuestion: number | null;
};

export type TotalDisciplinesStats = {
  disciplineId: string;
  disciplineName: string;
  disciplineNotes: string | null;
  topics: {
    id: string;
    title: string;
    notes: string | null;
  }[];
  topicsCount: number;
  pagesReaded: number;
  rightQuestions: number;
  wrongQuestions: number;
  skimmingReadingDurationSec: number;
  scanningReadingDurationSec: number;
  questionsDurationSec: number;
  performancePercentage: Prisma.Decimal | null;
  avarageSecondsPerPage: number | null;
  avarageSecondsPerQuestion: number | null;
};
