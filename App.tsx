import { NavigationContainer, DarkTheme, type Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { linking } from './src/navigation/linking';
import { RootNavigator } from './src/navigation/RootNavigator';
import { registerDefaultRecommendations } from './src/recommendations/registerDefaults';
import { colors } from './src/theme/colors';
import { fontAssets } from './src/theme/typography';

registerDefaultRecommendations();

const navTheme: Theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.background, card: colors.background, text: colors.text },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  // Hold on the night background until the fonts arrive, so text never reflows.
  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: colors.background }}>
      <NavigationContainer linking={linking} theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
