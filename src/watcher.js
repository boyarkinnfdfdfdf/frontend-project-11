import onChange from 'on-change';
import {
  createFeeds,
  createPosts,
  renderSuccess,
  renderErrors,
  renderErrorsNetwork,
  renderErrorsParser,
  renderModal,
} from './renderHTML.js';
import parser from './parser.js';
import { uniqueId } from 'lodash';

const fetchAndUpdateFeed = async (url, watchedState) => {
  const response = await getFeed(url);
  const { feed: rawFeed, posts: rawPosts } = parser(response.data.contents);

  let feedId;
  const existingFeed = watchedState.feeds.find((f) => f.title === rawFeed.title);
  if (!existingFeed) {
    feedId = uniqueId();
    const feed = { ...rawFeed, id: feedId };
    watchedState.feeds.push(feed);
  } else {
    feedId = existingFeed.id;
  }

  const existingTitles = watchedState.posts.map((post) => post.title);
  const newPosts = rawPosts
    .filter((post) => !existingTitles.includes(post.title))
    .map((post) => ({
      ...post,
      id: uniqueId(),
      feedId,
    }));

  watchedState.posts.push(...newPosts);
};

const pollFeeds = (watchedState, interval = 5000) => {
  const updateAllFeeds = async () => {
    const { link } = watchedState.form.data;

    const promises = link.map((url) =>
      fetchAndUpdateFeed(url, watchedState).catch((err) => {
        console.error(`Ошибка при обновлении фида ${url}: ${err.message}`);
      })
    );

    await Promise.all(promises);

    setTimeout(updateAllFeeds, interval);
  };

  updateAllFeeds();
};

const handleSubmit = (watchedState) => async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const valueUrl = formData.get('url').trim();

  watchedState.process.state = 'sending';

  const errors = await isValid(valueUrl, watchedState.form.data.link);
  if (errors.length > 0) {
    watchedState.form.errors = errors;
    watchedState.process.state = 'validationError';
    return;
  }

  try {
    const response = await getFeed(valueUrl);
    const { feed: rawFeed, posts: rawPosts } = parser(response.data.contents);

    const feedId = uniqueId();
    const feed = { ...rawFeed, id: feedId };

    const newPosts = rawPosts.map((post) => ({
      ...post,
      id: uniqueId(),
      feedId,
    }));

    watchedState.feeds.push(feed);
    watchedState.posts.push(...newPosts);
    watchedState.form.data.link.push(valueUrl);
    watchedState.form.errors = [];
    watchedState.process.state = 'success';

    e.target.reset();
  } catch (error) {
    watchedState.process.error = error.message === 'Network Error' ? 'network' : 'parser';
    watchedState.process.state = 'failure';
  }
};

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'process.state':
        switch (value) {
          case 'success':
            renderSuccess();
            break;
          case 'validationError':
            renderErrors(state.form.errors);
            break;
          case 'failure':
            if (state.process.error === 'network') {
              renderErrorsNetwork();
            } else {
              renderErrorsParser();
            }
            break;
          default:
            break;
        }
        break;

      case 'currentPost': {
        const post = state.posts.find((p) => p.id === value);
        if (post) {
          renderModal(post.link, post.title, post.description);
        }
        break;
      }

      case 'shownPosts': {
        const lastSeenId = value[value.length - 1];
        const postLink = document.querySelector(`a[data-id="${lastSeenId}"]`);
        if (postLink) {
          postLink.classList.remove('fw-bold');
          postLink.classList.add('fw-normal');
        }
        break;
      }

      case 'posts':
        createPosts(state.posts, (postId) => {
          if (!state.shownPosts.includes(postId)) {
            state.shownPosts.push(postId);
          }
          state.currentPost = postId;
        });
        break;

      case 'feeds': {
        const lastFeed = state.feeds[state.feeds.length - 1];
        createFeeds(lastFeed);
        break;
      }

      default:
        break;
    }
  });

  pollFeeds(watchedState);

  return handleSubmit(watchedState);
};
