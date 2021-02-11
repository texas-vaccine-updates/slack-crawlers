module.exports = (sentance) => {
  return sentance.split(' ').map((curr, i) => {
    return [curr.slice(0, 1).toUpperCase(), curr.slice(1).toLowerCase()].join('');
  }).join(' ');
};
