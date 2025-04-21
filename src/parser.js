import { uniqueId } from 'lodash';

export default (xmlString) => {
  const parser = new DOMParser();
  const doc1 = parser.parseFromString(
    xmlString.replaceAll('\n', '').replaceAll('  ', ''),
    'application/xml',
  );

  if (!doc1.querySelector('rss')) {
    throw new Error();
  }

  const title = doc1.querySelector('channel > title');
  const description = doc1.querySelector('channel > description');
  const feed = {
    title: title.textContent.trim(),
    description: description.textContent.trim(),
  };

  const items = doc1.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const titleItem = item.querySelector('title');
    const descriptionItem = item.querySelector('description');
    const linkItem = item.querySelector('link');

    return {
      title: titleItem.textContent.trim(),
      description: descriptionItem.textContent.trim(),
      link: linkItem.textContent.trim(),
    };
  });

  return { feed, posts };
};
