import { CustomResponse } from '../handler/customResponse';
import { Question } from '../alice/types';
import { db } from './db';

export type RequestLog = {
  request: string;
  response: string;
  command: string;
  session_id: string;
  proxy: boolean;
  ts: number;
  date: string;
}

export const dbLogs = db.ref('logs/requests');

export async function logRequestAndResponse(request: Question, response: CustomResponse): Promise<void> {
  if (response.skip_log) {
    return;
  }

  const now = new Date();
  const requestLog: RequestLog = {
    request: JSON.stringify(request),
    response: JSON.stringify(response),
    command: request.request.command,
    session_id: request.session.session_id,
    proxy: Boolean(response.via_proxy),
    ts: now.valueOf(),
    date: now.toISOString(),
  }
  dbLogs.child(yyyymmdd(now)).push(requestLog);
}

function yyyymmdd(date: Date = new Date()): string {
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();

  return [date.getFullYear(),
          `${mm <= 9 ? '0' : ''}${mm}`,
          `${dd <= 9 ? '0' : ''}${dd}`,
         ].join('-');
};
