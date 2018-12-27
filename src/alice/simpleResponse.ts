import { Button, Response } from './types';

export function simpleResponse(text: string, endSession = false): Response {
  return {
    text,
    end_session: endSession,
  };
};

export function buttonsResponse(text: string, buttons: Button[]): Response {
  return {
    text,
    buttons,
    end_session: false,
  }
}
