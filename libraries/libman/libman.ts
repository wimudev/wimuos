import { existsSync, readFileSync, statSync } from "fs";
import { globalFs } from "../../src/WimuFS";
import WimuConsole from "../../src/console/WimuConsole";

export const _LIB_MAN_VERSION_ = "1.0.0";
export interface ILibmanLibraryEntry {

    name: string;
    path: {
        diskPath: string;
        installPath: string;
    };
    size: number;

}

export interface LibmanTall {
    install: (onDiskLibPath: string, library: string) => Promise<ILibmanLibraryEntry | null>
}

const __libman_tall__: LibmanTall = {

    install: async (onDiskPath, library) => {
        if (!existsSync(onDiskPath)) return null;
        WimuConsole.info("[LibmanTall!] Recieved library data, starting installation...");
        const libStat = statSync(onDiskPath);
        const libData = readFileSync(onDiskPath, 'utf-8');

        WimuConsole.info("[LibmanTall!] Writing " + libStat.size + "KB to WimuOS's library directory.");
        globalFs.writeFile(`/wimu/lib/${library}.wimulib`, libData);
        WimuConsole.info(`[LibmanTall!] Finishing installation...`);
        return {
            name: library,
            path: {
                diskPath: onDiskPath,
                installPath: `/wimu/sys/lib/${library}.wimulib`
            },
            size: libStat.size
        }
    }

}

export function libmantall(): LibmanTall {
    return __libman_tall__;
}