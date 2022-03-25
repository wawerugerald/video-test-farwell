const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()//router routes. 
const server = require('http').Server(app)
const io = require('socket.io')(server) //initializing the server.via the communication socket created. 
const  {v4:uuidV4 } = require ('uuid')//The uuid library installed helps to set up this. gives random uuid's(rooms)
app.use(express.static('public')) //all js and css files go to the public folder
app.set('view engine','ejs',) //renders the ejs templates

//redirects to the index page.
router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/views/index.html'));    
 })
// app.get('/:room',(req,res)=>{
//     res.render(`/room/?room-id=${uuidV4()}`)
// }) 
//rendering the room id from the URL.
//the room view is to be rendered. 
app.get('/:room',(req,res)=>{
    res.render('room', {roomId: req.params.room})
})
//thinking of what we are going to handle with our server.io
io.on('connection',socket =>{
    //when you join the room we are going to pass the roomId and the userId
    socket.on('join-room',(roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)
        socket.on('disconnect', () => { 
            socket.to(roomId.broadcast.emit('user-disconnected', userId))
        })
    })
})
//listening to port 3000 locally
app.use('/', router);
// app.listen(process.env.port || 3000);  // another way to show
server.listen(3000) 
