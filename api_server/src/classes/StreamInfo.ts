import {ffprobe} from 'fluent-ffmpeg';
import * as Ffmpeg from "fluent-ffmpeg";

export class StreamInfo {

    static probeAsync(inputStream: string, timeout: number = 5000): Promise<Ffmpeg.FfprobeData> {

        return new Promise((resolve, reject) => {

            setTimeout(() => {
                reject("FFProbe timed out")
            }, timeout);

            ffprobe(inputStream, function (error, data) {

                if (error) {
                    reject(error);
                }

                resolve(data);

            });

        });
    }
}