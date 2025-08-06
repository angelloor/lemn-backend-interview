export interface Payload {
  iat?: number;
  exp?: number;
}

export interface SignInPayload extends Payload {
  id: string;
  name: string;
  email: string;
}
