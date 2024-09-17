import WimuConsole from "../console/WimuConsole";
import { WimuFileContext } from "../context/file/WimuFileContext";

export const loadSystemFile = async (sysFileName: string, ...args: any[]) => {
    if (!sysFileName.endsWith(".wimu") && !sysFileName.endsWith(".wimusys")) {
        WimuConsole.error("Unable to load system library: " + sysFileName + "");
        return null;
    }
    const context = new WimuFileContext(`/wimu/sys/${sysFileName}`, {})
    const result: any | Promise<any> = context.runNonWimuContext();
    const c = await Promise.resolve(result)
        .then(resolvedResult => {
            return resolvedResult;
        })
        .catch(err => {
            console.log(`Error loading system library: ${err.message}`);
            return null;
        });

    
    return c;
};