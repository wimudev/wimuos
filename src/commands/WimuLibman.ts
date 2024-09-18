import cowsay from "cowsay";
import { ICommand, WimuScanner } from "../WimuScanner";
import * as Inquirer from "@inquirer/prompts";
import WimuConsole from "../console/WimuConsole";
import { _LIB_MAN_VERSION_, libmantall } from "../../libraries/libman/libman";
import Color from "cli-color";
import { existsSync, readFileSync, statSync } from "fs";
import { globalFs } from "../WimuFS";

const subcommands: string[] = ["upload", "info"];

function libmanUsage() {
    return `| Wimu libman version ${_LIB_MAN_VERSION_} for WimuOS.\n` +
        `| \n` +
        `| > Usage: libman <subcommand> [...args]\n` +
        `| \n` + 
        `| > Subcommands:\n| - ${subcommands.join(`\n| - `)}\n` +
        `| Made with ${Color.redBright(`<3`)} by the Wimu Team!`;
}


export default {
    name: "libman",
    execute: async (rl: WimuScanner, subcommand: string, ...args: string[]) => 
    {

        console.log(cowsay.think({ text: "Libman will create libraries!" }) + "\n");
        
        if (!subcommand) 
        {

            WimuConsole.error("Please provide a subcommand through the list down below!");
            console.log(libmanUsage());
            return;

        }
        else if (!subcommands.includes(subcommand)) 
        {

            WimuConsole.error("The subcommand you provided isn't in the list of subcommands provided by the usage!");
            console.log(libmanUsage());
            return;

        }

        if (subcommand === "upload") 
        {
            const [libname, i] = args;
            if (!libname) return WimuConsole.error("Please provide a library name: libman upload <libname> [install: true/false]`");
            const install = i ? i.toLowerCase() === "true" : false
            const onDiskLibPath = `libraries/custom/${libname}.wimulib`;

            if (!install)
            {
                WimuConsole.info("Caching library file for: " + libname);

                if (!existsSync(onDiskLibPath)) {
                    WimuConsole.error(`Unable to cache: ${libname} due to the library file not being available!`);
                    return;
                }

                const libstat = statSync(onDiskLibPath);
                const libData = readFileSync(onDiskLibPath, 'utf-8');
                globalFs.writeFile(`/wimu/cached/libs/${libname}.wimulib`, libData);
                WimuConsole.success(`Finished uploading library with size of ${libstat.size}KB. Library: ${libname}`);

            } 
            else
            {

                WimuConsole.info(`Installing library: ${libname} using wimulibmantall`)
                const libEntry = await libmantall().install(onDiskLibPath, libname);
                if (!libEntry) {
                    WimuConsole.error("Unable to install library due to library either not being existant or failure to meet requirements!");
                    return;
                }
                WimuConsole.success(`Finished installing ${libEntry.name} to WimuOS!`);

            }

        }
    }
} as ICommand;