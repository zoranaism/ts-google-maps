const path = require("path");
const dotenv = require("dotenv");

let result = dotenv.config();
if (result.error) {
  throw result.error;
}

const {
  // ...
  DefinePlugin,
  // ...
} = require('webpack')

plugins: [
  // ...
  new DefinePlugin({
    'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY)
  })
  // ...
]

module.exports = {
  mode: "development",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "dist",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  node: {
    fs: "empty",
  }
};
