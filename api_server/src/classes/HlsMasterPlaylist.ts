// as per rfc8216
interface StreamAttributes {
    bandwidth?: number;
    codecs?: string;
    frameRate?: number;
    averageBandwidth?: number;
    resolution?: string;
}

export class HlsMasterPlaylist {

    protected readonly variants: Map<string, StreamAttributes> = new Map();

    // only bandwidth is required technically
    addVariant(playlistUrl: string, bandwidth: number, optionalAttributes?: StreamAttributes) {

        const combinedAttributes: StreamAttributes = {
            ...optionalAttributes,
            bandwidth
        };

        this.variants.set(playlistUrl, combinedAttributes);
    }

    toString(): string {

        const lines = [
            '#EXTM3U',
            '#EXT-X-VERSION:3'
        ];

        this.variants.forEach(function (val: StreamAttributes, path: string) {

            const attributes: string[] = [];

            if (val.bandwidth) {
                attributes.push(`BANDWIDTH=${val.bandwidth}`);
            }

            if (val.averageBandwidth) {
                attributes.push(`AVERAGE-BANDWIDTH=${val.averageBandwidth}`);
            }

            if (val.frameRate) {
                attributes.push(`FRAME-RATE=${val.frameRate.toFixed(2)}`);
            }

            if (val.resolution) {
                attributes.push(`RESOLUTION=${val.resolution}`);
            }

            if (val.codecs) {
                attributes.push(`CODECS="${val.codecs}"`);
            }

            const attributesCombined = attributes.join(',');

            lines.push(`#EXT-X-STREAM-INF:${attributesCombined}`);
            lines.push(path);
        });

        return lines.join("\n");
    }
}