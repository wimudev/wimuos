import WimuConsole from "../console/WimuConsole";
import { changeUser, createUser } from "../users/WimuUser";
import { ICommand, WimuScanner } from "../WimuScanner";
import { WimuSubcommandMap } from "./WimuCommandMap";

const changeusr: ICommand = {
    name: "change",
    execute: async (rl, username) => {
        if (!username) return WimuConsole.error("Cannot find defined username in the input.");
        try {
            const result = await changeUser(username);

            if (result) {
                WimuConsole.success("Changed user to " + username + ".");
            }
        } catch (err) {
            WimuConsole.error("Either couldn't find user or the user profile is corrupted, please use `usr create` to create a new user!");
        }
    }
}

const createUsr: ICommand = {
    name: "create",
    execute: async (rl, username) => {
        if (!username) return WimuConsole.error("Cannot find defined username in the input.");
        try {
            const result = await createUser(username);
            if (result) {
                WimuConsole.success("Created & Changed user to " + username + ".");
            }
        } catch (err) {
            WimuConsole.error("User Profile creator cannot create user using that name because it's either used or cannot be used.");
            console.log(err);
        }
    }
}

const help: ICommand = {
    name: "help",
    execute: (rl) => {
        WimuConsole.info("Welcome to WimuOS's user management cli.");
        WimuConsole.info("");
        WimuConsole.info("> Usage: usr <subcommand> [...args]");
        WimuConsole.info("");
        WimuConsole.info("> Commands:");
        WimuConsole.info("> - create <username> | Creates a user & changes to that user");
        WimuConsole.info("> - change <username> | Changes to a existed user.");
        WimuConsole.info("");
    }
}

export default {

    name: "usr",
    execute: async (rl: WimuScanner, command: string, ...args: string[]) => {

        await WimuSubcommandMap.create()
            .register(changeusr)
            .register(createUsr)
            .register(help)
            .start(rl, command, ...args);

    }

} as ICommand