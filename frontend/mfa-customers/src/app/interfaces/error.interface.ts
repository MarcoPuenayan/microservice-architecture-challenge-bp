export interface ApiError {
  title: string;
  detail: string;
  instance: string;
  type: string;
  resource: string;
  component: string;
  backend: string;
  errors: Array<{
    code: string;
    message: string;
    businessMessage: string;
  }>;
}
