/*
 * This program was written by Tim Sullivan
 */

export type QuestionFormat = [number, string, number];

export interface LearnerSessionData {
  id: string;
  lesson: Array<QuestionFormat>;
}

declare module 'express-session' {
  interface SessionData {
    learner: LearnerSessionData;
  }
}


