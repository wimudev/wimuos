import { WimuFileContext } from "./context/file/WimuFileContext";
import { WimuScanner } from "./WimuScanner";

export const globalScanner = new WimuScanner();

export class WimuInit {


    static async start() {

        const initContext = new WimuFileContext("/wimu/sys/init", {});
        await initContext.runContext();

        globalScanner.registerCommands();
        globalScanner.start();

    }

}