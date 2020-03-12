const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
	entry: {
		main: "./src/index.jsx",
	},
	output: {
		filename: "bundle.js",
		path: __dirname + "/dist",
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
				resolve: {
					extensions: [".js", ".jsx"],
				},
			},
			{
				test: /\.html$/,
				use: {
					loader: "html-loader",
				},
			},
		],
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: "./src/index.html",
			filename: "./index.html",
		}),
	],
};
