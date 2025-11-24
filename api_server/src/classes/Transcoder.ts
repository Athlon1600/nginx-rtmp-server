import {Util} from "../Util";
import {ChildProcess, spawn} from "child_process";
import {Logger} from "./Logger";
import {HlsMasterPlaylist} from "./HlsMasterPlaylist";

const fs = require('fs');
const path = require('path');

export class Transcoder {

    protected streamName: string;
    protected outputDirectoryName: string;
    protected enable480 = false;

    private proc: ChildProcess | null = null;

    protected playlistWatchInterval: NodeJS.Timeout;

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
        Logger.log(`Creating directory: ${srcPath}`);
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
            '-hls_time 5', // higher causes more delay
            '-hls_list_size 10',
            '-hls_flags delete_segments',
            '-hls_start_number_source epoch',
            // will not delete old segments...
            // '-hls_playlist_type event',
        ];

        let optionsFor480 = [
            '-c:v libx264',
            '-c:a aac',
            '-b:a 128k',
            '-ac 2',
            '-preset veryfast',
            '-crf 23',
            '-s 854x480',
        ];

        const streamName = this.streamName;
        const enable480 = this.enable480;

        const oThis = this;

        let playlists = new Array<string>();

        const inputSource = Util.rtmpStreamUrl(streamName);
        const outputPath: string = srcPath + '/index.m3u8';

        const args: string[] = [
            "-re",
            "-i", inputSource,
            "-c", "copy",
            ...Util.splitArgs(defaultOutputOptions),
            outputPath
        ];

        playlists.push(outputPath);

        return new Promise((resolve, reject) => {

            const outBuffer = Util.fixedBuffer();
            const errBuffer = Util.fixedBuffer();

            const proc = spawn("ffmpeg", args, {stdio: ["ignore", "pipe", "pipe"]});
            proc.on("spawn", () => {

                const commandLine = ["ffmpeg", ...args].join(" ");
                Logger.log(`[ffmpeg] started as: ${commandLine}`);

                // do not create master playlist file until the playlists it is referencing exist first!
                oThis.createMasterPlaylistWhenExist(playlists);

                proc.on('exit', function (code) {

                    Logger.log('[ffmpeg] exited with code: ' + code);
                    Logger.info(outBuffer.get());
                    Logger.error(errBuffer.get());

                    oThis.cleanup();

                    // Finished properly
                    if (code === 0) {
                        resolve(true);
                    } else {
                        reject('Transcoder: Process exited with code: ' + code);
                    }

                });
            });

            proc.stdout.on("data", data => {
                outBuffer.append(data);
            });

            proc.stderr.on("data", data => {
                errBuffer.append(data);
            });

            proc.on('error', function (err: any) {
                Logger.error('Failed to start process');
                oThis.cleanup();
                reject(err);
            });

            if (enable480) {
                // TODO
            }

            this.proc = proc;

        });
    }

    protected createMasterPlaylistWhenExist(playlists: Array<string>): void {

        this.playlistWatchInterval = setInterval(() => {

            if (Util.existsSyncAll(playlists)) {
                clearInterval(this.playlistWatchInterval);
                this.createMasterPlaylist();

                Logger.info('Master playlist was created!');
            } else {
                Logger.info('Master playlist not ready to be created...');
            }

        }, 3000);
    }

    // TODO: this is a temporary solution... let ffmpeg itself generate this file
    protected createMasterPlaylist(): void {

        let playlist = new HlsMasterPlaylist();
        playlist.addVariant('src/index.m3u8', 4500000);

        if (this.enable480) {
            playlist.addVariant('480p/index.m3u8', 550000);
        }

        let path = Util.storagePath('hls/' + this.outputDirectoryName + '/master.m3u8');
        fs.writeFileSync(path, playlist.toString());
    }

    protected cleanup(): void {
        clearInterval(this.playlistWatchInterval);

        let userDir = Util.storagePath('hls/' + this.outputDirectoryName);

        Logger.info('Cleaning up playlist files for a stream that is now offline...');
        Logger.info('Dir: ' + userDir);

        fs.rmSync(userDir, {
            recursive: true
        });
    }

    public stop(): void {

        if (this.proc) {

            // Sending a signal that terminates the process will result in the error event being emitted.
            this.proc.on('error', function () {
                Logger.error('Ffmpeg has been killed');
            });

            this.proc.kill("SIGINT"); // gracefully
            // this.proc.kill('SIGKILL'); // force kill
        }
    }
}