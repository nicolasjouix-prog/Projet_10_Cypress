import { authToken } from './commands.js';

const API_BASE_URL = 'http://localhost:8081';

export const apiRequest = (method: string, endpoint: string, body?: any) => {
  return cy.request({
    method: method,
    url: `${API_BASE_URL}${endpoint}`,
    headers: { authorization: `Bearer ${authToken()}` },
    body: body,
    failOnStatusCode: false,
  });
};
