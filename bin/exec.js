const chpr = require("child_process");

function exec(command) {
    try {
        chpr.execSync(command, {
            encoding: "utf-8",
            stdio: "inherit",
            cwd: process.cwd(),
            env: process.env,
        })
    } catch (err) {
        console.log("> Couldn't complete this command!");
    }
}

module.exports = {
    exec
}