import type { ImageSourcePropType } from 'react-native';

// The verified human astrologer who joins conversations alongside the AI personas.
export const humanAstrologer: { name: string; role: string; image: ImageSourcePropType } = {
  name: 'Acharya Meera',
  role: 'Vedic astrologer',
  image: require('../../assets/images/astrologer.jpg'),
};
