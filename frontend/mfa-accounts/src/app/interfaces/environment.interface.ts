export interface Environment {
  readonly production: boolean,
  readonly apiUrl: string,
  mainPath: string,
  timeSession?: number,
  authProvider: {
    accessTokenName: string,
    authToken: string
  },
  storage: {
    key: string
  },
  translationFiles: string,
  depositHost: string,
  depositPath: string,
  customerPath: string
}
