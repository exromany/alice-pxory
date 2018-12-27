import AbortController from 'abort-controller';
import fetch from 'node-fetch';
import { simpleResponse } from '../alice/simpleResponse';
import { Session, updateMessageId } from '../store/session';
import { Question, Answer, Request } from '../alice/types';
import { CustomResponse, proxyResponse } from './customResponse';

const EMPTY_REQUEST: Request = {
  command: '',
  nlu: {
    entities: [],
    tokens: []
  },
  original_utterance: '',
  type: 'SimpleUtterance'
}

export async function proxy(session: Session, data: Question): Promise<CustomResponse> {
  const request: Question = {
    ...data,
    request: {
      ...(session.message_id === 0
        ? EMPTY_REQUEST
        : data.request
      )
    },
    session: {
      ...data.session,
      message_id: session.message_id,
      new: session.message_id === 0,
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
    return simpleResponse(`Запрос ка навыку прервался с ошибкой: "${message}"`);
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
