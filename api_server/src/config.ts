export default {
    rtmp: {
        host: process.env.RTMP_SERVER || 'rtmp'
    },
    http: {
        host: ''
    },
    storage: process.env.STORAGE || './public'
};
