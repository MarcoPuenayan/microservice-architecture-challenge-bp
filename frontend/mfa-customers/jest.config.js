module.exports = {
  preset: "jest-preset-angular",
  globalSetup: "jest-preset-angular/global-setup",
  transform: {
    "^.+\\.(ts|js|html)$": "jest-preset-angular",
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@pichincha/ds-core":
      "<rootDir>/node_modules/@pichincha/ds-core/dist/index.cjs",
    "^@pichincha/http":
      "<rootDir>/node_modules/@pichincha/http/build/cjs/main.js",
    "^./jwe$":
      "<rootDir>/node_modules/@pichincha/typescript-jwe/dist/cjs/main.js",
  },
};
