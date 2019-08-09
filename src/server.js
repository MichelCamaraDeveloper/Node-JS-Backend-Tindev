const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const server =  express();

//Conexão com o MongoDB  Atlas Clusters
mongoose.connect('mongodb+srv://<user>:<password>@cluster0-oet8x.mongodb.net/<databasename>?retryWrites=true&w=majority',{
    useNewUrlParser: true
});

server.user(cors());
server.use(express.json());
server.use(routes);

server.listen(3333);