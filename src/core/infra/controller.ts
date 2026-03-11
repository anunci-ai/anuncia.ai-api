/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from "./http-response";

export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse>;
}
