import WimuConsole from "./console/WimuConsole";
import { configureUser } from "./users/WimuUser";
import { globalFs } from "./WimuFS";
import { WimuInit } from "./WimuInitializer";

const fs = globalFs;

(async () => {
    await fs.loadFilesFromFolder(process.cwd() + "/memfs")
    WimuConsole.clear();
    try {
        const user = await configureUser();
        globalFs.setCWD(`${user.getHomeDirectory()}/Desktop`);
    } catch (err) {
        WimuConsole.error("Please configure/setup WimuOS by running `wimu setup` before starting the OS!");
        process.exit(1);
    }
    await WimuInit.start();
})();