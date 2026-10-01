import { defineGroup } from './defineGroup';

export const learn = defineGroup('learn', {
  article: {
    label: 'Article',
    glyph: '¶',
    tint: '#8A5A2B',
    wash: '#F4EADD',
    cta: 'Read now',
    image: require('../../../assets/images/article.jpg'),
    blurb: 'A short read from the MyNaksh library. About 6 minutes.',
    hint: 'a short read that explains a concept you mentioned',
    fields: '"why" is a two-sentence teaser of the article',
  },
});
