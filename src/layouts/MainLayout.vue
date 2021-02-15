<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-center">
          PWA Todo
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer>
      <q-toolbar>
        <q-btn
          v-if="pushNotificationSupported"
          @click="enableNotification"
          label="Enable Notifications"
          class="col"
          no-caps
          dense
        />
        <q-btn
          v-if="showInstallAppButton"
          @click="installApp"
          label="Install App"
          class="col"
          no-caps
          dense
        />
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import * as qs from "qs";

let deferredPrompt;
let registration;

export default {
  name: 'MainLayout',

  data () {
    return {
      showInstallAppButton: false,
    }
  },
  computed: {
    pushNotificationSupported() {
      return 'PushManager' in window
    },
    serviceWorkerSupported() {
      return 'serviceWorker' in navigator
    }
  },
  mounted() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent showing the prompt
      deferredPrompt = e;
      this.showInstallAppButton = true;
    });
  },
  methods: {
    installApp() {
      deferredPrompt.prompt();

      deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.showInstallAppButton = false;
          }
          // We no longer need the prompt.  Clear it up.
          deferredPrompt = null;
        });
    },
    enableNotification() {
      if (this.pushNotificationSupported) {
        Notification.requestPermission(result => {
          if (result === 'granted') {
            this.checkForExistingPushSubscription();
          }
        })
      }
    },
    // Check existent Push Notification subscription
    checkForExistingPushSubscription() {
      if (this.serviceWorkerSupported && this.pushNotificationSupported) {
        navigator.serviceWorker.ready
          .then(swreg => {
            registration = swreg;
            return swreg.pushManager.getSubscription()
          })
          .then(sub => {
            if(!sub) {
              this.createPushSubscription()
            }
          })
      }
    },
    // Subscribe to a new Push Notification subscription
    createPushSubscription() {
      // Need to secure push subscription by combining a user private & public key
      const vapidPublicKey  = 'BOfMjG9iNh32LTf9MAMlS_XEfxxq-UCIEjGUfjTXslo_1S4WRuL3i5_CHAvjB5O4LHQXXcSOYiUMDBXqMCJlrfQ'
      const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      }).then(newSub => {
        let newSubData = newSub.toJSON(),
          newSubDataQS = qs.stringify(newSubData)
        return this.$axios.post(`${process.env.API}/createSubscription?${newSubDataQS}`)
      }).then((response => {
        console.log('Create subscription response ',response.data)
        this.displayGrantedNotification()
      })).catch(err => {
        console.log('Create subscription err ',err)
      })
    },
    displayGrantedNotification() {
      let notification = {
        msg: 'You are subscribed to notification!',
        options: {
          body: 'Thanks for subscribing',
          icon: 'icons/icon-128x128.png',
          image: 'icons/icon-128x128.png',
          badge: 'icons/icon-128x128.png',
          dir: 'ltr',
          lang: 'en-US',
          vibrate: '[100, 50, 200]',
          tag: 'confirm-notification',
          renotify: true
        }
      }
      const actions = [
        {
          action: 'hello',
          title: 'Hello',
          icon: 'icons/icon-128x128.png'
        },
        {
          action: 'goodbye',
          title: 'Goodbye',
          icon: 'icons/icon-128x128.png'
        }
      ]
      registration.showNotification(notification.msg, { ...notification.options, actions })
    },
    // Convert the URL safe base64 string to a Uint8Array to pass into the subscribe call
    urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  }
}
</script>
