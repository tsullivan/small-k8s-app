/*
 * This program was written by Tim Sullivan
 */

export type QuestionFormat = [number, string, number];

export interface LearnerSessionData {
  name: string | null;
  stage: string | null;
  questions: Array<QuestionFormat>;
}

interface LearnerResultSet {
  name: string | null;
  body: {
    stage: string | null;
    grade: number;
  };
}

declare module 'express-session' {
  interface SessionData {
    learner: LearnerSessionData;
  }
}

declare module 'axios' {
  interface AxiosStatic {
    post(
      url: string,
      data: LearnerSessionData | LearnerResultSet,
      config?: AxiosRequestConfig<LearnerSessionData>
    ): Promise<AxiosResponse<LearnerSessionData>>;
  }
}
