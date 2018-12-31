import { QuestionSession, Request } from './../alice/types';

const SERVICE_PHRASES = ['ping', 'test'];
const HI_PHRESES = ['', 'привет', 'как дела']
const HELP_PHRASES = ['помоги', 'помощь', 'что ты умеешь', 'help', 'справка', 'подскажи', 'дай подсказку', 'подсказка'];
const HOW_IT_WORK_PHRASES = ['как это работает?', 'подробнее', 'по подробнее'];
const YES_PHRASES = ['да', 'давай', 'поехали', 'начинай', 'начали', 'а то', 'конечно', 'согласен'];
const BREAK_PHRASES = ['хватит', 'замолчи', 'я не знаю', 'я передумал', 'надоело', 'стоп', 'пока'];
const REGISTRATION_WORDS = ['регистрация', 'регистрироваться', 'зарегистрироваться', 'зарегистрировать', 'запиши'];

export function normalizeCommand(request: Request): string {
  return request.command.toLowerCase();
}

export function isFirstEmptyRequest(request: Request, session: QuestionSession): boolean {
  return session.new && request.command === '';
}

export function isServiceRequest(request: Request): boolean {
  return SERVICE_PHRASES.includes(normalizeCommand(request));
}

export function isQuitRequest(request: Request): boolean {
  return normalizeCommand(request) === 'закрой навык';
}

export function isStopRequest(request: Request): boolean {
  return BREAK_PHRASES.includes(normalizeCommand(request));
}

export function isHelpRequest(request: Request): boolean {
  return HELP_PHRASES.includes(normalizeCommand(request));
}

export function isHowItWirkRequest(request: Request): boolean {
  return HOW_IT_WORK_PHRASES.includes(normalizeCommand(request));
}

export function isHiRequest(request: Request): boolean {
  return HI_PHRESES.includes(normalizeCommand(request));
}

export function isYesRequest(request: Request): boolean {
  return YES_PHRASES.includes(normalizeCommand(request));
}

export function isRegistrationRequest(request: Request): boolean {
  return request.nlu!.tokens.some(token => REGISTRATION_WORDS.includes(token.toLocaleLowerCase()));
}
