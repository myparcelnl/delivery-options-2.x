/**
 * Mock the js-sdk client and endpoints.
 */
jest.mock('@myparcel/js-sdk/dist/endpoint/public/carriers', () => jest.fn());
jest.mock('@myparcel/js-sdk/dist/endpoint/public/delivery-options', () => jest.fn());
jest.mock('@myparcel/js-sdk/dist/endpoint/public/pickup-locations', () => jest.fn());
jest.mock('@myparcel/js-sdk/dist/client', () => require('../__mocks__/modules/@myparcel/js-sdk/Client'));
