import { QuestionSession, Response, Version, Answer } from './types';
export function buildAnswer(response: Response, session: QuestionSession, version: Version): Answer {
  return {
    response,
    session: {
      session_id: session.session_id,
      skill_id: session.user_id,
      user_id: session.user_id,
    },
    version,
  };
}
