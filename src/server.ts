import {SampleApp} from "./app";

// Starts the Node-Boot server with the application deployed
new SampleApp()
    .start()
    .then(app => {
        app.logger.debug(`SampleApp started successfully at port ${app.appOptions.port}`);
    })
    .catch(reason => {
        console.error(`Error starting SampleApp: ${reason}`);
    });
