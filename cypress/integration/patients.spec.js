describe('Patients', () => {
    beforeEach(() => {
        cy.login();

        cy.visit('/pacientes');
    });

    it('should show patients', () => {
        cy.waitUntil(() => cy.get('.user').should('have.length.gt', 0));
    });

    it('should show first patient info', () => {
        cy.waitUntil(
            () => cy.get('.user')
        ).then(
            () => {
                cy
                    .get('.item a').first().click().then(() => {
                        cy.get('h3').invoke('text').should('have.length.gt', 0);
                    });
            }
        );
    });
});
