import path from "path";
import { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const devServer: DevServerConfiguration = {
  static: path.join(__dirname, "./src/public"),
  compress: true,
  port: 3000,
};

const config: Configuration = {
  devtool: 'source-map',
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
            plugins: ["@babel/transform-runtime"]
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.pug$/i,
        use: ['pug-loader']
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer,
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/public/views/index.pug'
    }),
  ],
};
export default config;