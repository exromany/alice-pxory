import { CustomResponse } from './customResponse';
import { proxy } from './proxy';
import { simpleResponse, buttonsResponse } from '../alice/simpleResponse';
import { startSession } from '../store/session';
import { getSkillById, updateLastAccess, verifySkillSecret } from '../store/skill';
import { Question, Request } from '../alice/types';

export async function getNonSessionResponse(aliceRequest: Question): Promise<CustomResponse> {
  const { request, session } = aliceRequest;
  if (isHelpRequest(request)) {
    return simpleResponse('Это приватный навык! он помогает тестировать другие навыки, еще не опубликованные.');
  }
  if (isHiRequest(request)) {
    return simpleResponse('Привет! Это приватный навык. Назови номер твоего навыка чтобы продолжить');
  }
  const { skillId, secret } = extractSkillIdAndSecret(request);
  if (!skillId) {
    return buttonsResponse('Зарегистрировать свой навык можно по ссылке', [{
      title: 'Регистрация навыка',
      url: 'https://alice-proxy.now.sh/',
    }]);
  }
  const skill = await getSkillById(skillId);
  if (skill) {
    const secretVerified = verifySkillSecret(skill, secret);
    const activeSession = await startSession(session, skill, secretVerified);
    if (activeSession.confirmed) {
      updateLastAccess(activeSession.skill_id);
      return proxy(activeSession, aliceRequest);
    }
    return simpleResponse('Теперь назови секретное слово');
  }
  return simpleResponse('Хмм, не могу найти навык... Назови номер навыка снова');
}

export function isHelpRequest(request: Request): boolean {
  const HELP_PHRASES = ['помоги', 'помощь', 'что ты умеешь', 'help', 'справка', 'подскажи', 'дай подсказку', 'подсказка'];
  return HELP_PHRASES.includes(request.command.toLowerCase());
}

export function isHiRequest(request: Request): boolean {
  const HI_PHRESES = ['', 'привет', 'как дела']
  return HI_PHRESES.includes(request.command.toLowerCase());
}

export function extractSkillIdAndSecret(request: Request): {skillId?: string, secret?: string} {
  return {
    skillId: request.command,
    secret: undefined,
  }
}
