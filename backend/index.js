const express = require('express');
const admin = require("firebase-admin");
const cors = require('cors');
const qs = require('querystring');
let webpush = require('web-push')

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
 * Config - web-push
 **/

// VAPID keys should only be generated only once.
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
}

webpush.setVapidDetails(
  'mailto:test@test.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

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
      message: 'Unable to get Tasks!',
      position: 'bottom-right'
    })
  }
});

app.post('/createTask', async (req,res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const payload = {
    id: req.query.id,
    title: req.query.title,
    editable: req.query.editable === 'true',
    timestamp: req.query.timestamp,
  }
  try {
    await db.collection('tasks').doc(req.query.id).set(payload);
    res.send({
      type: 'info',
      message: `Task successfully created.`,
      position: 'top-right'
    })
    sendPushNotification()
  } catch(err) {
    res.send({
      type: 'negative',
      message:'Unable to create Task!',
      position: 'bottom-right'
    })
  }
});

function sendPushNotification() {
  // This is the same output of calling JSON.stringify on a PushSubscription

  db.collection('subscriptions').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const subscription = doc.data()
        const { endpoint } = subscription
        const { auth, p256dh } = subscription.keys

        const pushConfig = {
          endpoint,
          keys: {
            auth,
            p256dh
          }
        }
        const pushContent = {
          title: 'A new task has been added!',
        }
        // Notification was received using Chrome > Application** > Push Messaging
        webpush.sendNotification(pushConfig, JSON.stringify(pushContent))
          .then((success) => {
            console.log('Sent push successfully: ', success);
          })
          .catch((err) => {
            console.log('Unable to sent push successfully:', err);
          });
      })
    })
}

app.delete('/removeTask', async (req,res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    await db.collection('tasks').doc(req.query.id).delete();
    res.send({
      type: 'info',
      message: 'Task successfully removed.',
      position: 'top-right'
    })
  } catch(err) {
    res.send({
      type: 'negative',
      message:'Unable to remove Task!',
      position: 'bottom-right'
    })
  }
});

app.put('/updateTask', async (req,res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const payload = {
    id: req.query.id,
    title: req.query.title,
    editable: req.query.editable === 'true',
    timestamp: req.query.timestamp,
  }

  try {
    await db.collection('tasks').doc(req.query.id).set(payload);
    res.send({
      type: 'info',
      message: 'Task successfully updated.',
      position: 'top-right'
    })
  } catch(err) {
    res.send({
      type: 'negative',
      message:'Unable to update Task!',
      position: 'bottom-right'
    })
  }
});

app.post('/createSubscription', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    let snapshot = await db.collection('subscriptions').add(req.query)
    res.send({
      message: 'Subscription added!',
      postData: req.query
    })
  } catch(err) {
    console.log(err)
  }
})

app.listen(port);
