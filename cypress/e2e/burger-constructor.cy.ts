const INGREDIENT_CARD = '[data-testid="ingredient-card"]';
const CONSTRUCTOR_INGREDIENT = '[data-test-id="constructor-ingredient"]';
const MODAL = '[data-testid="modal"]';
const MODAL_CLOSE = '[data-testid="modal-close"]';
const ORDER_NUMBER = '[data-testid="order-number"]';

describe('проверяем доступность приложения', function () {
  it('сервис должен быть доступен по адресу localhost:5173', function () {
    cy.visit('/');
  });
});

describe('Burger Constructor Integration', () => {
  it('подставляет мок ингредиентов', () => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.contains('Булка N1').should('exist');
    cy.contains('Котлета').should('exist');
  });
});

describe('Burger Constructor Integration', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет один ингредиент в конструктор', () => {
    cy.contains(INGREDIENT_CARD, 'Котлета')
      .find('button')
      .click();

    cy.get(CONSTRUCTOR_INGREDIENT).should(
      'contain',
      'Котлета'
    );
  });
});

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('открывает и закрывает модалку по крестику', () => {
    cy.contains(INGREDIENT_CARD, 'Булка N1').click();

    cy.get(MODAL).should('be.visible');
    cy.contains('Детали ингредиента').should('exist');
    cy.contains('Булка N1').should('exist');

    cy.get(MODAL_CLOSE).click();

    cy.get(MODAL).should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      body: {
        success: true,
        name: 'Флюоресцентный space бургер',
        order: {
          _id: 'order123',
          number: 123456,
          status: 'done',
          createdAt: '2025-07-07T12:00:00.000Z',
          updatedAt: '2025-07-07T12:05:00.000Z',
          ingredients: ['bun123', 'main789', 'bun123']
        }
      }
    }).as('makeOrder');

    localStorage.setItem('accessToken', 'Bearer fake-access-token');
    localStorage.setItem('refreshToken', 'fake-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('оформляет заказ и очищает конструктор', () => {
    cy.contains(INGREDIENT_CARD, 'Булка N1')
      .find('button')
      .click();
    
    cy.contains(INGREDIENT_CARD, 'Котлета')
      .find('button')
      .click();

    cy.get(CONSTRUCTOR_INGREDIENT).should('have.length', 1);

    cy.contains('Оформить заказ').click();
    cy.wait('@makeOrder');

    cy.get(ORDER_NUMBER, { timeout: 6000 }).should('contain', '123456');

    cy.get(MODAL_CLOSE).click();

    cy.get(ORDER_NUMBER).should('not.exist');

    cy.get(CONSTRUCTOR_INGREDIENT).should('not.exist');
  });
});

