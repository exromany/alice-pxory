import AbortController from 'abort-controller';
import fetch from 'node-fetch';

import { Answer, Question, Request } from '../alice/types';
import { Session, updateMessageId } from '../store/session';
import { CustomResponse, proxyResponse } from './customResponse';
import { proxyErrorMessage } from './responses';

const EMPTY_REQUEST: Request = {
  command: '',
  nlu: {
    entities: [],
    tokens: []
  },
  original_utterance: '',
  type: 'SimpleUtterance'
}

export async function proxy(session: Session, aliceRequest: Question): Promise<CustomResponse> {
  const messageId = (session.data || {}).message_id || 0;
  const isFirstMessage = messageId === 0;
  const request: Question = {
    ...aliceRequest,
    request: {
      ...(isFirstMessage
        ? EMPTY_REQUEST
        : aliceRequest.request
      )
    },
    session: {
      ...aliceRequest.session,
      message_id: messageId,
      new: isFirstMessage,
    }
  }

  const body = JSON.stringify(request);

  updateMessageId(session);

  try {
    const { response } = await externalCall(session.skill_url, body) as Answer;
    return proxyResponse(response);
  } catch (err) {
    let { message } = err;
    switch (err.name) {
      case 'AbortError': message = 'Timeout error'; break;
      case 'FetchError': message = 'Request failed'; break;
    }
    return proxyErrorMessage(message);
  }
}

export async function checkSkillUrl(url: string, aliceRequest: Question): Promise<{ correct: boolean, error?: string }> {
  const request: Question = {
    ...aliceRequest,
    request: {
      command: 'test',
      nlu: {
        entities: [],
        tokens: [ 'test' ]
      },
      original_utterance: 'test',
      type: 'SimpleUtterance'
    },
    session: {
      ...aliceRequest.session,
      message_id: 0,
      new: true,
    }
  }

  const body = JSON.stringify(request);

  try {
    const { response: { text } } = await externalCall(url, body) as Answer;
    const wrongResponse = text === undefined;
    return {
      correct: !wrongResponse,
      error: wrongResponse ? 'Неправильный формат ответа' : undefined,
    }
  } catch (err) {
    let { message } = err;
    switch (err.name) {
      case 'AbortError': message = 'Timeout error'; break;
      case 'FetchError': message = 'Request failed'; break;
    }
    return {
      correct: false,
      error: message,
    };
  }
}

export async function externalCall(url: string, body: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => { controller.abort(); },
    1200,
  );

  const rawResponse = await fetch(url, {
    signal: controller.signal,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  } as any);
  clearTimeout(timeout);

  return rawResponse.json();
}
