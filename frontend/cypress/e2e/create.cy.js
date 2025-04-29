describe('Creating a new task', () => {
    // Define variables that we need on multiple occasions
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
                uid = response.body._id.$oid
                name = user.firstName + ' ' + user.lastName
                email = user.email

                cy.request({
                    method: 'GET',
                    url: `http://localhost:5000/users/${email}`
                })

                const taskData = new URLSearchParams();
                taskData.append('title', 'I love Shrek');
                taskData.append('userid', uid);
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
        cy.contains('div', 'I love Shrek').click();
      });
      
      it('R8UC1: Should allow creating a todo item when description is populated', () => { 
        cy.get('input[placeholder="Add a new todo item"]')
        .type('Show Shrek to my friends');
        cy.get('form').submit();
        cy.contains('div', 'Show Shrek to my friends').should('exist');
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