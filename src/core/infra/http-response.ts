export type HttpResponse = {
  statusCode: number;
  body: unknown;
};

export function ok<T>(dto?: T): HttpResponse {
  return {
    statusCode: 200,
    body: dto,
  };
}

export function created<T>(dto?: T): HttpResponse {
  return {
    statusCode: 201,
    body: dto,
  };
}

export function clientError<T>(dto?: T): HttpResponse {
  return {
    statusCode: 400,
    body: dto,
  };
}

export function unauthorized<T>(dto?: T): HttpResponse {
  return {
    statusCode: 401,
    body: dto,
  };
}

export function notFound<T>(dto?: T): HttpResponse {
  return {
    statusCode: 404,
    body: dto,
  };
}

export function conflict<T>(dto?: T): HttpResponse {
  return {
    statusCode: 409,
    body: dto,
  };
}

export function tooManyRequests<T>(dto?: T): HttpResponse {
  return {
    statusCode: 429,
    body: dto,
  };
}

export function internalServerError<T>(dto?: T): HttpResponse {
  return {
    statusCode: 500,
    body: dto,
  };
}

export function forbidden<T>(dto?: T): HttpResponse {
  return {
    statusCode: 403,
    body: dto,
  };
}

export function notImplemented<T>(dto?: T): HttpResponse {
  return {
    statusCode: 501,
    body: dto,
  };
}
