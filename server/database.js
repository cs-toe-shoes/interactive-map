const { Client } = require('pg');
const conString = require('./server_settings/elephantLogin.js');
const user = require('os').userInfo().username;

// module.exports = () => new Client(conString);

module.exports = () => new Client({
  username: 'joshuakim',
  host: 'localhost',
  database: 'goblin-shark',
  password: 37740200,
  port: 5432,
});
