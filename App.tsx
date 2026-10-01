import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { Platform, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PhoneFrame } from './src/components/PhoneFrame';
import { RootNavigator } from './src/navigation/RootNavigator';
import { registerDefaultRecommendations } from './src/recommendations/registerDefaults';
import { colors } from './src/theme/colors';

registerDefaultRecommendations();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background, card: colors.background, text: colors.text },
};

export default function App() {
  const navigation = (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
    </NavigationContainer>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.background }}>
        {Platform.OS === 'web' ? <PhoneFrame>{navigation}</PhoneFrame> : navigation}
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
