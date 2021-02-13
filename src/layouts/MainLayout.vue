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
      showInstallAppButton: false
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
    }
  }
}
</script>
