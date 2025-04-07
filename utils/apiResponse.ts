export interface ErrorResponse {
  code: number;
  message: string;
  detail?: string;
  field?: Record<string, string>;
  help?: string;
}

export interface MetadataType {
  page: number;
  limit: number;
  total_data: number;
  total_pages: number;
}

export interface ResponseType<T> {
  data?: T;
  metadata?: MetadataType;
  error?: ErrorResponse;
}

export function success<T>(data: T, metadata?: MetadataType): ResponseType<T> {
  return { data, metadata };
}

export function failure(code: number, message: string, detail?: string, field?: Record<string, string>, help?: string): ResponseType<null> {
  return {
    error: {
      code,
      message,
      detail,
      field,
      help,
    },
  };
}
