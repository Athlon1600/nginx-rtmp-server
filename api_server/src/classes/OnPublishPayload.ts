// noinspection SpellCheckingInspection

export class OnPublishPayload {

    public call: string; // publish
    public name: string; // test
    public type: string; // live
    public app: string; // live
    public flashver: string; // FMLE/3.0 (compatible; Lavf58.45
    public tcurl: string; // rtmp://localhost:1935/live
    public addr: string; // 172.18.0.1
    public clientid: string; // 1

    // custom params - that are not sent by default
    // for some reason NGINX-RTMP only allows one
    // rtmp://server/live/STREAM_NAME?one=something_special&two=IGNORED&three=ALSO_IGNORED
    public key: string;
}