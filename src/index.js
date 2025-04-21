import './style.scss';
import 'bootstrap';
import i18next from 'i18next';
import resources from './locale/index.js';
import app from './watcher.js';

const formElement = document.querySelector('form');
const runApp = async () => {
  await i18next.init({
    lng: 'ru',
    resources,
  });

  const state = {
    form: {
      data: {
        link: [],
      },
      errors: [],
    },
    process: {
      state: 'idle',
      error: null,
    },
    feeds: [],
    posts: [],
    shownPosts: [],
    currentPost: null,
  };

  const handleSubmit = app(state);

  formElement.addEventListener('submit', handleSubmit);
};

runApp();
