import * as bodyParser from 'body-parser';
import * as express from 'express';
import { MessagePayload } from '../types';
import { Message } from './messages';

export const router = express.Router();
router.use(bodyParser.json());

// Handles POST requests to /submit
router.post('/submit', (req: express.Request<unknown, MessagePayload | object>, res) => {
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
