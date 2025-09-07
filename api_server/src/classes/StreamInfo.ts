import {spawn} from "child_process";

export class StreamInfo {

    static probeAsync(inputStream: string, timeout: number = 5000): Promise<string> {

        return new Promise((resolve, reject) => {

            const args = [
                '-v', 'error',
                '-print_format', 'json',
                '-show_streams', '-show_format',
                inputStream
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

            setTimeout(() => {
                ffprobe.kill("SIGKILL");
                reject("FFProbe timed out")
            }, timeout);

            ffprobe.on('error', (err) => {
                reject(`Failed to start ffprobe: ${err}`);
            })

            ffprobe.on('close', (code) => {

                // success
                if (code === 0) {
                    resolve(stdout);
                } else {
                    reject(`ffprobe exited with code: ${code}: ${stderr}`);
                }

            });

        });
    }
}