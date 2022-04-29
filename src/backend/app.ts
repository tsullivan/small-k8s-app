import * as express from 'express';
import { router } from './routes';
import { connectToMongoDB } from './lib/messages';

const PORT = process.env.PORT;

const app = express();

app.use('/', router);

// Application will fail if environment variables are not set
if(!process.env.PORT) {
  const errMsg = 'PORT environment variable is not defined';
  console.error(errMsg);
  throw new Error(errMsg);
}

if(!process.env.SMALLAPP_DB_ADDR) {
  const errMsg = 'SMALLAPP_DB_ADDR environment variable is not defined';
  console.error(errMsg);
  throw new Error(errMsg);
}

// Connect to MongoDB, will retry only once
connectToMongoDB();

// Starts an http server on the $PORT environment variable
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
