import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AstrologersScreen } from '../screens/AstrologersScreen';
import { ConversationScreen } from '../screens/ConversationScreen';
import { PersonaProfileScreen } from '../screens/PersonaProfileScreen';
import { colors } from '../theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Astrologers"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Astrologers" component={AstrologersScreen} />
      <Stack.Screen name="Profile" component={PersonaProfileScreen} />
      <Stack.Screen name="Chat" component={ConversationScreen} />
    </Stack.Navigator>
  );
}
