import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './i18n';
import App from './App.svelte';

const app = new App({
	target: document.body,
});

export default app;