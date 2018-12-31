import { firstPromise } from '../utils/firstPromise';
import { db } from './db';

export type Skill = {
  skill_id: string;
  skill_url: string;
  secret: string;
  last_access: string;
}

export const dbSkills = db.ref('restricted_access/skills');

async function updateSkill(skillId: string, fields: Partial<Skill>): Promise<void> {
  await dbSkills.child(skillId).update(fields)
}

export async function getSkillById(skillId: string): Promise<Skill | null> {
  const rawSkill = await dbSkills.child(skillId).once('value');
  return rawSkill.val();
}

export async function checkSkillSecret(skillId: string, secret: string): Promise<boolean> {
  const skill = await getSkillById(skillId);
  return verifySkillSecret(skill, secret);
}

export async function updateLastAccess(skillId: string): Promise<void> {
  const now = new Date().toISOString();
  return updateSkill(skillId, {
    last_access: now,
  })
}

export function verifySkillSecret(skill: Skill | null, secret = ''): boolean {
  return skill !== null && equalWords(skill.secret, secret);
}

export function equalWords(...words: string[]): boolean {
  return Boolean(words.length) && words
    .map(word => word.toLowerCase())
    .every(word => word === words[0]);
}

export async function createSkill(skillId: string, skill: Partial<Skill>): Promise<void> {
  await dbSkills.child(skillId).set({
    ...skill,
  });
}

export async function addSkill(skill: Pick<Skill, 'skill_url' | 'secret' | 'skill_id'>): Promise<void> {
  const now = new Date().toISOString();

  return createSkill(skill.skill_id, {
    ...skill,
    last_access: now,
  });
}

export async function findUnusedId(ids: string[]): Promise<string> {
  const promises = ids.map(id => dbSkills.child(id).once('value'));
  try {
    const unexistsSnapshot = await firstPromise(promises, sn => !sn.exists());
    return unexistsSnapshot.key!;
  } catch (e) {
    return getNextAfterLastId();
  }
}

export async function getNextAfterLastId(): Promise<any> {
  const sn = await dbSkills.orderByKey().limitToLast(1).once('value');
  let lastId = '0';
  sn.forEach(a => {
    lastId = a.key!;
  });
  return String(parseInt(lastId, 10) + 1);
}
