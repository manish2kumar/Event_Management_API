const isValidCapacity = (cap) => cap > 0 && cap <= 1000;

const isFutureDate = (dateStr) => {
  const date = new Date(dateStr);
  return date > new Date();
};

const isNonEmptyString = (val) => typeof val === 'string' && val.trim().length > 0;

module.exports = {
  isValidCapacity,
  isFutureDate,
  isNonEmptyString
};
