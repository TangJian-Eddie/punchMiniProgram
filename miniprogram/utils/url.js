export function appendQuery(query = {}, url) {
  const queryString = Object.entries(query)
    .reduce((result, [key, val]) => {
      return val === null || val === undefined || val === ''
        ? result
        : result +
            '&' +
            encodeURIComponent(key) +
            '=' +
            encodeURIComponent(String(val));
    }, '')
    .slice(1);
  return queryString ? [url, queryString].join('?') : url;
}
