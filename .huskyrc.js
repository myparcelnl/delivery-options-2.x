const createCommand = (input) => {
  return input.join(' && ');
};

const preCommit = createCommand([
  'npm run lint',
]);

module.exports = {
  hooks: {
    'pre-commit': preCommit,
  },
};
