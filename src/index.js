import './style.scss';
console.log("2222222222222Hello from index.js");
import 'bootstrap';
import i18next from 'i18next';
import resources from './locale/index.js';
import app from './watcher.js';

const runApp = async () => {
  await i18next.init({
    lng: 'ru',
    resources,
  });
};

app(runApp);
  