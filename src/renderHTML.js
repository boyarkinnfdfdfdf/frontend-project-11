import i18next from 'i18next';

export const createFeedbackElement = () => {
  const elem = document.createElement('p');
  elem.classList.add(
    'feedback',
    'm-0',
    'position-absolute',
    'small',
    'text-success',
  );
  document.querySelector('form').parentNode.appendChild(elem);
  return elem;
};


const getFeedbackElement = () => {
  return document.querySelector('p.feedback') ?? createFeedbackElement();
};

export const renderErrors = (errors) => {
  const elem = getFeedbackElement();
  elem.classList.remove('text-success');
  elem.classList.add('text-danger');
  elem.textContent = errors.join();
};

export const renderErrorsParser = () => {
  const elem = getFeedbackElement();
  elem.classList.remove('text-success');
  elem.classList.add('text-danger');
  elem.textContent = i18next.t('errorParser');
};

export const renderErrorsNetwork = () => {
  const elem = getFeedbackElement();
  elem.classList.remove('text-success');
  elem.classList.add('text-danger');
  elem.textContent = i18next.t('errorNetwork');
};

export const renderSuccess = () => {
  const elem = getFeedbackElement();
  elem.classList.remove('text-danger');
  elem.classList.add('text-success');
  elem.textContent = i18next.t('successUrl');
};


const renderHTML = () => {
  const divPosts = document.querySelector('div.posts');
  const divFeeds = document.querySelector('div.feeds');

 
  const divCardFeeds = document.createElement('div');
  divCardFeeds.classList.add('card', 'border-0');
  divFeeds.appendChild(divCardFeeds);

  const divCardBodyFeeds = document.createElement('div');
  divCardBodyFeeds.classList.add('card-body');
  divCardFeeds.appendChild(divCardBodyFeeds);

  const h2Feeds = document.createElement('h2');
  h2Feeds.classList.add('card-title', 'h4');
  h2Feeds.textContent = i18next.t('feeds');
  divCardBodyFeeds.appendChild(h2Feeds);

  const ulFeeds = document.createElement('ul');
  ulFeeds.classList.add('list-group', 'border-0', 'rounded-0');
  divCardFeeds.appendChild(ulFeeds);

 
  const divCardPosts = document.createElement('div');
  divCardPosts.classList.add('card', 'border-0');
  divPosts.appendChild(divCardPosts);

  const divCardBodyPosts = document.createElement('div');
  divCardBodyPosts.classList.add('card-body');
  divCardPosts.appendChild(divCardBodyPosts);

  const h2Posts = document.createElement('h2');
  h2Posts.classList.add('card-title', 'h4');
  h2Posts.textContent = i18next.t('posts');
  divCardBodyPosts.appendChild(h2Posts);

  const ulPosts = document.createElement('ul');
  ulPosts.classList.add('list-group', 'border-0', 'rounded-0');
  divCardPosts.appendChild(ulPosts);
};


export const createFeeds = (feed) => {
  if (!document.querySelector('div.feeds ul')) {
    renderHTML();
  }

  const ulFeeds = document.querySelector('div.feeds ul');

  const liFeeds = document.createElement('li');
  liFeeds.classList.add('list-group-item', 'border-0', 'border-end-0');

  const h3Feeds = document.createElement('h3');
  h3Feeds.classList.add('h6', 'm-0');
  h3Feeds.textContent = feed.title;

  const pFeeds = document.createElement('p');
  pFeeds.classList.add('m-0', 'small', 'text-black-50');
  pFeeds.textContent = feed.description;

  liFeeds.appendChild(h3Feeds);
  liFeeds.appendChild(pFeeds);
  ulFeeds.appendChild(liFeeds);
};


export const createPosts = (posts, handleClick) => {
  if (!document.querySelector('div.posts ul')) {
    renderHTML();
  }

  const ulPosts = document.querySelector('div.posts ul');

  posts.forEach((post) => {
    const liPosts = document.createElement('li');
    liPosts.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const aPosts = document.createElement('a');
    aPosts.classList.add('fw-bold');
    aPosts.setAttribute('target', '_blank');
    aPosts.setAttribute('href', post.link);
    aPosts.setAttribute('rel', 'noopener noreferrer');
    aPosts.textContent = post.title;
    aPosts.dataset.id = post.id;

    const buttonPosts = document.createElement('button');
    buttonPosts.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonPosts.dataset.id = post.id;
    buttonPosts.setAttribute('type', 'button');
    buttonPosts.textContent = i18next.t('buttonWatch');
    buttonPosts.dataset.bsToggle = 'modal';
    buttonPosts.dataset.bsTarget = '#modal';
    buttonPosts.addEventListener('click', handleClick);

    liPosts.appendChild(aPosts);
    liPosts.appendChild(buttonPosts);
    ulPosts.appendChild(liPosts);
  });
};


export const renderModal = (link, title, description) => {
  const h5 = document.querySelector('#modal h5');
  const divBody = document.querySelector('.modal-body');
  const a = document.querySelector('#modal a');

  h5.textContent = title;
  divBody.textContent = description;
  a.setAttribute('href', link);
};
