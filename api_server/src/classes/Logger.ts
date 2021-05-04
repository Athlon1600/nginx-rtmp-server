export class Logger {
    
    private static logger: any = null;

    protected getLogger() {
        // TODO
    }

    static log(str: any) {
        console.log(str);
    }

    static error(str: any) {
        console.error(str);
    }

    static info(str: any) {
        console.log(str);
    }

    static debug(str: any) {
        console.log(str);
    }
}