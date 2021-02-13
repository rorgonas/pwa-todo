<template>
  <q-page>
    <q-input
      v-model="newTask"
      placeholder="Add task"
      @keyup.enter="addTask"
      class="bg-cyan-8"
      dark
      filled
      square
    >
      <template v-slot:append>
        <q-btn
          @click="addTask"
          icon="add"
          round
          dense
          flat
        />
      </template>
    </q-input>

    <q-list
      bordered
      separator
    >
      <q-item
        v-for="task in tasks"
        :key="task.id"
        class="bg-cyan-1"
      >
        <q-item-section>
          <q-item-label v-if="task.editable">
            <q-input
              v-model="task.title"
              :placeholder="task.title"
              @keyup.enter="updateTask(task)"
              filled
              square
            />
          </q-item-label>
          <q-item-label v-else>
            {{ task.title }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="q-pa-md q-gutter-sm" v-if="task.editable">
            <q-btn @click="updateTask(task)" color="primary" icon="done" round dense flat />
            <q-btn @click="task.editable = false" color="primary" icon="cancel" round dense flat />
          </div>
          <div class="q-pa-md q-gutter-sm" v-else>
            <q-btn
              @click="task.editable = true"
              color="primary"
              icon="edit"
              round
              dense
              flat
            />
            <q-btn
              @click="removeTask(task.id)"
              color="primary"
              icon="delete"
              round
              dense
              flat
            />
          </div>
        </q-item-section>
      </q-item>

    </q-list>
  </q-page>
</template>

<script>
const qs = require('qs');
const uuid = require('short-uuid')

export default {
  name: 'PageTodo',
  data() {
    return {
      newTask: '',
      tasks: []
    }
  },
  created() {
    this.getTask()
  },
  methods: {
    getTask() {
      this.$q.loading.show()
      this.$axios.get(`${process.env.API}/tasks`)
        .then(response => {
          this.tasks = response.data
        })
        .catch((err) => {
          if (err.data) {
            this.$q.notify(err.data)
          }
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    },
    addTask() {
      if (this.newTask.length === 0) {
        return;
      }
      let newTask = {
        id: uuid.generate(),
        title: this.newTask,
        editable: false,
        timestamp: Date.now(),
      }
      this.$q.loading.show()
      this.$axios.post(`${process.env.API}/createTask?${qs.stringify(newTask)}`)
        .then((response) => {
          this.tasks.push(newTask)
          this.newTask = ''
          this.$q.notify(response.data)
        })
        .catch((err) => {
          if (!navigator.onLine) {
            this.$q.notify('Task created offline')
          } else if (err.data) {
            this.$q.notify(err.data)
          }
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    },
    removeTask(taskId) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Would you like to delete this task?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$axios.delete(`${process.env.API}/removeTask?id=${taskId}`)
          .then((response) => {
            this.tasks.pop({ id: taskId })
            this.$q.notify(response.data)
          })
          .catch((err) => {
            if (err.data) {
              this.$q.notify(err.data)
            }
          })
      })
    },
    updateTask(task) {
      if (task.title.length === 0) {
        this.toggleEditMode(task)
        return;
      }

      let newTask = {
        id: task.id,
        title: task.title,
        editable: false,
        timestamp: Date.now(),
      }
      this.$q.loading.show()
      this.$axios.put(`${process.env.API}/updateTask?${qs.stringify(newTask)}`)
        .then((response) => {
          this.toggleEditMode(task)
          this.$q.notify(response.data)
        })
        .catch((err) => {
          if (err.data) {
            this.$q.notify(err.data)
          }
        })
        .finally(() => {
          this.$q.loading.hide()
        })
    },
    toggleEditMode(task) {
      this.tasks.map(o => {
        if (o.id === task.id) {
          o.editable = false
        }
      });
    }
  }
}
</script>
