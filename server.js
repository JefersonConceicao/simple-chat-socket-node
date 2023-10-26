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
        origin:'*',
        methods: ['GET', 'POST']
    }
});

const arrayMessages = [];

io.on('connection', (socket) => {
    socket.join('minha_sala');

    io.to('minha_sala').emit('get_messages', arrayMessages)

    socket.on('send_message', (data) => {
        arrayMessages.push({
            author: data.author,
            message: data.message,
        });

        io.to('minha_sala').emit('send_message', {
            author: data.author,
            message: data.message,
        })
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

server.listen(port, '172.22.9.169', () => {
    console.log(`Rodando ${port}`)
})