import WimuConsole from "../console/WimuConsole";
import { globalScanner } from "../WimuInitializer";

export class WimuHash {
    private variables: Record<string, string> = {};
    private comments: string[] = [];

    runHashScript(script: string) {
        if (!script.startsWith("# Wimu Hash Script 1.0.0")) {
            return false;
        }
        const lines = script.split('\n');
        lines.forEach((line, index) => {
            this.executeLine(line.trim(), index);
        });
        return true;
    }

    private executeLine(line: string, lineNumber: number) {
        if (!line.length) return;

        const { command, comment } = this.extractComment(line);
        
        if (comment) this.saveComment(comment); 
        if (!command.length) return; 

        const tokens = command.split(' ');
        if (!tokens.length) return;
        const mainCommand = tokens[0].toLowerCase();
        const args = tokens.slice(1);

        switch (mainCommand) {
            case 'if':
                this.handleIf(command);
                break;
            case "set":
                this.handleSet(args);
                break;
            default:
                globalScanner.execute(mainCommand, ...args);
        }
    }

    private handleIf(line: string) {
        const [_, condition, truePart, falsePart] = line.match(/if\s+(.*)\s+(.*)\s+else\s+(.*)/) || [];
        if (condition && this.evaluateCondition(condition)) {
            this.executeLine(truePart, -1);
        } else if (falsePart) {
            this.executeLine(falsePart, -1);
        }
    }

    private handleSet(args: string[]) {
        const [name, value] = args[0].split('=');
        if (name && value) {
            this.variables[name.toUpperCase()] = value;
        }
    }

    private evaluateCondition(condition: string): boolean {
        const [left, op, right] = condition.split(' ');
        const leftValue = this.replaceVariables(left);
        return op === '==' ? leftValue === right : false;
    }

    private replaceVariables(input: string): string {
        return input.replace(/%([^%]+)%/g, (match, varName) => {
            return this.variables[varName.toUpperCase()] || '';
        });
    }

    private extractComment(line: string): { command: string, comment: string | null } {
        let comment: string | null = null;
        const commentIndex = line.indexOf('#') !== -1 ? line.indexOf('#') : line.indexOf('//');
        if (commentIndex !== -1) {
            comment = line.slice(commentIndex).trim();
            line = line.slice(0, commentIndex).trim();
        }
        return { command: line, comment };
    }

    private saveComment(comment: string) {
        this.comments.push(comment);
    }

    public getComments(): string[] {
        return this.comments;
    }
}
