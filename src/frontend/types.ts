/*
 * This program was written by Tim Sullivan
 */

export type QuestionFormat = [number, string, number];

export interface LearnerSessionData {
  name: string | null;
  questions: Array<QuestionFormat> | null;
  answers?: number[] | null;
  guesses?: Array<number | null> | null;
  startTime?: Date;
  time?: number;
  grade?: number;
}

declare module 'express-session' {
  interface SessionData {
    learner: LearnerSessionData;
  }
}
