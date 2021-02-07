const express = require('express');
const admin = require("firebase-admin");
const cors = require('cors');
const qs = require('querystring');

/**
 * Config - env var
 * */

require('dotenv').config();


/**
 * Config - Express
 * */

const app = express();
const port = 3000;
const host = "http://localhost:8080";

app.use(cors({ origin: host }));

/**
 * Config - Firebase
 * */

const serviceAccount = require('./config');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Endpoints - Tasks
 * */

app.get('/tasks',async  (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const tasks = [];

  try {
    const snapshot = await db.collection('tasks').orderBy('id').get();
    snapshot.forEach((doc) => {
      tasks.push(doc.data());
    });
    res.send(tasks);
  } catch(err) {
    res.send({
      type: 'negative',
      message: 'Unable to get Tasks!'
    })
  }
});

app.post('/createTask', async (req,res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const payload = {
    id: req.query.id,
    title: req.query.title,
    editable: false,
    timestamp: Date.now(),
  }
  try {
    await db.collection('tasks').doc(req.query.id).set(payload);
    res.send({
      type: 'info',
      message: `Task successfully created.`
    })
  } catch(err) {
    res.send({
      type: 'negative',
      message:'Unable to create Task!'
    })
  }
});

app.delete('/removeTask', async (req,res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    await db.collection('tasks').doc(req.query.id).delete();
    res.send({
      type: 'info',
      message: 'Task successfully removed.'
    })
  } catch(err) {
    res.send({
      type: 'negative',
      message:'Unable to remove Task!'
    })
  }
});

app.put('/updateTask', async (req,res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const payload = {
    id: req.query.id,
    title: req.query.title,
    editable: false,
    timestamp: Date.now(),
  }

  try {
    await db.collection('tasks').doc(req.query.id).set(payload);
    res.send({
      type: 'info',
      message: 'Task successfully updated.'
    })
  } catch(err) {
    res.send({
      type: 'negative',
      message:'Unable to update Task!'
    })
  }
});

app.listen(port);
