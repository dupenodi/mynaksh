import { defineGroup } from './defineGroup';

export const products = defineGroup('products', {
  gemstone: {
    label: 'Gemstone',
    glyph: '◆',
    tint: '#2F4F8F',
    wash: '#E7ECF6',
    cta: 'View stone',
    image: require('../../../assets/images/gemstone.jpg'),
    blurb: 'Certified, ethically sourced and energised before it ships.',
    hint: 'the stone for the planet that needs strength in their chart; pick it from the chart, not always the same one',
    imageSet: 'gems',
    fields: 'facts: Planet, Finger, Metal, Day to start, Weight',
  },
  rudraksha: {
    label: 'Rudraksha',
    glyph: '❁',
    tint: '#6B4A2B',
    wash: '#F1E9DF',
    cta: 'View bead',
    image: require('../../../assets/images/rudraksha.jpg'),
    blurb: 'Lab-tested beads, strung and energised before they ship.',
    hint: 'a bead to wear for calm or focus; gentler and cheaper than a gemstone',
    fields: 'facts: Mukhi, Ruling planet, How to wear',
  },
  yantra: {
    label: 'Yantra',
    glyph: '⬡',
    tint: '#7A5A1F',
    wash: '#F5EEDD',
    cta: 'View yantra',
    image: require('../../../assets/images/yantra.jpg'),
    blurb: 'A copper yantra for your home altar, with placement instructions.',
    hint: 'a geometric charm for home or work',
    fields: 'facts: Planet, Placement, Direction',
  },
});
