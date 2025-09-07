import {spawn} from "child_process";
import {Util} from "../Util";

export class Screenshot {

    static async capture(inputStream: string, output: string): Promise<void> {

        const args = [
            "-i", inputStream,
            '-frames:v 1', // frames
            '-q:v 25', // image quality
            '-vf scale=720x460',
            '-an', // no audio
            '-y', // overwrite file
            output
        ];

        return new Promise(function (resolve, reject) {

            const proc = spawn("ffmpeg", Util.splitArgs(args), {stdio: ["ignore", "pipe", "pipe"]});

            proc.on('error', (err) => {
                reject(err);
            });

            let stderr = "";

            proc.stderr.on("data", (chunk) => {
                stderr += chunk.toString();
            });

            proc.on("close", (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
                }
            });
        });
    }
}