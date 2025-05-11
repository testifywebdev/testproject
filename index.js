const express = require('express');
const Docker = require('dockerode');
const app = express();
const docker = new Docker();  // Docker client

// Route to initialize the Docker container
app.get('/init', async (req, res) => {
    try {
        // Example: Spin up a Docker container based on an image (replace 'your-docker-image' with your image)
        const container = await docker.createContainer({
            Image: 'your-docker-image',  // Docker image name
            Cmd: ['/bin/bash', '-c', 'echo Hello World'], // Command to run inside the container
            AttachStdout: true,  // Attach stdout for container logs
            AttachStderr: true,  // Attach stderr for error logs
        });

        // Start the container
        await container.start();

        // Wait for the container to finish its job and then destroy it
        container.wait((err, data) => {
            if (err) {
                res.status(500).json({ error: 'Error waiting for container', details: err });
            } else {
                container.remove((removeErr, removeData) => {
                    if (removeErr) {
                        res.status(500).json({ error: 'Error removing container', details: removeErr });
                    } else {
                        res.status(200).json({ message: 'Container finished and removed', data: removeData });
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error starting container', details: error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
