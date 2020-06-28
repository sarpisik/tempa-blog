import './LoadEnv'; // Must be the first import
import server from '@server';
import logger from '@shared/Logger';

// Start the server
const port = Number(process.env.PORT || 3000);
server().then((app) => {
    app.listen(port, () => {
        logger.info('Express server started on port: ' + port);
    });
});
