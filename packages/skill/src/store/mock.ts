import { dbSesssions } from './session';
import { dbSkills, Skill } from './skill';


export async function mock(): Promise<void> {
  const now = new Date().toISOString();
  const skills: Record<string, Skill> = {
    '1': {
      skill_id: '1',
      skill_url: 'https://alice-poem.now.sh/',
      secret: 'секрет',
      last_access: now,
    },
  }
  await dbSkills.set(skills);

  await dbSesssions.set({});
}
