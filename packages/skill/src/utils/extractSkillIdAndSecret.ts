import { Request } from '../alice/types';

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const skillIdAndSecretRegex = /^([\s\d]+)(.*)/;

export function extractSkillIdAndSecret(request: Request): {
  skillId?: string;
  secret?: string;
} {
  let skillId: string | undefined;
  let secret: string | undefined;
  const match = skillIdAndSecretRegex.exec(request.command.toLowerCase());
  if (match && match[1]) {
    skillId = match[1].replace(/\s+/g, '') || undefined;
  }
  if (match && match[2]) {
    secret = match[2];
  }
  return {
    skillId,
    secret,
  };
}

export function extractSkillUrl(request: Request): string | undefined {
  const url = request.original_utterance.trim().toLowerCase();
  const isValidUrl = urlRegex.test(url);
  return isValidUrl ? url : undefined;
}
