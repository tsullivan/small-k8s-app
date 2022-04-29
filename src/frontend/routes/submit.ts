import { LearnerSessionData } from '../types';
import { Router } from 'express';

export const registerRoute = (router: Router) => {
  router.post('/submit', (req, res) => {
    console.log(`received request: ${req.method} ${req.url}`);

    const guesses = req.body.guesses;
    if (!guesses) {
      throw new Error('No guesses!');
    }

    if (!req.session.learner || !req.session.learner.answers) {
      throw new Error('No session!');
    }

    // Calculate a grade
    const answers = req.session.learner.answers;
    req.session.learner.guesses = guesses;
    const correct = answers.filter((answer, index) => {
      const isCorrect = answer === guesses[index];
      console.log('index, answer, guess, isCorrect', [index, answer, guesses[index], isCorrect]);
      return isCorrect;
    });
    const grade = correct.length / answers.length;
    console.log(`number correct: ${correct.length}, out of total: ${answers.length}. grade: ${grade}`);

    // TODO: Send the results to the backend server

    const response: LearnerSessionData = {
      name: req.session.learner?.name,
      questions: req.session?.learner.questions,
      answers: req.session?.learner.answers,
      guesses,
      grade,
    };

    res.json(response);
  });
};
