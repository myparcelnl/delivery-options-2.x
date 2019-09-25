const packageJson = require('./package.json');
const { exec } = require('child_process');

const run = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error !== null) {
        reject(stderr);
      }

      resolve(stdout);
    });
  });
};

async function execute() {
  // Ignore path and file arguments.
  const [, , ...args] = process.argv;
  const packageName = args[0] || packageJson.name;

  const [latestVersion, currentVersion] = await Promise.all([
    run(`npm view ${packageName} version`).catch(() => false),
    run(`npm show ${packageName} version`).catch(() => false),
  ]);

  if (!latestVersion || !currentVersion) {
    console.log(`${packageName}: Package not found.`);
    return;
  }

  if (latestVersion === currentVersion) {
    console.log(`${packageName}: Package up to date!`);
  } else {
    await run(`npm install ${packageName}@latest`).then(() => {
      console.log(`${packageName}: Updated package from ${currentVersion} to ${latestVersion}.`);
    });
  }
}

execute();
