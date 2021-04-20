export class Filesystem {

    public static publicPath(path: string) {
        path = path.replace(/^\/+/, '');

        return './public/' + path;
    }
}