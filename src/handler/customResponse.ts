import { Response } from '../alice/types';

export type CustomResponse = Response & Partial<{
  via_proxy: boolean;
  skip_log: boolean;
}>

export function skipLogResponse(text: string): CustomResponse {
  return {
    text,
    end_session: false,
    skip_log: true,
  };
}

export function proxyResponse(response: Response): CustomResponse {
  return {
    ...response,
    via_proxy: true,
  }
}

export function cleanupResponse(response: CustomResponse): Response {
  return {
    ...response,
    via_proxy: undefined,
    skip_log: undefined,
  } as Response;
}
