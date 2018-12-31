import { Question } from '../alice/types';
import { getUserSession } from '../store/session';
import { CustomResponse } from './customResponse';
import { getNonSessionResponse } from './getNonSessionResponse';
import { getSessionResponse } from './getSessionResponse';
import { isFirstEmptyRequest, isServiceRequest } from './questions';
import { serviceMessage, welcomeMessage } from './responses';

export async function handler(aliceRequest: Question): Promise<CustomResponse> {
  const { request, session } = aliceRequest;

  if (isServiceRequest(request)) {
    return serviceMessage;
  }

  if (isFirstEmptyRequest(request, session)) {
    return welcomeMessage;
  }

  const userSession = await getUserSession(session);
  if (userSession) {
    return getSessionResponse(aliceRequest, userSession);
  } else {
    return getNonSessionResponse(aliceRequest);
  }
};


