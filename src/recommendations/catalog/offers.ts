import { defineGroup } from './defineGroup';

export const offers = defineGroup('offers', {
  promotion: {
    label: 'Offer',
    glyph: '✺',
    tint: '#B4692B',
    wash: '#F8E9DA',
    cta: 'Claim offer',
    image: require('../../../assets/images/promotion.jpg'),
    blurb: 'Applied automatically at checkout.',
    hint: 'a discount on another card in the same message, never alone',
    fields: 'facts: Code, Valid till',
  },
});
