import { fs as memfs } from 'memfs';
import * as realFs from 'fs';
import * as path from 'path/posix';
import { currentUser } from './users/WimuUser';

class WimuFS {
  private fs: typeof memfs;
  private currentWorkingDir: string;

  constructor() {
    this.fs = memfs;
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
    //@ts-ignore
    if (filePath.includes("~")) filePath = filePath.replaceAll("~", currentUser?.getHomeDirectory());
    return path.resolve(this.currentWorkingDir, filePath);
  }

  createDirectory(dirPath: string): void {
    try {
      this.fs.mkdirSync(this.resolvePath(dirPath), { recursive: true });
    } catch (err) {
    }
  }

  writeFile(filePath: string, content: string): void {
    try {
      this.fs.writeFileSync(this.resolvePath(filePath), content, { encoding: 'utf-8' });
    } catch (err) {
    }
  }

  listDirectory(dir: string): string[] {
    try {
        const elements = this.fs.readdirSync(this.resolvePath(dir), { encoding: "utf-8" });
        return elements as string[];
    } catch (err) {
        return [];
    }
  }

  readFile(filePath: string): string | null {
    try {
      const content = this.fs.readFileSync(this.resolvePath(filePath), { encoding: 'utf-8' });
      return content as string;
    } catch (err) {
      return null;
    }
  }

  isDirectory(filePath: string): boolean {
    return this.fs.statSync(this.resolvePath(filePath)).isDirectory();
  }

  deleteFile(filePath: string): void {
    try {
      this.fs.unlinkSync(this.resolvePath(filePath));
    } catch (err) {
      console.error(`Error deleting file: ${(err as Error).message}`);
    }
  }

  fileExists(filePath: string): boolean {
    try {
      return this.fs.existsSync(this.resolvePath(filePath));
    } catch (err) {
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

    loadFilesRecursively(realFolderPath, '/');
  }
}

export default WimuFS;
export const globalFs = new WimuFS();