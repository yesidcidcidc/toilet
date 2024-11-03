const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const players = {}; // Храним позиции игроков

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);
    
    // Создаем нового игрока
    players[socket.id] = { x: Math.random(), y: Math.random(), z: Math.random() };

    // Отправляем данные всем игрокам
    io.emit('updatePlayers', players);

    // Обработка события движения игрока
    socket.on('playerMoved', (playerData) => {
        players[socket.id] = playerData; // Обновляем позицию игрока
        io.emit('updatePlayers', players); // Отправляем обновленные данные всем игрокам
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        delete players[socket.id]; // Удаляем игрока из списка
        io.emit('updatePlayers', players); // Обновляем позиции для всех
    });
});

// Статическая папка для файлов игры
app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
