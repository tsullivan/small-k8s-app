import * as moment from 'moment';

const timeAgo = (utcTime: Date, currTime: number) => {
  const past = moment(utcTime);
  const result = past.from(moment(currTime));
  return result;
};

export const formatMessages = (
  messages: Array<{ timeAgo: unknown; timestamp: Date }>
) => {
  const currTime = moment.now();
  messages.forEach((message) => {
    message.timeAgo = timeAgo(message.timestamp, currTime);
  });
  return messages;
};
