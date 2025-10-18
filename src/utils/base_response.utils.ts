export interface BaseResponse<T = unknown> {
  message: string;
  success: boolean;
  data?: T;
}

export const ok = <T>(message: string, data?: T): BaseResponse<T> => ({
  message,
  success: true,
  data,
});

export const fail = (message: string): BaseResponse => ({
  message,
  success: false,
});
