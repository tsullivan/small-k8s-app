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

const messageSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  body: { type: Object, required: [true, 'Message Body is required'] },
  timestamps: {},
});

export const messageModel = mongoose.model('Message', messageSchema);

// Constructs and saves message

export class Message {
  private name: string;
  private body: { date: Date; stage: string | null; grade: number; };
  private message: mongoose.Document<unknown, unknown, MessagePayload>;

  constructor(params: MessagePayload) {
    if (params.name == null) {
      throw new Error('name param is not provided!');
    }
    this.name = params.name;
    this.body = {
      ...params.body,
      date: new Date(Date.now()),
    };
    this.message = new messageModel({ name: this.name, body: this.body });
  }

  public create () {
    const validationError = this.message.validateSync();
    if (validationError) {
      throw validationError;
    }
    this.save(this.message);
  }

  private save (doc: mongoose.Document) {
    console.log('saving message...');
    doc.save((err) => {
      if (err) {
        throw err;
      }
    });
  }

}
