const fs = require('fs-extra');
const childProcess = require('child_process');


try {
    // Remove current build
    fs.removeSync('./dist/');
    // Copy front-end files
    fs.copySync('./src/server/public', './dist/public');
    fs.copySync('./src/server/views', './dist/views');
    // Transpile the typescript files
    const proc = childProcess.exec('tsc --build ./src/server/tsconfig.prod.json');
    proc.on('close', (code) => {
        if (code !== 0) {
            throw Error("Build failed")
        }
    })
} catch (err) {
    console.log(err);
}
