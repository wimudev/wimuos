import { globalFs } from "../WimuFS";

export class WimuEnvironment {
    public static load(file: string) {
        return new WimuEnvironment(file);
    }

    public static mainEnv: WimuEnvironment = this.load("/wimu/conf/.wimuenv")

    private envData: Record<string, string> = {};

    constructor(private envFilePath: string) {
        this.load();
    }

    load(): void {
        try {
            const fileContent = globalFs.readFile(this.envFilePath);
            if (!fileContent) return;
            fileContent.split('\n').forEach((line) => {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                    const [key, value] = trimmedLine.split('=') as [string, string];
                    if (key && value) {
                        this.envData[key.trim()] = value.trim();
                    }
                }
            });
        } catch (err) {
            console.error(`Error reading .env file at ${this.envFilePath}: ${(err as Error).message}`);
        }
    }

    get(key: string): string | undefined {
        return this.envData[key];
    }

    set(key: string, value: string): this {
        this.envData[key] = value;
        this.save();
        return this;
    }

    delete(key: string): this {
        delete this.envData[key];
        this.save();
        return this;
    }

    has(key: string) {
        return this.envData[key] != null;
    }

    save(): void {
        try {
            const fileContent = Object.entries(this.envData)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');
            globalFs.writeFile(this.envFilePath, fileContent);
        } catch (err) {
            console.error(`Error writing to .env file at ${this.envFilePath}: ${(err as Error).message}`);
        }
    }
}
