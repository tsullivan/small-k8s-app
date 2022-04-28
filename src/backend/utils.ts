/*
 * This program was written by Tim Sullivan
 */

type QuestionFormat = [number, string, number];

const OPERATORS = ['*', '+', '-'];

export const getAssessmentTest = (size: number): [number[], Array<QuestionFormat>] => {
  const questions: Array<QuestionFormat> = [];
  const answers: number[] = [];

  for (let i = 0; i < size; i++) {
    const first = Math.round(Math.random() * 20);
    const last = Math.round(Math.random() * 20);
    const operatorIndex = Math.floor(Math.random() * OPERATORS.length);
    const operator = OPERATORS[operatorIndex];
    const question: QuestionFormat = [first, operator, last];

    let answer: number;
    switch (operator) {
    case '*':
      answer = first * last;
      break;
    case '+':
      answer = first + last;
      break;
    default:
      answer = first - last;
    }
    questions.push(question);
    answers.push(answer);
  }

  return [answers, questions];
};
