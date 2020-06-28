const fs = require('fs');
const path = require('path');

const entries = fs.readdirSync(path.resolve(__dirname, '../scripts/'));

module.exports = {
    generateEntries(isProd) {
        return entries.reduce(function entryReducer(entries, entry) {
            const entryName = entry.split('.')[0];
            const entryPath = path.resolve(
                __dirname,
                `../scripts/${entryName}.ts`
            );
            entries[entryName] = isProd
                ? entryPath
                : [
                      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
                      entryPath,
                  ];

            console.info(`Generated entry for ${entry}`);

            return entries;
        }, {});
    },
};
