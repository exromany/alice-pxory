import { IncomingMessage } from 'http';
import { json } from 'micro';
import { buildAnswer } from './alice/buildAnswer';
import { Answer, Question } from './alice/types';
import { cleanupResponse } from './handler/customResponse';
import { handler } from './handler';
import { logRequestAndResponse } from './store/log';

export default async (req: IncomingMessage): Promise<Answer> => {
  const aliceRequest = await json(req) as Question;
  const { session, version } = aliceRequest;

  const customResponse = await handler(aliceRequest);
  logRequestAndResponse(aliceRequest, customResponse);
  const response = cleanupResponse(customResponse);

  return buildAnswer(response, session, version);
};
