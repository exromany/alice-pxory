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
