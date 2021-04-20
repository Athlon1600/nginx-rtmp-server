const ffmpeg = require('fluent-ffmpeg');

export class Screenshot {

    static async run(inputStream: string, output: string): Promise<void> {

        return new Promise(function (resolve, reject) {

            ffmpeg()
                .input(inputStream)
                .outputOptions([
                    '-frames:v 1', // frames
                    '-q:v 25', // image quality
                    '-vf scale=720x460',
                    '-an', // no audio
                    '-y', // overwrite file
                ])
                .output(output)
                .on('progress', function (progress: any) {
                    // console.log(`[ffmpeg] ${JSON.stringify(progress)}`);
                })
                .on('error', function (err: any) {
                    reject(err);
                })
                .on('end', function () {
                    resolve();
                })
                .run();
        });
    }
}