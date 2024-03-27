/* eslint-disable no-console */
import Dockerode from 'dockerode';

// Define a type for Docker events
interface DockerEvent {
  Type: string;
  Action: string;
  Actor: {
    ID: string;
    Attributes: {
      name: string;
    };
  };
}

// Create a Docker client instance
const docker = new Dockerode({ socketPath: '/var/run/docker.sock' });

// Define the name of the container you want to monitor
const containerName = 'your_container_name';

// Function to handle container events
function containerEventHandler(event: DockerEvent): void {
  if (
    event.Action === 'start' &&
    event.Actor?.Attributes?.name === containerName
  ) {
    console.log(`Container ${containerName} has started running.`);
  }
}

// Start monitoring container events
docker.getEvents((err, stream) => {
  if (err) {
    console.error('Error getting Docker events:', err);
    return;
  }

  // prevent stream undefined
  if (stream) {
    // Decode the stream data into JSON objects
    stream.setEncoding('utf8');
    stream.on('data', (data) => {
      const event = JSON.parse(data) as DockerEvent;
      containerEventHandler(event);
    });
  }
});
