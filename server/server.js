const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const apiRouter = require('./routers/apiRouter.js');

const port = 3000;
server.listen(80);

io.on('connection', (socket) => {
  console.log('websocket connected');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data);
  });
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

app.listen(port, () => console.log(`listening on port ${port}!`));
