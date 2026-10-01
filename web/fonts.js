// Native builds bundle assets/fonts; the browser needs an @font-face per family.
const files = {
  'Geist-Regular': require('../assets/fonts/Geist-Regular.ttf'),
  'Geist-Medium': require('../assets/fonts/Geist-Medium.ttf'),
  'Geist-SemiBold': require('../assets/fonts/Geist-SemiBold.ttf'),
  'CormorantGaramond-SemiBold': require('../assets/fonts/CormorantGaramond-SemiBold.ttf'),
};

export function loadFonts() {
  const style = document.createElement('style');
  style.textContent = Object.entries(files)
    .map(([family, url]) => `@font-face { font-family: '${family}'; src: url(${url}); font-display: swap; }`)
    .join('\n');
  document.head.appendChild(style);
}
