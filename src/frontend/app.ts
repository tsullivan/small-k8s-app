import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';
import { router } from './routes';

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

app.use(router);
