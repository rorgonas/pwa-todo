const express = require('express');

/**
 * Config - Express
 * */

const app = express();


/**
 * Endpoints - get tasks
 * */

app.get('/tasks', (req, res) => {
  res.send('return list of tasks');
});

app.listen();
