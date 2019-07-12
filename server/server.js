const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// localhost port
const app = express();
const port = 3000;

// create a socket with the server instance
const server = app.listen(port, () => console.log(`listening on port ${port}!`));
const io = require('socket.io').listen(server);
const apiRouter = require('./routers/apiRouter.js');

const socketIO = {};
io.on('connection', (socket) => {
  console.log('websocket connected');
  socketIO.socket = socket;
  socket.on('my other event', (data) => {
    console.log(data);
  });
});

app.use((req, res, next) => {
  req.io = io;
  req.socket = socketIO.socket;
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(
  session({
    secret: 'banana-hammock',
    cookie: { maxAge: 60000 },
    // resave forces session to be saved back to the session store
    resave: false,
    // saveUninitialized forces session that is 'uninitialized' to be saved to the store
    saveUninitialized: false,
  }),
);

// app.get('/api/resources/:id', getData);
app.use('/api', apiRouter);
app.use('/dist', express.static('dist'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// app.listen(port, () => console.log(`listening on port ${port}!`));
