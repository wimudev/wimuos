import * as yaml from 'yaml';
import * as fs from "fs";

const rumbleHeader = `#
#
# > Rumble base configuration for yaml configurations
#
#

rumbleImplementConfiguration: true

#
# | Other Implementations/Configurations
#`

export class SetupConfiguration {

    public static load(path: string) {
        return new SetupConfiguration(path);
    }

    private configFilePath: string;
    private configData: Record<string, any>;


    constructor(configFilePath: string) {
        this.configFilePath = configFilePath;
        this.configData = {};
        this.load();
    }

    load(): void {
        try {
            const fileContent = fs.readFileSync(this.configFilePath, "utf-8");
            if (!fileContent) return;
            this.configData = yaml.parse(fileContent);
            delete this.configData["rumbleImplementConfiguration"];
        } catch (err) {
        }
    }

    exists() {
        return fs.existsSync(this.configFilePath);
    }

    get(key: string): any {
        return this.configData[key];
    }

    set(key: string, value: any): this {
        this.configData[key] = value;
        return this;
    }

    delete(key: string): this {
        delete this.configData[key];
        return this;
    }

    save(): this {
        try {
            const yamlContent = yaml.stringify(this.configData);
            fs.writeFileSync(this.configFilePath, `${rumbleHeader}\n\n${yamlContent.trim()}`);
        } catch (err) {
            console.error(`Error saving configuration file at ${this.configFilePath}: ${(err as Error).message}`);
        }
        return this;
    }

    has(key: string): boolean {
        return this.configData.hasOwnProperty(key);
    }

    keys(): string[] {
        return Object.keys(this.configData);
    }

    values(): any[] {
        return Object.values(this.configData);
    }

    clear(): this {
        this.configData = {};
        return this;
    }
}
