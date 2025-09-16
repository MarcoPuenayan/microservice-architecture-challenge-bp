export const environment = {
  production: false,
  apiUrl: "https://#{DOMAIN_NAME}#/api",
  microApps: "https://#{DOMAIN_NAME}#/assets/microapp-cert.json",
  mainPath: "main",
  timeSession: 300,
  authProvider: {
    clientId: "#{FRONTEND_B2C_CLIENTID}#",
    tenantName: "#{FRONTEND_B2C_DOMAIN}#",
    tenantId: "#{FRONTEND_B2C_TENANTID}#",
    redirectUrl: "#{FRONTEND_B2C_REDIRECTURL}#",
    autority: "#{FRONTEND_B2C_AUTORITY}#",
    scopes: ["#{FRONTEND_B2C_SCOPES}#"],
    accessTokenName: "access_token",
    authToken: "auth_token",
    Apikey: "#{APIM_SUBSCRIPTION_KEY_BUSINESS_BANKING}#",
  },
  storage: {
    key: "#{FRONTEND_STORAGE_KEY}#",
  },
  google: {
    tagManagerId: "#{GOOGLE_TAG_MANAGER_ID}#",
    captchaSiteKey: "#{GOOGLE_CAPTCHA_SITE_KEY}#",
  },
  translationFiles: "https://#{DOMAIN_NAME}#/assets/locales/",
  hotJar: "#{HOTJAR_SITE_ID}#",
  webComponents: [
    "https://#{DOMAIN_NAME}#/remoteEntryComponent.js" // Usar cuando se tenga un microfrontend de tipo Web Component. Posteriormente definir las etiquetas de los web components a utilizar.
  ]
};
