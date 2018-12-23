import { IncomingMessage } from 'http';
import { json } from 'micro';
import { handler } from './handler';
import { logRequestAndResponse } from './store/log';
import { AliceRequest, AliceResponse } from './types/alice';

export default async (req: IncomingMessage): Promise<AliceResponse> => {
  const aliceRequest = await json(req) as AliceRequest;
  const { session, version } = aliceRequest;

  const response = await handler(aliceRequest);

  if (!response.skip_log) {
    logRequestAndResponse(aliceRequest, response);
  }
  delete response.proxy;
  delete response.skip_log;

  return {
    response,
    session: {
      session_id: session.session_id,
      skill_id: session.user_id,
      user_id: session.user_id,
    },
    version,
  };
};
