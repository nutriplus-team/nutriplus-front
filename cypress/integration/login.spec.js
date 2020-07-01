describe('Login', () => {
    beforeEach(() => {
        cy.visit('/auth');
    });

    it('should login', () => {
        const placeholderName = 'Nome de usuário';
        const placeholderPassword = 'Senha';
        
        cy
            .get(`input[placeholder="${placeholderName}"]`)
            .type(Cypress.env('USERNAME'));

        cy
            .get(`input[placeholder="${placeholderPassword}"]`)
            .type(Cypress.env('PASSWORD'))
            .type('{enter}');

        cy.waitUntil(() => localStorage.getItem('stored_token'))
            .then((token) => expect(token).to.not.equal(''));
    });

    it('should not login', () => {
        const placeholderName = 'Nome de usuário';
        const placeholderPassword = 'Senha';
        
        cy
            .get(`input[placeholder="${placeholderName}"]`)
            .type(Cypress.env('USERNAME'));

        cy
            .get(`input[placeholder="${placeholderPassword}"]`)
            .type('senhainvalida')
            .type('{enter}');

        cy.waitUntil(() => cy.get('form').should('have.class', 'error'));
    });
});
