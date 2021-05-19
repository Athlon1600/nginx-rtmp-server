import {Util} from "../Util";
import {FfmpegCommand} from "fluent-ffmpeg";
import {ChildProcess} from "child_process";
import {M3u8} from "./M3u8";
import {Logger} from "./Logger";

const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

export class Transcoder {

    protected streamName: string;
    protected outputDirectoryName: string;
    protected enable480 = false;
    protected command: FfmpegCommand;

    // inputUri
    constructor(streamName: string) {
        this.streamName = streamName;
        this.outputDirectoryName = streamName;
    }

    enableMobilePreset(boolean: boolean) {
        this.enable480 = boolean;
    }

    // helpful when translating from rtmp/live/{stream_key} => /hls/{custom_name}
    setOutputDirectoryName(name: string) {
        this.outputDirectoryName = name;
    }

    // TODO:
    getPlaylistStoragePath(variant?: string) {

        if (variant) {
            Util.storagePath('hls/' + this.outputDirectoryName + '/' + variant);
        }

        return Util.storagePath('hls/' + this.outputDirectoryName);
    }

    async start(): Promise<boolean> {

        const dirName = this.outputDirectoryName;

        // hls/{playlistName}/{variantName}/*.ts
        let srcPath = Util.storagePath('hls/' + dirName + '/src');

        // Writable directory must already exist or else ffmpeg fails
        fs.mkdirSync(srcPath, {
            recursive: true
        });

        let mobilePath = Util.storagePath('hls/' + dirName + '/480p');

        fs.mkdirSync(mobilePath, {
            recursive: true
        });

        const defaultOutputOptions = [
            '-max_muxing_queue_size 9999',
            '-f hls',
            '-hls_time 5',
            '-hls_list_size 10',
            '-hls_flags delete_segments',
            '-hls_start_number_source epoch',
            // will not delete old segments...
            // '-hls_playlist_type event',
        ];

        let optionsForSource = [
            '-c copy'
        ].concat(defaultOutputOptions);

        let optionsFor480 = [
            '-c:v libx264',
            '-c:a aac',
            '-b:a 128k',
            '-ac 2',
            '-preset veryfast',
            '-crf 23',
            '-s 854x480',
        ].concat(defaultOutputOptions);

        const streamName = this.streamName;
        const enable480 = this.enable480;

        const oThis = this;

        return new Promise((resolve, reject) => {

            let command = ffmpeg();

            command
                .input(Util.rtmpStreamUrl(streamName))
                .inputOption('-re');

            command
                .output(srcPath + '/index.m3u8')
                .outputOptions(optionsForSource);

            if (enable480) {

                command
                    .output(mobilePath + '/index.m3u8')
                    .outputOptions(optionsFor480);
            }

            // TODO: this is a temporary solution... let ffmpeg itself generate this file
            oThis.createMasterPlaylist();

            command
                .on('start', function (commandLine: string) {
                    Logger.log(`[ffmpeg] ${commandLine}`);

                    const process = command.ffmpegProc as ChildProcess;
                    const pid = process.pid;

                    Logger.log(`[ffmpeg] PID: ${pid}`);

                    process.on('exit', function () {
                        reject('Transcoder: Process exited.');
                    });
                })
                .on('error', function (err: any, stdout: any, stderr: any) {
                    oThis.cleanup();
                    reject(err);
                })
                .on('end', function (stdout: any, stderr: any) {
                    oThis.cleanup();
                    resolve(true);
                });

            command.run();

            this.command = command;

        });
    }

    protected createMasterPlaylist(): void {

        let playlist = new M3u8();
        playlist.addVariant('src/index.m3u8', 'src', 4500000);

        if (this.enable480) {
            playlist.addVariant('480p/index.m3u8', '480p', 550000);
        }

        let path = Util.storagePath('hls/' + this.outputDirectoryName + '/master.m3u8');
        fs.writeFileSync(path, playlist.toString());
    }

    protected cleanup(): void {
        let userDir = Util.storagePath('hls/' + this.outputDirectoryName);

        Logger.info('Cleaning up playlist files for a stream that is now offline...');
        Logger.info('Dir: ' + userDir);

        fs.rmdirSync(userDir, {
            recursive: true
        });
    }

    public stop(): void {

        if (this.command) {

            // Sending a signal that terminates the process will result in the error event being emitted.
            this.command.on('error', function () {
                Logger.error('Ffmpeg has been killed');
            });

            this.command.kill('SIGKILL');
        }
    }
}