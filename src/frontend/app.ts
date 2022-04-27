import axios from 'axios';
import * as bodyParser from 'body-parser';
import type { Request } from 'express';
import * as express from 'express';
import * as path from 'path';

const app = express();

const SMALLAPP_API_ADDR = process.env.SMALLAPP_API_ADDR;
const BACKEND_URI = `http://${SMALLAPP_API_ADDR}/messages`;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const router = express.Router();
app.use(router);

app.use(express.static('public'));
router.use(bodyParser.urlencoded({ extended: false }));

// Application will fail if environment variables are not set
if (!process.env.PORT) {
  const errMsg = 'PORT environment variable is not defined';
  console.error(errMsg);
  throw new Error(errMsg);
}

if (!process.env.SMALLAPP_API_ADDR) {
  const errMsg = 'SMALLAPP_API_ADDR environment variable is not defined';
  console.error(errMsg);
  throw new Error(errMsg);
}

// Starts an http server on the $PORT environment variable
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// Handles GET request to /
router.get('/', async (_req, res) => {
  // TODO check for auth cookie
  // render the startup HTML template
  return await Promise.resolve()
    .then(() => {
      res.render('home', { messages: ['nice to see you'] });
    })
    .catch((error) => {
      console.error('error: ' + error);
    });
});

interface PostPayloadBody {
  name: string;
  message: string;
}

// Handles POST request to /post
router.post('/post', (req: Request<unknown, unknown, PostPayloadBody>, res) => {
  console.log(`received request: ${req.method} ${req.url}`);

  // validate request
  const name = req.body.name;
  const message = req.body.message;
  if (!name || name.length == 0) {
    res.status(400).send('name is not specified');
    return;
  }

  if (!message || message.length == 0) {
    res.status(400).send('message is not specified');
    return;
  }

  // send the new message to the backend and redirect to the homepage
  console.log(`posting to ${BACKEND_URI}- name: ${name} body: ${message}`);
  axios
    .post(BACKEND_URI, {
      name: name,
      body: message,
    })
    .then((response) => {
      console.log(`response from ${BACKEND_URI}` + response.status);
      res.redirect('/');
    })
    .catch((error) => {
      console.error('error: ' + error);
    });
});
