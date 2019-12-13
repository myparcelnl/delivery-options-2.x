const { spawn } = require('child_process');
const [, , ...args] = process.argv;
const standardVersionArgs = [];
const githubReleaseArgs = [];

if (args.includes('--dry-run')) {
  githubReleaseArgs.push('--draft');
}

const standardVersion = spawn('standard-version', [...standardVersionArgs, ...args], { stdio: 'inherit' });

standardVersion.on('close', () => {
  spawn('conventional-github-releaser', [...githubReleaseArgs], { stdio: 'inherit' });
});
