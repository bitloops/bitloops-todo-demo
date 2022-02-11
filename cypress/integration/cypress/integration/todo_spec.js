import { click } from '@testing-library/user-event/dist/click';
import { get } from 'http';
import { v4 as uuid } from 'uuid';

const myRandomToDo = uuid();
describe('Todo', () => {
  it('Adding a New Todo', () => {
    cy.visit('http://localhost:3000');

    cy.get('input.todo-list-input').type(myRandomToDo);

    cy.get('button').contains('Add').click();

    cy.get('p').should('contain', myRandomToDo);
  });

  // it('Editing a Todo', () => {
  //   cy.get('p').contains(myRandomToDo).invoke('text', 'my new value');
  //   // cy.get('p').contains(myRandomToDo).click();
  //   // cy.get("[value='" + myRandomToDo + "']").invoke('text', 'my new value');
  //   // cy.get('input').invoke('attr', 'value', 'my new value');
  // });
});
