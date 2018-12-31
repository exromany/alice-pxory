import { QuestionSession } from '../alice/types';
import { db } from './db';
import { Skill } from './skill';

export type Session = {
  user_id: string;
  session_id: string;
  skill_id: string;
  skill_url: string;
  status: SessionStatus;
  data: SessionData;
}

export type SessionData = Partial<{
  wrong_secret_count: number;
  message_id: number;
}>

export type SessionStatus = 'active' | 'confirmation' | 'registration' | 'detached';

const WRONG_SECRET_ATTEMPTS = 3;

export const dbSesssions = db.ref('restricted_access/sessions');

async function createSession(sessionId: string, fields: Partial<Session>): Promise<void> {
  await dbSesssions.child(sessionId).set(fields);
}

async function updateSession(sessionId: string, fields: Partial<Session>): Promise<void> {
  await dbSesssions.child(sessionId).update(fields);
}

async function updateSessionData(sessionId: string, fields: SessionData): Promise<void> {
  await dbSesssions.child(`${sessionId}/data`).update(fields);
}

export async function getSessionById(userId: string): Promise<Session | null> {
  const rawSession = await dbSesssions.child(userId).once('value');
  return rawSession.val();
}

export async function getUserSession(session: QuestionSession): Promise<Session | null> {
  const lastSession = await getSessionById(session.user_id);
  if (lastSession && lastSession.session_id === session.session_id
    && lastSession.status !== 'detached'
  ) {
    return lastSession;
  }
  return null;
}

export async function startSession(session: QuestionSession, skill: Skill, confirmed = false): Promise<Session> {
  const newSession: Session = {
    user_id: session.user_id,
    session_id: session.session_id,
    skill_id: skill.skill_id,
    skill_url: skill.skill_url,
    ...(confirmed
      ? {
        status: 'active',
        data: {
          message_id: 0,
        }
      }
      : {
        status: 'confirmation',
        data: {
          wrong_secret_count: 0,
        }
      }
    ),
  }
  await createSession(session.user_id, newSession);
  return newSession;
}

export async function confirmSession(session: Session): Promise<void> {
  await updateSession(session.user_id, {
    status: 'active',
    data: {
      message_id: 0,
    },
  });
}

export async function detachSession(session: Session): Promise<void> {
  return createSession(session.user_id, {
    ...session,
    status: 'detached',
    data: {},
  });
}

export async function updateWrongSecret(session: Session): Promise<boolean> {
  const wrongSecretCount = (session.data.wrong_secret_count || 0) + 1;
  if (wrongSecretCount < WRONG_SECRET_ATTEMPTS) {
    updateSessionData(session.user_id, {
      wrong_secret_count: wrongSecretCount,
    });
    return true;
  }
  await detachSession(session);
  return false;
}

export async function updateMessageId(session: Session): Promise<void> {
  const messageId = ((session.data || {}).message_id || 0) + 1;
  return updateSessionData(session.user_id, {
    message_id: messageId,
  });
}

export async function startSkillRegistration(skillUrl: string, session: QuestionSession): Promise<void> {
  const newSession: Session = {
    user_id: session.user_id,
    session_id: session.session_id,
    skill_id: '',
    skill_url: skillUrl,
    status: 'registration',
    data: {},
  }
  return createSession(session.user_id, newSession);
}

export async function finishSkillRegistration(skillId: string, session: Session): Promise<void> {
  return updateSession(session.user_id, {
    skill_id: skillId,
  });
}
