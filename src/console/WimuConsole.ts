import Color from "cli-color";
import ConsoleClear from "clear";
import figlet from "figlet";

const WimuConsole = {
    clear: ConsoleClear,
    info: (message?: any) => {
        console.log(`${Color.greenBright(`INFO >`)} ${message}`);
    },
    success: (message?: any) => {
        console.log(`${Color.greenBright(`SUCCESS >`)} ${message}`);
    },
    warn: (message?: any) => {
        console.log(`${Color.yellowBright(`WARN >`)} ${message}`);
    },
    error: (message?: any) => {
        console.log(`${Color.redBright(`ERROR >`)} ${message}`);
    },
    figletLog: (text: string, type: figlet.Fonts) => {
        console.log(figlet.textSync(text, type))
    },
    figlet: (text: string, type: figlet.Fonts) => {
        return figlet.textSync(text, type);
    }
}

export default WimuConsole;