const chpr = require("child_process");

function exec(command) {
    chpr.execSync(command, {
        encoding: "utf-8",
        stdio: "inherit",
        cwd: process.cwd(),
        env: process.env,
    })
}

module.exports = {
    exec
}