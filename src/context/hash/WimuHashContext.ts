import WimuConsole from "../../console/WimuConsole";
import { WimuHash } from "../../hash/WimuHash";
import { globalFs } from "../../WimuFS";
import { WimuContext } from "../WimuContext";

export class WimuHashContext extends WimuContext {

    constructor(private file: string) { super() }

    runNonWimuContext(...args: any[]) {

        const hash = new WimuHash();
        const contents = globalFs.readFile(this.file);
        if (!contents) {
            WimuConsole.error("Undefined file!");
            return false;
        }

        const result = hash.runHashScript(contents);
        if (!result) {
            WimuConsole.error("Please add the wimu header. `# Wimu Hash Script 1.0.0`")
            return false;
        }
        return true;

    }

    runContext(...args: any[]) {
        return this.runNonWimuContext(...args);
    }
    
}