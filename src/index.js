import './style.scss';
import 'bootstrap';
import i18next from 'i18next';
import resources from './locale/index.js';
import app from './watcher.js';

document.addEventListener('DOMContentLoaded', async () => {
  await i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  app();
});