import { LearnerSessionData } from '../types';
import { Router } from 'express';

export const registerRoute = (router: Router) => {
  router.post('/submit', (req, res) => {
    console.log(`received request: ${req.method} ${req.url}`);

    const guesses = req.body.guesses;
    if (!guesses) {
      throw new Error('No guesses!');
    }

    if (!req.session.learner) {
      throw new Error('No session!');
    }

    req.session.learner.guesses = guesses;

    // TODO: Calculate a grade
    const grade = 0.999;
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
