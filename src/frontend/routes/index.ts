/*
 * This program was written by Tim Sullivan
 */

import * as bodyParser from 'body-parser';
import { Router } from 'express';
import { registerRoute as registerSubmit } from './submit';
import { registerRoute as registerPost } from './post';

export const registerRoutes = (router: Router) => {
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
};
