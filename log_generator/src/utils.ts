function generateRandomLog() {
  const randomNumber = Math.floor(Math.random() * 1000);
  return `this is sample log ${randomNumber}}`;
}

module.exports = {
  generateRandomLog,
};
