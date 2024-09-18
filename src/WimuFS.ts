import { createFsFromVolume, IFs, fs as memfs, Volume } from 'memfs';
import * as realFs from 'fs';
import * as path from 'path/posix';
import { currentUser } from './users/WimuUser';

class WimuFS {
    private fs: IFs;
    private currentWorkingDir: string;
    private volume = new Volume();

    constructor() {
        this.fs = createFsFromVolume(this.volume);
        this.currentWorkingDir = '/';
    }

    setCWD(newCWD: string): void {
        newCWD = this.resolvePath(newCWD);
        if (this.fs.existsSync(newCWD) && this.fs.statSync(newCWD).isDirectory()) {
            this.currentWorkingDir = newCWD;
        } else {
            throw new Error('Invalid directory');
        }
    }

    getCWD(): string {
        return this.currentWorkingDir;
    }

    resolvePath(filePath: string): string {
        if (filePath.includes("~")) {
            // @ts-ignore
            filePath = filePath.replaceAll("~", currentUser?.getHomeDirectory() || '');
        }
        return path.resolve(this.currentWorkingDir, filePath);
    }

    createDirectory(dirPath: string): void {
        try {
            this.fs.mkdirSync(this.resolvePath(dirPath), { recursive: true });
        } catch (err) {
            console.error(`Error creating directory ${dirPath}: ${(err as Error).message}`);
        }
    }

    createReadStream(filePath: string): NodeJS.ReadableStream {
        try {
            return this.fs.createReadStream(this.resolvePath(filePath));
        } catch (err) {
            throw new Error(`Error creating read stream: ${(err as Error).message}`);
        }
    }

    createWriteStream(filePath: string): NodeJS.WritableStream {
        try {
            return this.fs.createWriteStream(this.resolvePath(filePath));
        } catch (err) {
            throw new Error(`Error creating write stream: ${(err as Error).message}`);
        }
    }

    writeFile(filePath: string, content: string): void {
        try {
            this.fs.writeFileSync(this.resolvePath(filePath), content, { encoding: 'utf-8' });
        } catch (err) {
            console.error(`Error writing file ${filePath}: ${(err as Error).message}`);
        }
    }

    writeFileBuffer(filePath: string, content: Buffer): void {
        try {
            this.fs.writeFileSync(this.resolvePath(filePath), content);
        } catch (err) {
            console.error(`Error writing file buffer ${filePath}: ${(err as Error).message}`);
        }
    }

    listDirectory(dir: string): string[] {
        try {
            return this.fs.readdirSync(this.resolvePath(dir), { encoding: "utf-8" }) as string[];
        } catch (err) {
            console.error(`Error listing directory ${dir}: ${(err as Error).message}`);
            return [];
        }
    }

    readFile(filePath: string): string | null {
        try {
            return this.fs.readFileSync(this.resolvePath(filePath), { encoding: 'utf-8' }) as string;
        } catch (err) {
            console.error(`Error reading file ${filePath}: ${(err as Error).message}`);
            return null;
        }
    }

    readFileBuffer(filePath: string): Buffer | null {
        try {
            return this.fs.readFileSync(this.resolvePath(filePath)) as Buffer;
        } catch (err) {
            console.error(`Error reading file buffer ${filePath}: ${(err as Error).message}`);
            return null;
        }
    }

    isDirectory(filePath: string): boolean {
        try {
            return this.fs.statSync(this.resolvePath(filePath)).isDirectory();
        } catch (err) {
            console.error(`Error checking if path is directory ${filePath}: ${(err as Error).message}`);
            return false;
        }
    }

    deleteFile(filePath: string): void {
        try {
            this.fs.unlinkSync(this.resolvePath(filePath));
        } catch (err) {
            console.error(`Error deleting file ${filePath}: ${(err as Error).message}`);
        }
    }

    fileExists(filePath: string): boolean {
        try {
            return this.fs.existsSync(this.resolvePath(filePath));
        } catch (err) {
            console.error(`Error checking if file exists ${filePath}: ${(err as Error).message}`);
            return false;
        }
    }

    async loadFilesFromFolder(realFolderPath: string): Promise<void> {
        const loadFilesRecursively = (currentPath: string, memfsPath: string) => {
            const files = realFs.readdirSync(currentPath);

            files.forEach((file) => {
                const realFilePath = path.join(currentPath, file);
                const memfsFilePath = this.resolvePath(path.join(memfsPath, file));

                if (realFs.statSync(realFilePath).isDirectory()) {
                    this.createDirectory(memfsFilePath);
                    loadFilesRecursively(realFilePath, memfsFilePath);
                } else {
                    const fileContent = realFs.readFileSync(realFilePath, { encoding: 'utf-8' });
                    this.writeFile(memfsFilePath, fileContent);
                }
            });
        };

        try {
            loadFilesRecursively(realFolderPath, '/');
            console.log('Files loaded successfully.');
        } catch (err) {
            console.error(`Error loading files from folder ${realFolderPath}: ${(err as Error).message}`);
        }
    }
}

export default WimuFS;
export const globalFs = new WimuFS();