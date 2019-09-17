const packageJson = require('./package.json');
const exec = require('child_process').exec;

const run = async(command) => {
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
  const [path, file, ...arguments] = process.argv;
  const packageName = arguments[0] || packageJson.name;

  const [latestVersion, currentVersion] = await Promise.all([
    run(`npm view ${packageName} version`).catch(() => false),
    run(`npm show ${packageName} version`).catch(() => false)
  ]);

  if (!latestVersion || !currentVersion) {
    console.log(`${packageName}: Package not found.`);
    return;
  }

  if (latestVersion !== currentVersion) {
    await run(`npm install ${packageName}@latest`).then(() => {
      console.log(`${packageName}: Updated package from ${currentVersion} to ${latestVersion}.`);
    });
  } else {
    console.log(`${packageName}: Package up to date!`);
  }
}

execute();
