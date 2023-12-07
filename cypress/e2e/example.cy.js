//An example test
describe('To test the login functionality', () => {
    it('Login to the weather app', () => {
      //Use your registerd user's email address and password
      cy.loginAs('youremail@test.com', 'testpw');
      cy.get('.logo__text').should('have.text', 'Weather');
    });
});