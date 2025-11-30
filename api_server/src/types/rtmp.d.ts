// noinspection SpellCheckingInspection
export interface OnPublishPayload {

    call: "publish" | string;
    name: string;
    type: "live" | string;
    app: "live" | string;
    flashver: string; // FMLE/3.0 (compatible; Lavf58.45
    tcurl: string; // rtmp://localhost:1935/live
    addr: string; // 172.18.0.1
    clientid: string;

    // custom params - that are not sent by default
    // for some reason NGINX-RTMP only allows one
    // rtmp://server/live/STREAM_NAME?one=something_special&two=IGNORED&three=ALSO_IGNORED
    key: string;
}

// noinspection SpellCheckingInspection
export interface OnPublishDonePayload {

    call: "publish_done" | string;
    name: string;
    bytes_in: number;
    bytes_out: number;
    addr: string;
    clientid: string;
    app: "live" | string;
    flashver: string;
    tcurl: string;
}
