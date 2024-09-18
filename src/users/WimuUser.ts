import { SetupConfiguration } from "../config/SetupConfiguration";
import { globalFs } from "../WimuFS";

export class WimuUser {

    constructor(private name: string, private homedir: string) {
        this.setup();   
    }

    setup() {
        if (!globalFs.fileExists(`${this.getHomeDirectory()}`)) {
            globalFs.createDirectory(`${this.getHomeDirectory()}`);
            globalFs.createDirectory(`${this.getHomeDirectory()}/Downloads`);
            globalFs.createDirectory(`${this.getHomeDirectory()}/Desktop`);
            globalFs.createDirectory(`${this.getHomeDirectory()}/Media`);
        }
        return this;
    }

    getHomeDirectory() {
        return this.homedir;
    }

    getName() {
        return this.name;
    }

}

export let currentUser: WimuUser | null;
export async function configureUser() {

    const wimuConfig = SetupConfiguration.load("wimu.config.yml");
    if (!wimuConfig.exists()) throw new Error("Please run the setup before starting the operating system!");
    const main = wimuConfig.get("main") as string;
    currentUser = new WimuUser(main, `/Users/${main}`);
    return currentUser;

}

export async function changeUser(username: string) {

    if (!userExists(username)) throw new Error("Please run the setup before starting the operating system!");
    currentUser = new WimuUser(username, `/Users/${username}`);
    globalFs.setCWD(currentUser.getHomeDirectory());
    return currentUser;

}

export function userExists(username: string) {

    const wimuConfig = SetupConfiguration.load("wimu.config.yml");
    if (!wimuConfig.exists()) throw new Error("Please run the setup before starting the operating system!");
    const users: string[] = wimuConfig.get("users");
    return users.includes(username);
    
}

export async function createUser(username: string) {

    const wimuConfig = SetupConfiguration.load("wimu.config.yml");
    if (userExists(username)) throw new Error("User exists already!");
    const usr = new WimuUser(username, `/Users/${username}`);
    const users: string[] = wimuConfig.get("users") ?? [];
    users.push(username);
    wimuConfig.set("users", users);
    wimuConfig.save();
    await changeUser(username);
    return usr;

}