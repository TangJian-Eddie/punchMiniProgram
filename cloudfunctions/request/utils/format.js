const INVALID_DATE = 'Invalid Date';
const getDateInfo = (date) => {
  if (typeof date === 'number' || typeof date === 'string') {
    date = new Date(date);
  }
  if (date.toString() === INVALID_DATE) {
    return INVALID_DATE;
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // month, 0-11
  const _date = date.getDate(); // date, 1-31
  return {
    year,
    month,
    date: _date,
  };
};
module.exports = {
  getDateInfo,
};
