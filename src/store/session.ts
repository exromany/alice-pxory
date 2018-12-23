import { RequestSession } from '../types/alice';
import { db } from './db';
import { Skill } from './skill';

export type Session = {
  user_id: string;
  session_id: string;
  skill_id: string;
  skill_url: string;
  confirmed: boolean;
  detached: boolean;
  message_id: number;
  wrong_secret: number;
}

const WRONG_SECRET_ATTEMPTS = 3;

export const dbSesssions = db.ref('restricted_access/sessions');

async function createSession(sessionId: string, fields: Partial<Session>): Promise<void> {
  await dbSesssions.child(sessionId).set(fields);
}

async function updateSession(sessionId: string, fields: Partial<Session>): Promise<void> {
  await dbSesssions.child(sessionId).update(fields)
}

export async function getSessionById(userId: string): Promise<Session | null> {
  const rawSession = await dbSesssions.child(userId).once('value');
  return rawSession.val();
}

export async function getActiveSession(session: RequestSession): Promise<Session | null> {
  const lastSession = await getSessionById(session.user_id);
  if (lastSession && lastSession.session_id === session.session_id
    && lastSession.wrong_secret < WRONG_SECRET_ATTEMPTS
    && !lastSession.detached
  ) {
    return lastSession;
  }
  return null;
}

export async function startSession(session: RequestSession, skill: Skill): Promise<void> {
  return createSession(session.user_id, {
    user_id: session.user_id,
    session_id: session.session_id,
    skill_id: skill.skill_id,
    skill_url: skill.skill_url,
    message_id: 0,
    wrong_secret: 0,
  });
}

export async function confirmSession(session: Session): Promise<void> {
  return updateSession(session.user_id, {
    confirmed: true,
    message_id: 0,
  });
}

export async function detachSession(session: Session): Promise<void> {
  return createSession(session.user_id, {
    user_id: session.user_id,
    session_id: session.session_id,
    skill_id: session.skill_id,
    detached: true,
  });
}

export async function updateWrongSecret(session: Session): Promise<boolean> {
  await updateSession(session.user_id, {
    wrong_secret: session.wrong_secret + 1,
  });
  return session.wrong_secret + 1 < WRONG_SECRET_ATTEMPTS;
}

export async function updateMessageId(session: Session): Promise<void> {
  return updateSession(session.user_id, {
    message_id: session.message_id + 1,
  })
}
