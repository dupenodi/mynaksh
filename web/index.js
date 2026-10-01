import { AppRegistry } from 'react-native';

import App from '../App';
import { loadFonts } from './fonts';

loadFonts();
AppRegistry.registerComponent('MyNaksh', () => App);
AppRegistry.runApplication('MyNaksh', { rootTag: document.getElementById('root') });
