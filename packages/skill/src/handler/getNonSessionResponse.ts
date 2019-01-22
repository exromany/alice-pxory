import { Question } from '../alice/types';
import { restartSession, Session, startSession, startSkillRegistration } from '../store/session';
import { checkSkillSecret, getSkillById, verifySkillSecret } from '../store/skill';
import { extractSkillIdAndSecret, extractSkillUrl } from '../utils/extractSkillIdAndSecret';
import { CustomResponse } from './customResponse';
import { startProxying } from './getSessionResponse';
import { checkSkillUrl } from './proxy';
import {
  isHelpRequest,
  isHiRequest,
  isRegistrationRequest,
  isStopRequest,
  isVersionRequest,
  normalizeCommand,
} from './questions';
import {
  askForSecretMessage,
  continueRegistrationMessage,
  getResposnse,
  helpMessage,
  proxyErrorMessage,
  quitMessage,
  registrationHelpMessage,
  startRegistrationMessage,
  versionMessage,
  welcomeMessage,
  wrongSkillIdMessage,
} from './responses';

export async function getNonSessionResponse(aliceRequest: Question, userSession: Session | null): Promise<CustomResponse> {
  const { request, session } = aliceRequest;

  if (userSession) {
    const secretVerified = await checkSkillSecret(userSession.skill_id, normalizeCommand(request));
    if (secretVerified) {
      const newSession = await restartSession(userSession, session);
      return startProxying(newSession, aliceRequest);
    }
  }

  if (isVersionRequest(request)) {
    return versionMessage;
  }

  if (isHelpRequest(request)) {
    return helpMessage;
  }

  if (isHiRequest(request)) {
    return welcomeMessage;
  }

  if (isStopRequest(request)) {
    return quitMessage;
  }

  if (isRegistrationRequest(request)) {
    return startRegistrationMessage;
  }

  const skillUrl = extractSkillUrl(request);
  if (skillUrl) {
    const { correct, error } = await checkSkillUrl(skillUrl, aliceRequest);
    if (correct) {
      await startSkillRegistration(skillUrl, session);
      return continueRegistrationMessage;
    } else {
      return proxyErrorMessage(error!);
    }
  }

  const { skillId, secret } = extractSkillIdAndSecret(request);
  if (skillId) {
    const skill = await getSkillById(skillId);
    if (skill) {
      const secretVerified = verifySkillSecret(skill, secret);
      const userSession = await startSession(session, skill, secretVerified);
      if (userSession.status === 'active') {
        return startProxying(userSession, aliceRequest);
      }
      return askForSecretMessage;
    }
    return wrongSkillIdMessage;
  }

  const m = request.command.toLowerCase().match(/фраза (\d+)/);
  if (m) {
    return getResposnse(parseInt(m[1], 10));
  }

  return registrationHelpMessage;
}
