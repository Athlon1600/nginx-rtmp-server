import {Util} from "../Util";

// crockford base 32
const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";

function prettyId(length = 20) {
    return Array.from({length}, () =>
        alphabet[Math.floor(Math.random() * alphabet.length)]
    ).join('');
}

// always 32 characters exactly
const generatePublicId = (prefix: string) => {
    return prefix + prettyId(32 - prefix.length);
}

export const generateStreamId = () => {
    return 'str_' + prettyId(32 - 4);
}

export const generateUserPublicId = () => {
    return generatePublicId('usr_');
}

