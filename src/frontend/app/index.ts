import axios, { AxiosResponse } from 'axios';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import type { Request } from 'express';
import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';
import { checkEnvironment } from './env';
import '../types';
import { LearnerSessionData } from '../types';

// initialize the app
const app = express();

const SMALLAPP_SESSION_SECRET = process.env.SMALLAPP_API_ADDR;
const SMALLAPP_API_ADDR = process.env.SMALLAPP_API_ADDR;
const BACKEND_URI = `http://${SMALLAPP_API_ADDR}/submit`;
checkEnvironment();

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, '..', 'views'));

app.use(
  session({
    cookie: { maxAge: 86000 * 1000 },
    resave: true,
    saveUninitialized: true,
    secret: SMALLAPP_SESSION_SECRET ?? [],
  })
);

app.use(express.json());
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));

// give server option to save, read and access a cookie.
app.use(cookieParser());

app.use((req, _res, next) => {
  if (!req.session.learner) {
    req.session.learner = {
      name: null,
      questions: [],
      stage: null,
    };
  }
  next();
});

// Starts an http server on the $PORT environment variable
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

const router = express.Router();
app.use(router);
router.use(bodyParser.urlencoded({ extended: false }));

// Handles GET request to /
router.get('/', async (_req, res) => {
  // render the startup HTML template
  return await Promise.resolve()
    .then(() => {
      res.render('home', { messages: ['nice to see you'] });
    })
    .catch((error) => {
      console.error('error: ' + error);
    });
});

// Handles POST request to /post
router.post(
  '/post',
  async (req: Request<unknown, unknown, LearnerSessionData>, res) => {
    console.log(`received request: ${req.method} ${req.url}`);

    // validate request
    const name = req.body.name;
    if (!name || name.length == 0) {
      res.status(400).send('name is not specified');
      return;
    }

    let response: AxiosResponse<LearnerSessionData> | null = null;
    try {
      response = await axios.post(BACKEND_URI, {
        name,
        body: {
          stage: 'one',
          grade: 100,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }

    console.log(`response from ${BACKEND_URI}: ` + response?.status);
    res.json(response.data);
  }
);
