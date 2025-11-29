const RESERVED_USERNAMES: Array<string> = [
    'root',
    'superuser',
    'admin',
    'administrator',
    'owner'
];

const containsOnlyAlphanumeric = (str: string) => {
    return str.match(/[^a-z0-9_]/i) === null;
}

export const validateUsername = function (username: string): boolean {

    if (containsOnlyAlphanumeric(username) && !RESERVED_USERNAMES.includes(username)) {
        return (username.length >= 4 && username.length < 30);
    }

    return false;
}

export const validatePassword = function (password: string): boolean {
    return password.length >= 8;
}

export const validateChannelName = (channelName: string): boolean => {

    if (channelName.length < 3 || channelName.length > 20) {
        throw new Error("Channel name either too short or too long. Must be between 3 and 20 characters");
    }

    if (!containsOnlyAlphanumeric(channelName)) {
        throw new Error('Channel name contains invalid characters. Only letters/numbers and underscores allowed');
    }

    if (channelName.match(/^[0-9_]/) !== null) {
        throw new Error("Channel name cannot begin with a number or underscore");
    }

    if (channelName.match(/[0-9_]$/) !== null) {
        throw new Error("Channel name cannot end with a number or underscore");
    }

    if (channelName.match(/_{2,}/) !== null) {
        throw new Error("Channel name cannot contain two underscores in a row");
    }

    return true;
}