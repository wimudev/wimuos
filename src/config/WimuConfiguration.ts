import * as yaml from 'yaml';
import { globalFs as fs } from '../WimuFS';

export class WimuConfiguration {

    public static load(path: string) {
        return new WimuConfiguration(path);
    }

    private configFilePath: string;
    private configData: Record<string, any>;

    static mainConfig: WimuConfiguration = this.load('/wimu/conf/main.wimuconf');

    constructor(configFilePath: string) {
        this.configFilePath = configFilePath;
        this.configData = {};
        this.load();
    }

    load(): void {
        try {
            const fileContent = fs.readFile(this.configFilePath);
            if (!fileContent) return;
            this.configData = yaml.parse(fileContent);
        } catch (err) {
            console.error(`Error loading configuration file at ${this.configFilePath}: ${(err as Error).message}`);
        }
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
            fs.writeFile(this.configFilePath, yamlContent);
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
