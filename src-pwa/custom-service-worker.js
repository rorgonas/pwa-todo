/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */


/*
 * Dependencies
 *  */

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { Queue } from 'workbox-background-sync';


/*
* Config
* */

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

/*
* Check if Background sync is natively supported
* */

let isBackgroundSyncSupported = 'sync' in self.registration

/*
* Cashing strategies
* */

registerRoute(
  ({ url }) => url.pathname.startsWith('/tasks'),
  new NetworkFirst()
);


/*
* Queues createTask
* */

const createTaskQueue = new Queue('createTaskQueue');


/*
* Events fetch
* */
self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('http://localhost:3000/createTask') && !self.navigator.onLine) {
    const promiseChain = fetch(event.request.clone()).catch((err) => {
      return createTaskQueue.pushRequest({ request: event.request });
    });
    event.waitUntil(promiseChain);
  }
});

/*
* Events - push
* */

self.addEventListener('push', event => {
  console.log('Push message received:', event)
  if (event.data) {
    // store push message content in data
    let data = JSON.parse(event.data.text())
    event.waitUntil(
      self.registration.showNotification(data.title)
    )
  }
})

/*
* Events - notifications
* */

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(
    clients.matchAll().then((clients) => {
      let clientUsingApp = clients.find(client => {
        return client.visibilityState === 'visible'
      })

      if (clientUsingApp) {
        clientUsingApp.navigate('/#/')
        clientUsingApp.focus()
      } else {
        clients.openWindow('/#/')
      }
    })
  )
})

