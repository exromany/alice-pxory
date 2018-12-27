import { CustomResponse, skipLogResponse } from './customResponse';
import { getActiveSession } from '../store/session';
import { Question, Request } from '../alice/types';
import { getSessionResponse } from './getSessionResponse';
import { getNonSessionResponse } from './getNonSessionResponse';

export async function handler(aliceRequest: Question): Promise<CustomResponse> {
  const { request, session } = aliceRequest;

  if (isServiceRequest(request)) {
    return skipLogResponse('');
  }

  const activeSession = await getActiveSession(session);
  if (activeSession) {
    return getSessionResponse(aliceRequest, activeSession);
  } else {
    return getNonSessionResponse(aliceRequest);
  }
};

export function isServiceRequest(request: Request): boolean {
  const SERVICE_PHRASES = ['ping', 'test'];
  return SERVICE_PHRASES.includes(request.command.toLowerCase());
}
