export abstract class WimuContext {
    abstract runNonWimuContext(...args: any[]): any;
    abstract runContext(...args: any[]): any;
}