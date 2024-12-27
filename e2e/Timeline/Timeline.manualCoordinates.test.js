import puppeteer from 'puppeteer';

describe('requestManualCoordinates', () => {
  let browser;
  let page;

  beforeEach(async () => {
    // Запускаем браузер и создаем новую страницу перед каждым тестом
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterEach(async () => {
    // Закрываем браузер после каждого теста
    await browser.close();
  });

  it('should handle valid coordinates input', async () => {
    await page.goto('http://localhost:8080');

    // Находим элементы на странице
    const coordinatesInput = await page.$('.manual-coordinates');
    const submitButton = await page.$('#submit-manual-coordinates');

    // Вводим корректные координаты
    await coordinatesInput.type('51.50851, -0.12572');

    // Кликаем на кнопку отправки
    await submitButton.click();

    // Проверяем, что модальное окно было закрыто
    await page.waitForSelector('.modal', { hidden: true });

    const modal = await page.$('.modal');
    expect(modal).toBeFalsy();
  });

  it('should handle invalid coordinates input', async () => {
    await page.goto('http://localhost:8080');

    // Находим элементы на странице
    const coordinatesInput = await page.$('.manual-coordinates');
    const submitButton = await page.$('#submit-manual-coordinates');

    // Вводим некорректные координаты
    await coordinatesInput.type('invalid coordinates');

    // Кликаем на кнопку отправки
    await submitButton.click();

    // Проверяем, что сообщение об ошибке отображается
    const errorMessage = await page.$('.modal-body-error-message');
    const errorMessageText = await page.evaluate((element) => element.textContent, errorMessage);
    expect(errorMessageText).toBe(
      'Введите координаты в формате: xx.xxxxx, yy.yyyyy или [xx.xxxxx, yy.yyyyy]',
    );

    // Проверяем, что модальное окно остается открытым
    const modal = await page.$('.modal');
    expect(modal).toBeTruthy();
  });
});
