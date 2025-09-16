import {Environment} from "../app/interfaces/environment.interface";

export const environment: Environment = {
  production: true,
  apiUrl: 'https://#{DOMAIN_NAME}#/api',
  mainPath: '/main',
  authProvider: {
    accessTokenName: 'access_token',
    authToken: 'auth_token',
  },
  storage: {
    key: '#{FRONTEND_STORAGE_KEY}#',
  },
  translationFiles: 'https://#{DOMAIN_NAME}#/assets/locales/',
  depositHost: 'https://#{DOMAIN_NAME}#',
  depositPath: '/accounts/domain/deposit-account/v1/deposit-accounts',
  transactionPath: '/transactions/domain/current-accounts/v1/account-transactions',
  customerPath: '/customer/domain/customer-profile/v1/customer-profiles'
};
