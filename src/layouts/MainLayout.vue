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
let deferredPrompt;

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
        debugger;
        Notification.requestPermission(result => {
          if (result === 'granted') {
            // Check if User has existent PushSubscription
            this.checkForExistingPushSubscription();
          }
        })
      }
    },
    checkForExistingPushSubscription() {
      if (this.serviceWorkerSupported && this.pushNotificationSupported) {
        let registration = null
        navigator.serviceWorker.ready
          .then(swreg => {
            registration = swreg
            return swreg.pushManager.getSubscription()
          })
          .then(sub => {
            if(!sub) {
              this.createPushSubscription(registration)
            }
          })
      }
    },
    createPushSubscription(registration) {
      // Need to secure push subscription by combining a user private & public key
      const vapidPublicKey  = 'BOfMjG9iNh32LTf9MAMlS_XEfxxq-UCIEjGUfjTXslo_1S4WRuL3i5_CHAvjB5O4LHQXXcSOYiUMDBXqMCJlrfQ'
      const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      }).then(newSub => {
        console.log('New subscription obj ',newSub.toJSON())
      }).catch(err => {
        console.log('Create subscription err ',err)
      })
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
