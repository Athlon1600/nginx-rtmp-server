/**
 * @typedef {Object} OnPublishPayload
 * @property {string} call       - RTMP command ("publish")
 * @property {string} name       - Stream name (e.g., "test")
 * @property {string} type       - Stream type (usually "live")
 * @property {string} app        - Application name ("live")
 * @property {string} flashver   - Flash encoder version (e.g. "FMLE/3.0 (compatible; Lavf58.45")
 * @property {string} tcurl      - RTMP tcUrl (e.g. "rtmp://localhost:1935/live")
 * @property {string} addr       - Client IP address (e.g. "172.18.0.1")
 * @property {string} clientid   - Nginx-RTMP client ID
 * @property {string} key        - Custom query param from stream URL (only the FIRST one is passed by NGINX-RTMP)
 */

