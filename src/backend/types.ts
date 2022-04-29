export type QuestionFormat = [number, string, number];

export interface MessagePayload {
  name: string | null;
  questions: Array<QuestionFormat> | null;
  answers?: number[] | null;
  guesses?: number[] | null;
  time?: number;
  grade?: number;
}
