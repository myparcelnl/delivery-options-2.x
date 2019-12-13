const createCommand = (input) => input.join(' && ');

const preCommit = createCommand([
  'npm run lint',
]);

const prePush = createCommand([]);

module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': preCommit,
    'pre-push': prePush,
  },
};
