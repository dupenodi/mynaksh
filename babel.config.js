module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Reanimated 4 runs its worklets through this plugin. It must stay last.
  plugins: ['react-native-worklets/plugin'],
};
