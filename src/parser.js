export default (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  if (!doc.querySelector('rss')) {
    throw new Error();
  }

  const feed = {
    title: doc.querySelector('title')?.textContent.trim(),
    description: doc.querySelector('description')?.textContent.trim(),
  };

  const items = doc.querySelectorAll('item');
  const posts = Array.from(items).map((item) => ({
    title: item.querySelector('title')?.textContent.trim(),
    description: item.querySelector('description')?.textContent.trim(),
    link: item.querySelector('link')?.textContent.trim(),
  }));

  return { feed, posts };
};
