import { WimuFileContext } from "../context/file/WimuFileContext";
import { NonInitializedClass } from "../utils/WimuUtils";
import { WimuLibrary } from "./WimuLibrary";

export class WimuLibraries {

    static async loadLibrary(name: string): Promise<WimuLibrary | null> {
        const libraryPath = `/wimu/lib/${name}.wimulib`;
        const context = new WimuFileContext(libraryPath, {});

        const result: NonInitializedClass | Promise<NonInitializedClass> = context.runNonWimuContext();

        const c = await Promise.resolve(result)
            .then(resolvedResult => {
                return new resolvedResult();
            })
            .catch(err => {
                console.log(`Error loading library: ${err.message}`);
                return null;
            });

        if (!c) {
            console.log("Failed to initialize the library.");
            return null;
        }

        if (!(c instanceof WimuLibrary)) {
            console.log("Library: " + name + " is not a wimu library.");
            return null;
        }

        c.initialize();

        return c;
    }

}