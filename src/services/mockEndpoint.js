export function mockEndpoint(Endpoint, data) {
  return {
    response: data.data[(new Endpoint()).namespace],
    errors: [],
  };
}
