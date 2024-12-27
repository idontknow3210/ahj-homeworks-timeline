import TimelineApp from '../Timeline';

const validCoordinates = [
  '51.50851, -0.12572',
  '41.89193, 12.51133',
  '48.858844,2.294351',
  '34.052235, -118.243683',
  '40.712776, -74.005974',
  '[51.50851, -0.12572]',
  '[41.89193, 12.51133]',
  '[48.858844,2.294351]',
  '[34.052235, -118.243683]',
  '[40.712776, -74.005974]',
  '[-51.50851, -0.12572',
  '51.50851, -0.12572]',
];

const invalidCoordinates = [
  'invalid_coordinates',
  '51.50851,-0.12572,extra_value',
  'invalid_format[51.50851, -0.12572]',
  '51.50851, -0.12572,51.50851, -0.12572',
  '51.50851',
  '51.50851,',
];

describe('requestManualCoordinates', () => {
  let timelineApp;

  beforeEach(() => {
    // Создаем виртуальный DOM для тестов с помощью jsdom
    document.body.innerHTML = '';

    // Создаем экземпляр TimelineApp перед каждым тестом
    timelineApp = new TimelineApp(document.body);
  });

  afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
  });

  test.each(validCoordinates)('Ввод корректных координат "%s" должен вызывать ожидаемые координаты', async (coordinates) => {
    // const resultPromise = await timelineApp.requestManualCoordinates();
    const coordinatesInput = document.querySelector('.manual-coordinates');
    coordinatesInput.value = coordinates;

    const form = document.querySelector('.form-modal-location');

    const submitPromise = new Promise((resolve) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        resolve();
      });
    });

    form.dispatchEvent(new Event('submit'));

    await submitPromise;

    // Разбиваем введенные координаты на широту и долготу
    const [latitude, longitude] = coordinates
      .replace('[', '') // Удаляем возможные квадратные скобки
      .replace(']', '')
      .split(',')
      .map((coord) => parseFloat(coord.trim()));

    expect(timelineApp.userCoords).toEqual({ latitude, longitude });
  });

  test.each(invalidCoordinates)('Ввод некорректных координат "%s"', async (coordinates) => {
    timelineApp.requestManualCoordinates();
    const coordinatesInput = document.querySelector('.manual-coordinates');
    coordinatesInput.value = coordinates;

    const form = document.querySelector('.form-modal-location');

    const submitPromise = new Promise((resolve) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        resolve();
      });
    });

    form.dispatchEvent(new Event('submit'));

    await submitPromise;

    // Проверяем, что сообщение об ошибке отображается
    const errorMessage = form.querySelector('.modal-body-error-message');
    expect(errorMessage.textContent).toBe(
      'Введите координаты в формате: xx.xxxxx, yy.yyyyy или [xx.xxxxx, yy.yyyyy]',
    );

    // Проверяем, что модальное окно еще открыто
    expect(form).not.toBe(undefined);
  });
});
