import { proxy } from './proxy';
import { simpleResponse, skipLogResponse } from './simpleResponse';
import { confirmSession, detachSession, getActiveSession, startSession, updateWrongSecret } from './store/session';
import { checkSkillSecret, getSkillById, updateLastAccess } from './store/skill';
import { AliceRequest, Response } from './types/alice';

const HELP_PHRASES = ['помоги', 'помощь', 'что ты умеешь', 'help', 'справка', 'подскажи', 'дай подсказку', 'подсказка'];

export async function handler(aliceRequest: AliceRequest): Promise<Response> {
  const { request, session } = aliceRequest;

  if (request.command === 'test') {
    return skipLogResponse('test');
  }
  if (request.command === 'ping') {
    return skipLogResponse('pong');
  }

  const activeSession = await getActiveSession(session);

  if (request.command === 'закрой навык') {
    if (activeSession) {
      await detachSession(activeSession);
    }
    return simpleResponse('Пока!', true);
  }

  if (activeSession && activeSession.confirmed) {
    return proxy(activeSession, aliceRequest);
  }

  if (activeSession) {
    const skill = await checkSkillSecret(activeSession.skill_id, request.command);
    if (skill) {
      confirmSession(activeSession);
      updateLastAccess(activeSession.skill_id);

      return proxy(activeSession, aliceRequest);
    }
    const tryAgain = await updateWrongSecret(activeSession);
    if (tryAgain) {
      return simpleResponse('Мимо! Секретное слово не совпало. Попробуй еще');
    }
    return simpleResponse('Мимо! Вспомнишь - приходи. Номер навыка то помнишь?');
  }

  if (HELP_PHRASES.includes(request.command.toLowerCase())) {
    return simpleResponse('Это частный навык! он помогает тестировать другие навыки, еще не опубликованные.');
  }

  if (request.command) {
    const skillId = request.command;
    const skill = await getSkillById(skillId);
    if (skill) {
      startSession(session, skill);
      return simpleResponse('Теперь назови секретное слово');
    }

    return simpleResponse('Хмм, не могу найти навык... Назови номер навыка снова');
  }

  return simpleResponse('Привет! Помнишь номер навыка?');
};


