const moduleFederation = `
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: "auto",
    uniqueName: "test1",
    scriptType: "text/javascript",
  },
  optimization: {

    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({

      name: "test1",
      library: { type: "var", name: "test1" },
      filename: "remoteEntry.js",
      exposes: {
        "./component1": "./src/bootstrap.ts",
      },

      shared: ["@angular/core", "@angular/common", "@angular/router","@pichincha/ds-core","@pichincha/ds-angular"],
    }),
  ],
};

`;
module.exports = moduleFederation;
