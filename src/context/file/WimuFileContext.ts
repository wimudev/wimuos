import { globalFs as fs } from "../../WimuFS";
import { WimuContext } from "../WimuContext";
import { merge } from "../../utils/WimuUtils";
import { globalContext } from "../../GlobalContext";
import WimuConsole from "../../console/WimuConsole";

export class WimuFileContext extends WimuContext {
    constructor(private file: string, private context?: Record<string, any>) {
        super();
    }

    runContext(...args: any[]): any {
        try {
            const content = fs.readFile(this.file.endsWith(".wimu") ? this.file : this.file + ".wimu");
            if (!content) {
                WimuConsole.error("No data was found at " + this.file);
                return null;
            }
            
            let exposedContext = this.createContext();
            exposedContext = merge(exposedContext, globalContext);
            exposedContext = merge(exposedContext, this.context ?? {});
            exposedContext = merge(exposedContext, {
                args: args
            })
            
            const scriptFunction = new Function(
                ...Object.keys(exposedContext),
                `"use strict";\nreturn (async () => { ${content} })();`
            );
            
            return scriptFunction(...Object.values(exposedContext));
        } catch (err) {
            WimuConsole.error(`An execution error occurred at file: ${this.file}: ${(err as Error).message}`);
            return null;
        }
    }

    runNonWimuContext(...args: any[]) {
        try {
            const content = fs.readFile(this.file);
            if (!content) {
                WimuConsole.error("No data was found at " + this.file);
                return null;
            }
            
            let exposedContext = this.createContext();
            exposedContext = merge(exposedContext, globalContext);
            exposedContext = merge(exposedContext, this.context ?? {});
            exposedContext = merge(exposedContext, {
                args: args
            });

            const scriptFunction = new Function(
                ...Object.keys(exposedContext),
                `"use strict";\nreturn (async () => { ${content} })();`
            );
            
            return scriptFunction(...Object.values(exposedContext));
        } catch (err) {
            WimuConsole.error(`An execution error occurred at file: ${this.file}: ${(err as Error).message}`);
            return null;
        } 
    }

    createContext() {
        return  {
            
        };
    }
}