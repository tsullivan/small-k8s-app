import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Message } from '../lib/messages';
import { getAssessmentTest } from '../lib/questions';

export const router = express.Router();
router.use(bodyParser.json());

// Returns a set of stored questions for a user, or gives the assessment test
router.get('/questions', (_req, res) => {
  // Get the name of the user
  // Find any stored questions for this user
  const questions = getAssessmentTest(3); // FIXME make it 42
  // Return the questions
  res.json(questions);
});

router.post('/submit', (req, res) => {
  try {
    const message = new Message({ name: req.body.name, body: req.body.body });
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
