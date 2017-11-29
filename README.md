# api-server [![Build Status](https://travis-ci.org/BPChain/api-server.svg?branch=master)](https://travis-ci.org/BPChain/api-server) [![Build Status](https://travis-ci.org/BPChain/api-server.svg?branch=dev)](https://travis-ci.org/BPChain/api-server)

A simple API-Server that provides a RESTful interface for the frontend, a Websocket for the simulated Blockchain and a Database for persisting the aggregated data.

## Start the server

To start the server open two seperate terminals. Then you run 
```shell
./initDatabase.sh
``` 
in the first terminal and 

```shell
./initServer.sh
```
in the second terminal. Both actions require root privileges and docker.io.
