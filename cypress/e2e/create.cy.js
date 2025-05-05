describe('Labb 2', () => {
  // define variables that we need on multiple occasions
  let uid // user id
  let name // name of the user (firstName + ' ' + lastName)
  let email // email of the user

  before(function () {
    // create a fabricated user from a fixture
    cy.fixture('user.json')
      .then((user) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:5000/users/create',
          form: true,
          body: user
        }).then((response) => {
          cy.log(response.body)
          uid = response.body._id.$oid
          name = user.firstName + ' ' + user.lastName
          email = user.email
        })
      })
  })

  beforeEach(function () {
    cy.visit('http://localhost:3000')
    cy.contains('div', 'Login').find('input[type=text]').first().type('mon.doe@gmail.com');
    cy.get('form').submit();
    cy.wait(1000); // wait 1 second for page to load
  });

  it('R8UC1-A: Should allow creating a todo item when description is populated', () => { 
    cy.get('input[type="text"]')
    .first()
    .type('I love Shrek1');
    cy.get('input[type="text"]').eq(1).type('https://www.youtube.com/watch?v=em9lziI07M4');
    cy.get('form').submit();
    cy.wait(500);
    cy.contains('div', 'I love Shrek1').should('exist').click({ force: true });
    cy.wait(200);
    cy.get('input[placeholder=\"Add a new todo item\"]').type('show my friends Shrek', { force: true});
    cy.get('input[type="submit"]').eq(1).click({ force: true });
  });

  it('R8UC1-B: Add button should be disabled when description is empty', () => {
    cy.get('div').contains('I love Shrek1').should('exist').click({ force: true });
    cy.wait(1000);
    cy.get('input[type="submit"]').eq(1).should('be.disabled');
  });

  it('R8UC2-A: Should strike through text', () => {
    cy.contains('div', 'I love Shrek1').should('exist').click({ force: true });
    cy.wait(200);
    cy.get('li.todo-item').eq(1).within(() => {
      cy.get('span.checker').click({ force: true }); // toggle on
      cy.get('span.checker')
        .should('have.class', 'checked')
        .and('not.have.class', 'unchecked');
      cy.get('span.editable')
        .should('have.css', 'text-decoration-line', 'line-through');
    });
  });
  
  it('R8UC2-B: Should un-strike through text', () => {
    cy.contains('div', 'I love Shrek1').should('exist').click({ force: true });
    cy.wait(200);
    cy.get('li.todo-item').eq(1).within(() => {
      cy.get('span.checker').click({ force: true }); // toggle off
      cy.get('span.checker').should('have.class', 'unchecked').and('not.have.class', 'checked');
      cy.get('span.editable').should('not.have.css', 'text-decoration-line', 'line-through');
    });
  });
  
  it('R8UC3: Should allow deleting a todo item', () => {
    cy.contains('div', 'I love Shrek1').should('exist').click({ force: true});
    cy.wait(200);
    cy.get('li.todo-item').eq(1).within(() => {
      cy.get('span.remover').click({ force: true});
    });
    cy.wait(200);
    cy.get('li.todo-item').eq(1).should('not.exist');
  })

  after(function () {
    // clean up by deleting the user from the database
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    }).then((response) => {
      cy.log(response.body)
    })
  })
})