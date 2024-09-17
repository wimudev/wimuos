import { configureUser } from "./users/WimuUser";
import { globalFs } from "./WimuFS";
import { WimuInit } from "./WimuInitializer";

const fs = globalFs;

(async () => {
    await fs.loadFilesFromFolder(process.cwd() + "/memfs");
    const user = await configureUser();
    globalFs.setCWD(`${user.getHomeDirectory()}/Desktop`);
    await WimuInit.start();
})();