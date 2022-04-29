import axios from 'axios';
import { LearnerSessionData, QuestionFormat } from '../types';
import { Router } from 'express';

const SMALLAPP_API_ADDR = process.env.SMALLAPP_API_ADDR;
const BACKEND_URI_SUBMITGRADE = `http://${SMALLAPP_API_ADDR}/submit`;

interface MessagePayload {
  name: string | null;
  questions: Array<QuestionFormat> | null;
  answers?: number[] | null;
  guesses?: number[] | null;
  time?: number;
  grade?: number;
}

export const registerRoute = (router: Router) => {
  router.post('/submit', async (req, res) => {
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

    const messagePayload: MessagePayload = {
      name: req.session.learner.name,
      questions: req.session.learner.questions,
      answers: req.session.learner.answers,
      guesses,
      time,
      grade,
    };

    try {
      const response = await axios.post(BACKEND_URI_SUBMITGRADE, messagePayload);
      console.log(`response from ${BACKEND_URI_SUBMITGRADE}: ` + response.status);
    } catch (error) {
      console.error('error submitting grades: ' + error);
    }

    const response: LearnerSessionData = {
      ...messagePayload,
      ...req.session.learner,
    };

    res.json(response);
  });
};
