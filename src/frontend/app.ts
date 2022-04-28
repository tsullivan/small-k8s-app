import axios from 'axios';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';
import { LearnerSessionData, QuestionFormat } from './types';

// Application will fail if environment variables are not set
const checkEnvironment = () => {
  if (!process.env.PORT) {
    const errMsg = 'PORT environment variable is not defined';
    console.error(errMsg);
    throw new Error(errMsg);
  }

  if (!process.env.SMALLAPP_SESSION_SECRET) {
    const errMsg = 'SMALLAPP_SESSION_SECRET environment variable is not defined';
    console.error(errMsg);
    throw new Error(errMsg);
  }

  if (!process.env.SMALLAPP_API_ADDR) {
    const errMsg = 'SMALLAPP_API_ADDR environment variable is not defined';
    console.error(errMsg);
    throw new Error(errMsg);
  }
};

// initialize the app
const app = express();

const SMALLAPP_SESSION_SECRET = process.env.SMALLAPP_API_ADDR;
const SMALLAPP_API_ADDR = process.env.SMALLAPP_API_ADDR;
const BACKEND_URI_GETQUESTIONS = `http://${SMALLAPP_API_ADDR}/questions`;
checkEnvironment();

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

app.use(
  session({
    cookie: { maxAge: 86000 * 1000 },
    resave: true,
    saveUninitialized: true,
    secret: SMALLAPP_SESSION_SECRET ?? [],
  })
);

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// give server option to save, read and access a cookie.
app.use(cookieParser());

app.use((req, _res, next) => {
  if (!req.session.learner) {
    req.session.learner = {
      name: null,
      answers: null,
      questions: null,
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
  res.render('home');
});

// Handles POST request to /post
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

  req.session.learner.name = name;

  // receive questions for user
  let answers: Array<number> | null = null;
  let questions: Array<QuestionFormat> | null = null;
  try {
    const response = await axios.get(BACKEND_URI_GETQUESTIONS);
    console.log(`response from ${BACKEND_URI_GETQUESTIONS}: ` + response.status);

    // store the questions and answers in the user session
    const result: [Array<number>, Array<QuestionFormat>] = response.data;
    [answers, questions] = result;
    req.session.learner.questions = questions;
    req.session.learner.answers = answers;
  } catch (error) {
    console.error('error receiving questions: ' + error);
  }
  const response: LearnerSessionData = {
    name: req.session.learner?.name,
    questions,
    // do not send the answers to the client
  };

  return res.json(response);
});

// Handles POST request to /submit
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
