import * as Inquirer from "@inquirer/prompts";
import { SetupConfiguration } from "./SetupConfiguration";
import { mkdirSync } from "fs";

type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
    type?: never;
};

const config = SetupConfiguration.load("wimu.config.yml");
if (!config.exists()) config.save();

const users: string[] = config.has("users") ? config.get("users") as string[] : [];

async function ex() {
    console.log("Welcome to WimuOS setup.");
    console.log("The WimuOS setup allows you to create a user which could either be used as the main account of the system.");
    console.log("");
    console.log("Let's get started!");
    console.log("");

    const usernamePrompt = await Inquirer.input({
        message: "What should be the username of the account?",
        default: "Wimu",
        required: true,
    });

    if (users.includes(usernamePrompt)) {
        console.log("> User already exists, aborting!")
        return;
    }

    users.push(usernamePrompt);

    if (users.length) {
        const choices: Choice<unknown>[] = users.map((v) => {
            return {
                value: v,
                name: v,
            }
        })
        const mainUser = await Inquirer.select({
            message: "Which account will be the main account?",
            choices
        });

        config.set("main", mainUser);
    }

    const setupHostname = await Inquirer.confirm({
        message: "Setup hostname?",
        default: config.has("hostname")
    });

    if (setupHostname) {
        const hostname = await Inquirer.input({
            message: "What should be the hostname of the os?",
            default: "wimu",
            required: true,
        });

        config.set("hostname", hostname);
    }

    const result = await Inquirer.confirm({
        message: "Everything right?",
        default: true,
    });


    if (!result) {
        console.log("> Restarting setup...");
        users.splice(users.indexOf(usernamePrompt), 1);
        ex();
    } else {
        console.log("> Saving changes.");
        config.set("users", users);
        config.save();

        // setup directories
        mkdirSync(`memfs/Users/${usernamePrompt}`);
        mkdirSync(`memfs/Users/${usernamePrompt}/Downloads`);
        mkdirSync(`memfs/Users/${usernamePrompt}/Desktop`);
        mkdirSync(`memfs/Users/${usernamePrompt}/Media`);
    }
}

(async () => {
    await ex();
})();