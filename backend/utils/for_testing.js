// reverse a string
const reverse = (str) => {
  return str.split("").reverse().join("");
};

// find the average of an array
const average = (arr) => {
  const total = arr.reduce((acc, cur) => {
    return acc + cur;
  }, 0);

  return total / arr.length;
};

module.exports = {
  reverse,
  average,
};
