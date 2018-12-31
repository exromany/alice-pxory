import { Question } from '../alice/types';
import { confirmSession, detachSession, finishSkillRegistration, Session, updateWrongSecret } from '../store/session';
import { addSkill, checkSkillSecret, findUnusedId, updateLastAccess } from '../store/skill';
import { generateIds } from '../utils/generateIds';
import { CustomResponse } from './customResponse';
import { proxy } from './proxy';
import { isQuitRequest, isStopRequest, isYesRequest, normalizeCommand } from './questions';
import {
  confirmBreakedMessage,
  finishRegistrationMessage,
  missedSecretAndRestartMessage,
  missedSecretMessage,
  stopProxyMessage,
} from './responses';

export async function getSessionResponse(aliceRequest: Question, userSession: Session): Promise<CustomResponse> {
  const { request } = aliceRequest;

  if (isQuitRequest(request)) {
    detachSession(userSession);
    return stopProxyMessage;
  }

  if (userSession.status === 'active') {
    return proxy(userSession, aliceRequest);
  }

  if (userSession.status === 'registration' && userSession.skill_id) {
    if (isYesRequest(request)) {
      confirmSession(userSession);
      return proxy(userSession, aliceRequest);
    } else {
      detachSession(userSession);
      return confirmBreakedMessage;
    }
  }

  if (userSession.status === 'registration' && !userSession.skill_id) {
    const secret = normalizeCommand(request);
    const skillId = await findUnusedId(generateIds());
    addSkill({
      skill_id: skillId,
      skill_url: userSession.skill_url,
      secret,
    });
    finishSkillRegistration(skillId, userSession);
    return finishRegistrationMessage(skillId, secret);
  }

  const secretVerified = await checkSkillSecret(userSession.skill_id!, normalizeCommand(request));
  if (secretVerified) {
    confirmSession(userSession);
    return startProxying(userSession, aliceRequest);
  }

  if (isStopRequest(request)) {
    await detachSession(userSession);
    return confirmBreakedMessage;
  }

  const tryAgain = await updateWrongSecret(userSession);
  if (tryAgain) {
    return missedSecretMessage;
  } else {
    return missedSecretAndRestartMessage;
  }
}

export async function startProxying(userSession: Session, aliceRequest: Question): Promise<CustomResponse> {
  updateLastAccess(userSession.skill_id);
  return proxy(userSession, aliceRequest);
}
