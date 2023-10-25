const express = require('express');
const http = require('http');

const app = express();
const port = 3000;
const cors = require('cors');

const server = http.createServer(app);
app.use(cors());

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin:['http://localhost:5173', 'http://localhost:3000']
    }
});

const arrayMessages = [];

io.on('connection', (socket) => {
    socket.emit('get_messages', arrayMessages)

    socket.on('send_message', (data,callback) => {
        arrayMessages.push({
            author: data.author,
            message: data.message,
        });

        callback({
            author: data.author,
            message: data.message,
        }); 
    })
    
    socket.on('disconnect', () => {
        console.log(`Um usuário se desconectou`)
    })
})


app.get('/', (req, res) => {
    res.json({
        error: false, 
        message: 'Sem erros'
    });
})

server.listen(port, () => {
    console.log(`Rodando ${port}`)
})