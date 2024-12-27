module.exports = {
  // preset: "jest-puppeteer",
  setupFilesAfterEnv: [
    './jest-puppeteer.config.js',
  ],
  testEnvironment: 'jsdom', // Указываем среду выполнения jsdom
};
