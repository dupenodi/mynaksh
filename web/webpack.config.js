// The hosted web build: the same app through react-native-web. Native builds use Metro.
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const root = path.resolve(__dirname, '..');

// Packages that ship untranspiled JSX, Flow or worklets and must go through Babel.
const compiled = [
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-gesture-handler',
  'react-native-screens',
  'react-native-safe-area-context',
  'react-native-svg',
  'lucide-react-native',
  '@react-navigation',
  '@react-native-clipboard',
].map((name) => path.join(root, 'node_modules', name));

module.exports = (_env, argv) => ({
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: path.join(root, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
    alias: { 'react-native$': 'react-native-web' },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: [path.join(root, 'src'), path.join(root, 'App.tsx'), __dirname, ...compiled],
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            // Leave import/export to webpack, which also handles the require() calls for images.
            presets: [['module:@react-native/babel-preset', { disableImportExportTransform: true }]],
            sourceType: 'unambiguous',
            plugins: ['react-native-worklets/plugin'],
          },
        },
      },
      // Library ESM builds import without file extensions, and some mix in require().
      { test: /\.m?js$/, type: 'javascript/auto', resolve: { fullySpecified: false } },
      { test: /\.(png|jpe?g|ttf)$/, type: 'asset/resource' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.join(__dirname, 'index.html') }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(argv.mode !== 'production'),
      // Worklets checks for Jest at load time; browsers have no process object.
      'process.env.JEST_WORKER_ID': 'undefined',
    }),
  ],
  devServer: {
    port: 5173,
    historyApiFallback: true,
    proxy: [{ context: ['/api'], target: 'http://localhost:8787' }],
  },
  performance: { hints: false },
});
