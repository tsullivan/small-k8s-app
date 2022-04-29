import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Message } from '../lib/messages';
import { getSignupQuestions } from '../lib/questions';

export const router = express.Router();
router.use(bodyParser.json());

// Returns a set of stored questions for a user, or gives the assessment test
router.get('/questions', (_req, res) => {
  // TODO: Get the name of the user and find any stored questions for this user

  // Get default set of questions for newly signed up users
  const questions = getSignupQuestions(6); // FIXME make it 42

  // Return the questions
  res.json(questions);
});

router.post('/submit', (req, res) => {
  try {
    const message = new Message(req.body);
    message.create();
    res.status(200).send();
  } catch (err) {
    if ((err as Error).name == 'ValidationError') {
      console.error('validation error: ' + err);
      res.status(400).json(err as object);
    } else {
      console.error('could not save: ' + err);
      res.status(500).json(err as object);
    }
  }
});
