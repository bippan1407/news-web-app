export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
} as const;

export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];

export type IGetParams<
  PathParams = Record<string, never>,
  Query = Record<string, never>,
> = {
  pathParams?: PathParams;
  query?: Query;
};

export type IPostParams<
  PathParams = Record<string, never>,
  Query = Record<string, never>,
  Body = unknown,
> = {
  pathParams?: PathParams;
  query?: Query;
  body?: Body;
};

export type IPutParams<
  PathParams = Record<string, never>,
  Query = Record<string, never>,
  Body = unknown,
> = {
  pathParams?: PathParams;
  query?: Query;
  body?: Body;
};

export type IPatchParams<
  PathParams = Record<string, never>,
  Query = Record<string, never>,
  Body = unknown,
> = {
  pathParams?: PathParams;
  query?: Query;
  body?: Body;
};

export type IDeleteParams<
  PathParams = Record<string, never>,
  Query = Record<string, never>,
> = {
  pathParams?: PathParams;
  query?: Query;
};

export type ApiResponse<T extends object> =
  | ({ status: "success" } & T)
  | { status: "error"; results: { message: string; code: string } };
