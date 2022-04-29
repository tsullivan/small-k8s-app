import * as mongoose from 'mongoose';
import { MessagePayload } from '../types';

const SMALLAPP_DB_ADDR = process.env.SMALLAPP_DB_ADDR;
const mongoURI = 'mongodb://' + SMALLAPP_DB_ADDR + '/smallapp';

const db = mongoose.connection;
db.on('disconnected', () => {
  console.error(`Disconnected: unable to reconnect to ${mongoURI}`);
});
db.on('error', (err) => {
  console.error(`Unable to connect to ${mongoURI}: ${err}`);
});
db.once('open', () => {
  console.log(`Connected to ${mongoURI}`);
});

export const connectToMongoDB = async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    connectTimeoutMS: 2000,
    useUnifiedTopology: true,
  });
};

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  questions: [{ type: mongoose.Schema.Types.Mixed }], // [[Number, String, Number]]
  answers: [Number],
  guesses: [Number],
  time: Number,
  grade: Number,
  date: { type: Date, default: Date.now },
});

export const MessageModel = mongoose.model('Message', MessageSchema);

// Constructs and saves message

export class Message {
  private payload: MessagePayload;
  private message: mongoose.Document<unknown, unknown, MessagePayload>;

  constructor(params: MessagePayload) {
    if (params.name == null) {
      throw new Error('name param is not provided!');
    }
    this.payload = params;
    this.message = new MessageModel(this.payload);
  }

  public create() {
    const validationError = this.message.validateSync();
    if (validationError) {
      throw validationError;
    }
    this.save(this.message);

    // TODO
    console.log('calculating next lesson...');
  }

  private save(doc: mongoose.Document) {
    console.log('saving message...');
    doc.save((err) => {
      if (err) {
        throw err;
      }
    });
  }
}
