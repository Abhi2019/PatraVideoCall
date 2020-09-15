const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4 : uuid} = require('uuid');
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
})
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use('/peerjs', peerServer);
app.get('/',(req, res)=>{
    res.redirect(`/${uuid()}`);
})

app.get('/:chat', (req, res)=> {
    res.render('chat', {chatId: req.params.chat});
})

io.on('connection', (socket)=>{
    socket.on('join-chat', (chatId, userId)=>{
       console.log("chat-call", chatId);
       socket.join(chatId);
       socket.to(chatId).broadcast.emit('user-connected', userId);
       socket.on('message', message=> {
            io.to(chatId).emit('get-message', message);
       });
    });
});


server.listen(process.env.PORT || 3000);