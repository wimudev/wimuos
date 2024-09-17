export abstract class WimuLibrary {
    
    private name: string = "";
    private version: string = "";
    private description: string = "";

    setName(name: string) {
        this.name = name;
        return this;
    }

    setVersion(version: string) {
        this.version = version;
        return this.version;
    }

    setDescription(description: string) {
        this.description = description;
        return this;
    }

    abstract initialize(): this;

}