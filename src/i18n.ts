import { init, addMessages } from "svelte-i18n"
import zhTW from './zh_TW.json';

addMessages('zh_TW', zhTW);

init({
  fallbackLocale: 'zh_TW',
  initialLocale: 'zh_TW',
})