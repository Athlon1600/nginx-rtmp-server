import Signals = NodeJS.Signals;

type ShutdownCallback = () => Promise<void>;

const callbacks: Array<ShutdownCallback> = [];

async function shutdown(reason?: any) {

    for (const listener of callbacks) {

        try {
            await listener();
        } catch (e) {
            console.error(e);
        }
    }

    process.exit(0);
}

const shutdownOnce = (() => {

    let called: boolean = false;

    return async function (...args: any[]) {

        if (!called) {
            called = true;
            await shutdown(...args);
        }
    }

})();

function registerShutdownEventListeners() {

    const SHUTDOWN_SIGNALS: Array<Signals> = [
        'SIGHUP',
        'SIGINT',
        'SIGTERM',
        // 'SIGKILL'
    ];

    (SHUTDOWN_SIGNALS as Signals[]).forEach((signal: Signals) => {

        process.once(signal, async function () {
            await shutdownOnce(signal);
        });

    });

    [`exit`, `uncaughtException`].forEach((eventType) => {

        process.on(eventType, async () => {
            await shutdownOnce(eventType);
        });

    });
}

export const registerShutdownCallback = (callback: ShutdownCallback) => {
    registerShutdownEventListeners();
    callbacks.push(callback);
}