import { Response } from './types/alice';

export function simpleResponse(text: string, endSession = false): Response {
  return {
    text,
    end_session: endSession,
  };
};

export function skipLogResponse(text: string): Response {
  return {
    text,
    end_session: false,
    skip_log: true,
  }
}
