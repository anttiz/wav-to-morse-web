module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript"
  ],
  plugins: [
    // ["@babel/plugin-transform-typescript", {"allowDeclareFields": true}],
    ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport : true }],
    ["@babel/plugin-proposal-class-properties"],
    ["@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ],
  assumptions: {
    // setPublicClassFields: true
  }
}
