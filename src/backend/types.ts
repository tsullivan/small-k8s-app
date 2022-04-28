interface LearnerResultSet {
  name: string | null;
  body: {
    stage: string | null;
    grade: number;
  };
}

export type MessagePayload = LearnerResultSet;
