const storage = {};

const mockStorage = {
  getItem: jest.fn((key) => Promise.resolve(storage[key] ?? null)),
  setItem: jest.fn((key, value) => {
    storage[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key) => {
    delete storage[key];
    return Promise.resolve();
  }),
};

// Expose storage for test cleanup
mockStorage.__clear = () => {
  Object.keys(storage).forEach((k) => delete storage[k]);
};

module.exports = mockStorage;
module.exports.default = mockStorage;
