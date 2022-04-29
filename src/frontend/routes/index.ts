/*
 * This program was written by Tim Sullivan
 */

import * as express from 'express';
import * as bodyParser from 'body-parser';
import { registerRoute as registerSubmit } from './submit';
import { registerRoute as registerPost } from './post';

export const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

// Handles GET request to /
router.get('/', async (_req, res) => {
  // render the startup HTML template
  res.render('home');
});

// Handles POST request to /post
registerPost(router);

// Handles POST request to /submit
registerSubmit(router);
