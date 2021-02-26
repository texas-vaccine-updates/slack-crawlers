module.exports = (addedDays = 0) => {
  const date = new Date();
  if (addedDays > 0) {
    date.setDate(date.getDate() + addedDays);
  }
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
