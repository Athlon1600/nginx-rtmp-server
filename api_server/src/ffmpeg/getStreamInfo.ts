import {ffprobe} from "./ffprobe";

interface StreamInfo {
    videoCodec: string;
    width: number;
    height: number;
    frameRate: number;
    audioCodec: string;
}

const frameRateAsNumber = (frameRate: string): number => {

    // parse avg_frame_rate: '30/1',
    const slashPos = frameRate.indexOf("/");

    const numerator = frameRate.slice(0, slashPos);
    const denominator = frameRate.slice(slashPos + 1);

    return parseInt(numerator) / parseInt(denominator);
}

export const getStreamInfo = async (rtmpStreamUrl: string): Promise<StreamInfo> => {

    const probeOptions = [
        '-v', 'error',
        '-hide_banner',
        '-show_streams',
        //'-show_entries', 'stream=index,codec_type,codec_name,width,height,avg_frame_rate',
        '-print_format', 'json',
    ];

    const str = await ffprobe(probeOptions, rtmpStreamUrl);
    const probeJson = JSON.parse(str);

    const vid = probeJson.streams.find((stream: any) => {
        return stream.codec_type === 'video';
    });

    const audio = probeJson.streams.find((stream: any) => {
        return stream.codec_type === 'audio';
    });

    const videoCodec = vid.codec_name;
    const width = vid?.width;
    const height = vid?.height;
    let frameRate = vid?.avg_frame_rate;

    const videoBitrate = vid?.bit_rate; // in bits per second

    if (frameRate) {
        frameRate = frameRateAsNumber(frameRate);
    }

    const audioCodec = audio.codec_name;

    return {
        videoCodec,
        width,
        height,
        frameRate,
        audioCodec
    };
}