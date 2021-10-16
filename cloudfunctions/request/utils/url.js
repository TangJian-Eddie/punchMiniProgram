function parseUrlQuery(url) {
  const [rawUrl, queryString = ''] = url.split('?');
  const query = queryString.split('&').reduce((result, item) => {
    const index = item.indexOf('=');
    const key = item.slice(0, index);
    const value = item.slice(index + 1);
    result[decodeURIComponent(key)] = decodeURIComponent(value);
    return result;
  }, {});
  return [rawUrl, query];
}

module.exports = {
  parseUrlQuery,
};
