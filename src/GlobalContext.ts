import WimuFS, { globalFs as fs } from "./WimuFS";
import * as path from "path/posix";
import { WimuLibraries } from "./library/WimuLibraries";
import { WimuLibrary } from "./library/WimuLibrary";
import { WimuConfiguration } from "./config/WimuConfiguration";
import { WimuEnvironment } from "./env/WimuEnvironment";
import { highlight } from "cli-highlight";
import WimuConsole from "./console/WimuConsole";
import { loadSystemFile } from "./system/WimuSystem";
import { WimuHash } from "./hash/WimuHash";
import { useContext } from "./context/WimuUseContext";

export const globalContext = {
    fs,
    path,
    WimuFS,
    WimuLibraries,
    WimuLibrary,
    WimuConfiguration,
    WimuEnvironment,
    WimuConsole: WimuConsole,
    WimuText: {
        codeHighlight: (code: string, language?: string) => {
            try {
                return highlight(code, { ignoreIllegals: false, language: language })
            } catch (err) {
                WimuConsole.error("Unknown language has been given!");
                return "";
            }
        },
    },
    loadSys: loadSystemFile,
    WimuHash: new WimuHash(),
    useContext,
};