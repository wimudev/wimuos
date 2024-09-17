export function merge(base: any, add: any): any {
    for (const [k, v] of Object.entries(add)) base[k] = v;
    return base;
}

export type NonInitializedClass = new (...args: any[]) => any;