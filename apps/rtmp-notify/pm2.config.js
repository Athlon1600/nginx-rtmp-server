const inClusterMode = true;

module.exports = {
    apps: [
        {
            name: 'server',
            script: './server/index.js',
            instances: inClusterMode ? 'max' : 1,
        }
    ]
}