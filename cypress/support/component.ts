// This file is processed and loaded automatically before your component test files.
// https://on.cypress.io/configuration
import './commands';

import { mount } from 'cypress/react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);
