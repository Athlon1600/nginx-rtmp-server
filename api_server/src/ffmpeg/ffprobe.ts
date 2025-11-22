import {clearTimeout} from "node:timers";
import {spawn} from "child_process";

type PromiseResultString = Promise<string>;

export const ffprobeStreamInfo = async (rtmpUrl: string): PromiseResultString => {

    const args = [
        '-v', 'error',
        '-print_format', 'json',
        '-show_streams', '-show_format'
    ];

    return ffprobe(args, rtmpUrl);
}

export const ffprobe = async (
    options: string[],
    inputUrl: string,
    timeout: number = 5000
): PromiseResultString => {

    let killTimeout: NodeJS.Timeout = null;

    const cancelKillTimeout = () => {
        clearTimeout(killTimeout);
    }

    return new Promise((resolve, reject) => {

        const args = [
            ...options,
            inputUrl
        ];

        const ffprobe = spawn('ffprobe', args)

        let stdout = "";
        let stderr = "";

        ffprobe.stdout.on("data", (chunk) => {
            stdout += chunk.toString();
        });

        ffprobe.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        killTimeout = setTimeout(() => {
            ffprobe.kill("SIGKILL");
        }, timeout);

        ffprobe.on('error', (err) => {
            cancelKillTimeout();
            reject(`Failed to start ffprobe: ${err}`);
        });

        ffprobe.on('close', (code) => {
            cancelKillTimeout();

            // success
            if (code === 0) {
                resolve(stdout);
            } else {
                reject(`ffprobe exited with code: ${code}: ${stderr}`);
            }

        });

    });
};
