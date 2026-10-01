import type { ImageSourcePropType } from 'react-native';

// Artwork for the image sets, generated with ChatGPT as grids and cropped. Keys match imageSets.ts.
// Metro needs static require() calls, so each file is listed here.

export const gemImages: Partial<Record<string, ImageSourcePropType>> = {
  'ruby': require('../../assets/images/gems/ruby.jpg'),
  'pearl': require('../../assets/images/gems/pearl.jpg'),
  'red-coral': require('../../assets/images/gems/red-coral.jpg'),
  'emerald': require('../../assets/images/gems/emerald.jpg'),
  'yellow-sapphire': require('../../assets/images/gems/yellow-sapphire.jpg'),
  'diamond': require('../../assets/images/gems/diamond.jpg'),
  'blue-sapphire': require('../../assets/images/gems/blue-sapphire.jpg'),
  'hessonite': require('../../assets/images/gems/hessonite.jpg'),
  'cats-eye': require('../../assets/images/gems/cats-eye.jpg'),
};

export const tarotImages: Partial<Record<string, ImageSourcePropType>> = {
  'the-fool': require('../../assets/images/tarot/the-fool.jpg'),
  'the-magician': require('../../assets/images/tarot/the-magician.jpg'),
  'the-high-priestess': require('../../assets/images/tarot/the-high-priestess.jpg'),
  'the-empress': require('../../assets/images/tarot/the-empress.jpg'),
  'the-emperor': require('../../assets/images/tarot/the-emperor.jpg'),
  'the-hierophant': require('../../assets/images/tarot/the-hierophant.jpg'),
  'the-lovers': require('../../assets/images/tarot/the-lovers.jpg'),
  'the-chariot': require('../../assets/images/tarot/the-chariot.jpg'),
  'strength': require('../../assets/images/tarot/strength.jpg'),
  'the-hermit': require('../../assets/images/tarot/the-hermit.jpg'),
  'wheel-of-fortune': require('../../assets/images/tarot/wheel-of-fortune.jpg'),
  'justice': require('../../assets/images/tarot/justice.jpg'),
  'the-hanged-man': require('../../assets/images/tarot/the-hanged-man.jpg'),
  'death': require('../../assets/images/tarot/death.jpg'),
  'temperance': require('../../assets/images/tarot/temperance.jpg'),
  'the-devil': require('../../assets/images/tarot/the-devil.jpg'),
  'the-tower': require('../../assets/images/tarot/the-tower.jpg'),
  'the-star': require('../../assets/images/tarot/the-star.jpg'),
  'the-moon': require('../../assets/images/tarot/the-moon.jpg'),
  'the-sun': require('../../assets/images/tarot/the-sun.jpg'),
  'judgement': require('../../assets/images/tarot/judgement.jpg'),
  'the-world': require('../../assets/images/tarot/the-world.jpg'),
};

export const tarotCardBack: ImageSourcePropType = require('../../assets/images/tarot/card-back.jpg');
