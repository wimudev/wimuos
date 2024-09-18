import * as Inquirer from "@inquirer/prompts";
import * as semver from "semver";
import * as cowsay from "cowsay";
import { writeFileSync } from "fs";

const libfile = `/**
 * <description>
 */
return class <name> extends WimuLibrary {
    initialize(): this {
        this.setName("<name>");
        this.setVersion("<version>");
        <set_description>
        return this;
    }
}`

async function create() {

    console.log(cowsay.think({ text: "Libman will create libraries!" }))

    const libname = await Inquirer.input({
        message: "What is the library name?",
        required: true,
    });

    const version = await Inquirer.input({
        message: "What is the version of the library?",
        required: true,
        validate(value) {
            return semver.valid(value) != null;
        },
    });

    const description = await Inquirer.input({
        message: "What is the description of the library?",
    });

    let newLibfile = libfile;
    
    //@ts-ignore
    newLibfile = newLibfile.replaceAll("<name>", libname);
    //@ts-ignore
    newLibfile = newLibfile.replaceAll("<version>", version);
    if (description) {
        //@ts-ignore
        newLibfile = newLibfile.replaceAll("<description>", description);
        //@ts-ignore
        newLibfile = newLibfile.replaceAll("<set_description>", `this.setDescription(\"${description}\");`);
    }

    let highestLength = description ? description.length : 48;
    console.log(new Array(highestLength).fill('-').join(''));
    console.log(`> Name: ${libname}`);
    console.log(`> Version: ${version}`);
    if (description) console.log(`> Description: ${description}`);
    console.log(new Array(highestLength).fill('-').join(''));

    const cntine = await Inquirer.confirm({
        message: "Is this correct?",
        default: true,
    });

    if (cntine) {

        console.log("> Saving changes.")
        writeFileSync(`libraries/custom/${libname}.wimulib`, newLibfile);

    }

}

(async () => {
    await create();
})();