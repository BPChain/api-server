# api-server
Master-Branch: [![Build Status](https://travis-ci.org/BPChain/api-server.svg?branch=master)](https://travis-ci.org/BPChain/api-server) <br />
Dev-Branch: [![Build Status](https://travis-ci.org/BPChain/api-server.svg?branch=dev)](https://travis-ci.org/BPChain/api-server) <br />

A simple API-Server that provides a RESTful interface for the frontend, a Websocket for the simulated Blockchain and a Database for persisting the aggregated data.

## Start the Server

To start the server you have to instantiate a Docker network by executing the script only once:

```shell
./initDockerNet.sh
```

If an error occurs with the message: 'Error response from daemon: network with name backendnet already exists', search for the currently active Docker network with the command:

```shell
docker network ls
```

And delete the corresponding network with the command:

```shell
docker network rm networkname
```

Then try to start the docker network again. As soon as the Docker network is running you can start the MongoDB Docker with the following script. Make sure that you have set up an .env-file in the database directory with the root username and password.

```shell
./initDatabase.sh
```

After that you can create new users with the script './createDbUsers.sh' provided in the database directory if neccessary. Usually you only have to do this once because the database is persistent.

```shell
./database/createDbUsers.sh
```

And finally start the server with the script:

```shell
./initServer.sh
```

After the procedure you can delete the .env-file for security reasons.
