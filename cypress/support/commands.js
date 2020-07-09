// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-wait-until';

Cypress.Commands.add('login', async () => {
    const url = Cypress.env('backUrl') + '/user/login/';
    
    const user = {
        username: Cypress.env('USERNAME'),
        password: Cypress.env('PASSWORD')
    };
    
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const answ = await res;
    const info = await answ.json();

    expect(answ.status).eq(200);

    localStorage.setItem('stored_token', info.token);
    localStorage.setItem('stored_refresh', info.refresh);
    localStorage.setItem('stored_auth', 1);
});
