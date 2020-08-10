describe('Init', () => {
    it('should be working', () => {
        expect(true).to.equal(true);
    });

    it('should visit the app', () => {
        cy.visit('/');
    });
});
