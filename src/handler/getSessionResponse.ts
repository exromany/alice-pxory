import { CustomResponse } from './customResponse';
import { proxy } from './proxy';
import { simpleResponse } from '../alice/simpleResponse';
import { confirmSession, detachSession, updateWrongSecret, Session } from '../store/session';
import { checkSkillSecret, updateLastAccess } from '../store/skill';
import { Question, Request } from '../alice/types';

export async function getSessionResponse(aliceRequest: Question, activeSession: Session): Promise<CustomResponse> {
  const { request } = aliceRequest;
  if (isQuitRequest(request)) {
    await detachSession(activeSession);
    return simpleResponse('Пока!', true);
  }
  if (activeSession.confirmed) {
    return proxy(activeSession, aliceRequest);
  }
  const secretVerified = await checkSkillSecret(activeSession.skill_id, request.command);
  if (secretVerified) {
    confirmSession(activeSession);
    updateLastAccess(activeSession.skill_id);
    return proxy(activeSession, aliceRequest);
  }
  const tryAgain = await updateWrongSecret(activeSession);
  if (tryAgain) {
    return simpleResponse('Мимо! Секретное слово не совпало. Попробуй еще');
  }
  else {
    return simpleResponse('Мимо! Вспомнишь - приходи. Номер навыка то помнишь?');
  }
}

export function isQuitRequest(request: Request): boolean {
  return request.command.toLowerCase() === 'закрой навык';
}
