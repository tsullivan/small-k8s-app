import { LearnerSessionData } from '../types';
import { Router } from 'express';

export const registerRoute = (router: Router) => {
  router.post('/submit', (req, res) => {
    console.log(`received request: ${req.method} ${req.url}`);

    const guesses = req.body.guesses;
    if (!guesses) {
      throw new Error('No guesses!');
    }

    if (
      !req.session.learner ||
      !req.session.learner.answers ||
      !req.session.learner.startTime
    ) {
      throw new Error('Incomplete session!');
    }

    // Calculate time taken
    const endTime = new Date(Date.now());
    const time = endTime.valueOf() - new Date(req.session.learner.startTime).valueOf();
    // Calculate a grade
    const answers = req.session.learner.answers;
    req.session.learner.guesses = guesses;
    const correct = answers.filter((answer, index) => answer === guesses[index]);
    const grade = correct.length / answers.length;

    // TODO: Send the results to the backend server

    const response: LearnerSessionData = {
      name: req.session.learner?.name,
      questions: req.session?.learner.questions,
      answers: req.session?.learner.answers,
      guesses,
      time,
      grade,
    };

    res.json(response);
  });
};
