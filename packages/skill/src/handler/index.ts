import { Question } from '../alice/types';
import { getPrevUserSession, isActiveSession } from '../store/session';
import { CustomResponse } from './customResponse';
import { getNonSessionResponse } from './getNonSessionResponse';
import { getSessionResponse } from './getSessionResponse';
import { isFirstEmptyRequest, isServiceRequest } from './questions';
import { serviceMessage, welcomeMessage, restoreWelcomeMessage } from './responses';

export async function handler(aliceRequest: Question): Promise<CustomResponse> {
  const { request, session } = aliceRequest;

  if (isServiceRequest(request)) {
    return serviceMessage;
  }

  const userSession = await getPrevUserSession(session);

  if (isFirstEmptyRequest(request, session)) {
    if (userSession) {
      return restoreWelcomeMessage;
    }
    return welcomeMessage;
  }

  if (isActiveSession(userSession, session)) {
    return getSessionResponse(aliceRequest, userSession!);
  } else {
    return getNonSessionResponse(aliceRequest, userSession);
  }
};


