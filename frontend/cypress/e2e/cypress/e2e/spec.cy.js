describe('Creating a new task', () => {
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
              this.uid = response.body._id.$oid
              this.name = user.firstName + ' ' + user.lastName
              this.email = user.email

              const taskData = new URLSearchParams();
              taskData.append('title', 'I love Shrek');
              taskData.append('userid', this.uid);
              taskData.append('url', 'https://www.youtube.com/watch?v=em9lziI07M4&ab_channel=Movieclips');

            cy.request({
              method: 'POST',
              url: 'http://localhost:5000/tasks/create',
              form: true,
              body: taskData
              });
            });
          });
        });
    });

    beforeEach(function () {
      cy.visit('http://localhost:3000')
      cy.contains('div', 'Email Address').find('input[type=text]').type(this.email);
      cy.get('form').submit();
      cy.contains('div', 'I love Shrek').click();
    });
    
    it('R8UC1: Should allow creating a todo item when description is populated', () => { 
      cy.get('input[placeholder="Add a new todo item"]')
      .type('Show Shrek to my friends');
      cy.get('form').submit();
      cy.contains('div', 'Show Shrek to my friends').should('exist');
    })

  //   after(function () {
  //     cy.request({
  //       method: 'DELETE',
  //       url: `http://localhost:5000/users/${this.uid}`
  //     }).then((response) => {
  //       cy.log(response.body)
  //     })
  // })