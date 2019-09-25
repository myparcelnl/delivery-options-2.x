const createCommand = (input) => {
  return input.join(' && ');
};

const preCommit = createCommand([
  'npm run lint',
]);

const prePush = createCommand([
  'npm run test',
]);

module.exports = {
  hooks: {
    'pre-commit': preCommit,
    'pre-push': prePush,
  },
};
