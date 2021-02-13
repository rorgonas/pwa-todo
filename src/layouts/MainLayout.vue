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
export default {
  name: 'MainLayout',

  data () {
    return {

    }
  }
}
</script>
