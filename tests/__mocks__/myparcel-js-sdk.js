const mockRequests = {
  search: jest.fn(),
};

// Mock until sdk is live on npm
class Client {
  config = {};
  delivery_options = mockRequests;
  pickup_locations = mockRequests;
}

export default Client;
