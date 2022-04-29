import axios from 'axios';
import { LearnerSessionData, QuestionFormat } from '../types';
import { Router } from 'express';

const SMALLAPP_API_ADDR = process.env.SMALLAPP_API_ADDR;
const BACKEND_URI_GETQUESTIONS = `http://${SMALLAPP_API_ADDR}/questions`;

export const registerRoute = (router: Router) => {
  router.post('/post', async (req, res) => {
    console.log(`received request: ${req.method} ${req.url}`);

    if (!req.session.learner) {
      throw new Error('No session!');
    }

    // validate request
    const name: string = req.body.name;
    if (!name || name.length == 0) {
      return res.status(400).send('name is not specified');
    }

    // receive questions for user
    let answers: Array<number> | null = null;
    let questions: Array<QuestionFormat> | null = null;
    try {
      const response = await axios.get(BACKEND_URI_GETQUESTIONS);
      console.log(`response from ${BACKEND_URI_GETQUESTIONS}: ` + response.status);

      // store the questions and answers in the user session
      const result: [Array<number>, Array<QuestionFormat>] = response.data;
      [answers, questions] = result;
    } catch (error) {
      console.error('error receiving questions: ' + error);
    }

    // populate session data
    req.session.learner.name = name;
    req.session.learner.questions = questions;
    req.session.learner.answers = answers;

    const startTime = new Date(Date.now());
    req.session.learner.startTime = startTime;

    const response: LearnerSessionData = {
      name,
      questions,
      startTime,
      // do not send the answers to the client
    };

    return res.json(response);
  });
};
