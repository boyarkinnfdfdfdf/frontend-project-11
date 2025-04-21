// eslint-disable-next-line no-param-reassign
import onChange from 'on-change';
import { isEmpty, uniqueId } from 'lodash';
import axios from 'axios';
import isValid from './validate.js';
import parser from './parser.js';
import {
  renderErrors, renderSuccess, renderErrorsParser, renderErrorsNetwork, renderModal, createPosts,
  createFeeds,
} from './renderHTML.js';

const getUrlWithProxy = (url) => {
  const proxied = new URL('https://allorigins.hexlet.app/get');
  proxied.searchParams.set('disableCache', 'true');
  proxied.searchParams.set('url', url);
  return proxied.toString();
};

const getFeed = async (link) => {
  const url = getUrlWithProxy(link);
  return axios.get(url);
};

const updateAllFeeds = (watchedState) => {
  const update = async () => {
    const promises = watchedState.feeds.map(async (feed) => {
      try {
        const response = await getFeed(feed.link);
        const { posts } = parser(response.data.contents);
        const existingPostLinks = watchedState.posts.map((post) => post.link);
        const newPosts = posts
          .filter((post) => !existingPostLinks.includes(post.link))
          .map((post) => ({
            ...post,
            id: uniqueId(),
            feedId: feed.id,
          }));
        watchedState.posts.push(...newPosts);
      } catch (err) {
        // intentionally ignored
      }
    });

    await Promise.all(promises);
    setTimeout(() => updateAllFeeds(watchedState), 5000);
  };

  update();
};

const handleSubmit = (watchedState) => async (e) => {
  e.preventDefault();
  watchedState.feedAdding = 'loading';

  const formData = new FormData(e.target);
  const valueUrl = formData.get('url');

  const errors = await isValid(valueUrl, watchedState.form.data.link);
  if (!isEmpty(errors)) {
    watchedState.feedAdding = 'validationFailed';
    watchedState.errors = errors;
    return;
  }

  try {
    const response = await getFeed(valueUrl);
    const { feed, posts } = parser(response.data.contents);

    const feedId = uniqueId();
    const feedWithId = {
      id: feedId,
      title: feed.title,
      description: feed.description,
      link: valueUrl,
    };
    const postsWithId = posts.map((post) => ({
      ...post,
      id: uniqueId(),
      feedId,
    }));

    watchedState.feeds.push(feedWithId);
    watchedState.posts.push(...postsWithId);
    watchedState.feedAdding = 'added';
    watchedState.form.data.link.push(valueUrl);
    e.target.reset();
  } catch (err) {
    watchedState.feedAdding = 'failed';
    if (err.message === 'Network Error') {
      watchedState.errorMessage = 'Network Error';
    } else {
      watchedState.errorMessage = 'Parser Error';
    }
  }
};

const handleClick = (watchedState) => (e) => {
  const { id } = e.target.dataset;
  watchedState.shownPosts.push(id);
  watchedState.currentPost = id;
};

export default async (runApp) => {
  await runApp();
  const state = {
    form: {
      data: {
        link: [],
      },
    },
    feedAdding: 'idle',
    errors: [],
    feeds: [],
    posts: [],
    shownPosts: [],
    currentPost: null,
    errorMessage: '',
  };

  const watchedState = onChange(state, (path, value, previousValue) => {
    if (path === 'currentPost') {
      const post = state.posts.find((p) => p.id === value);
      if (post) {
        renderModal(post.link, post.title, post.description);
      }
    }
    if (path === 'feedAdding') {
      if (value === 'added') {
        renderSuccess();
      }
    }
    if (path === 'shownPosts') {
      const lastId = value[value.length - 1];
      const a = document.querySelector(`a[data-id="${lastId}"]`);
      if (a) {
        a.classList.remove('fw-bold');
        a.classList.add('fw-normal');
      }
    }
    if (path === 'errors' && !isEmpty(value)) {
      renderErrors(value);
    }
    if (path === 'errorMessage') {
      if (value === 'Network Error') {
        renderErrorsNetwork();
      } else {
        renderErrorsParser();
      }
    }
    if (path === 'posts') {
      const oldIds = new Set(previousValue.map((post) => post.id));
      const newPosts = value.filter((post) => !oldIds.has(post.id));
      createPosts(newPosts, handleClick(watchedState));
    }
    if (path === 'feeds') {
      const oldIds = new Set(previousValue.map((feed) => feed.id));
      const newFeeds = value.filter((feed) => !oldIds.has(feed.id));
      newFeeds.forEach((feed) => createFeeds(feed));
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', handleSubmit(watchedState));
  updateAllFeeds(watchedState);
};
