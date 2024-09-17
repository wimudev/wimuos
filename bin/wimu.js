const { findArgument, getValueOfArgument } = require("./args");
const { exec } = require("./exec");

const setup = findArgument("setup");
const run = findArgument("run");
const libman = findArgument("libman");

if (setup) {
    exec("ts-node setup/Setup.ts");
} else if (run) {
    exec("ts-node src/index.ts");
} else if (libman) {
    const type = getValueOfArgument("libman");
    if (!type.value) return console.log("\n> Invalid Command \n> wimu libman <subcommand>");
    if (type.value === "create") {

        exec("ts-node libraries/libman/libman-create.ts");

    }

} else {

    console.log("> Wimu Executor 1.0.0");
    console.log("> wimu setup | Runs the setup. If not used wimu before then use this first!");
    console.log("> wimu run | Runs the actual os. You'll need to setup wimu first before running!");

}