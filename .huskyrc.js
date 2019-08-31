const createCommand = (input) => {
  return input.join(' && ');
};

const preCommit = createCommand([
  'npm run build',
  'git add dist',
  'cd myparcel-js-sdk',
  'npm run build',
  'cd ..',
  'git add myparcel-js-sdk',
]);

module.exports = {
  hooks: {
    'pre-commit': preCommit,
  },
};
