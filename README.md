# Assignment 1 - Database & Backend

![Screen Shot 2021-10-04 at 9 57 56 AM](https://user-images.githubusercontent.com/1928898/135864575-3b0ac958-f7be-4d87-9999-3c80a5a4d6bf.png)


## Task 1 - Get the Project Running <input type="checkbox">
- Get the project running:
```
npm install
```
```
quasar dev
```

## Task 2 - Create a Firebase Project <input type="checkbox">

- Create a new Firebase project called "PWA Todo 1"

## Task 3 - Create a Cloud Firestore Database <input type="checkbox">

- Create a Cloud Firestore database (make sure you start in test mode)
- Add a collection named "tasks"
- Add some dummy tasks data.
- Each task should have the fields "id" and "title"
- You can add timestamp dates for the id's by running Date.now() in Chrome's console

## Task 4 - Setup a Node.js & Express Backend <input type="checkbox">

- Create a subfolder for your backend and initalise with `npm init`
- Install Express and Nodemon
- Create an Express app with a simple **GET** endpoint that returns a string
- Launch the app and make sure the endpoint works in the browser
- **NOTE:** If you prefer, you can use Cloud Functions instead

## Task 5 - Initialize Firestore Database <input type="checkbox">

- On the Firebase website, on the Project Overview page, add a new web app.
- Once created, click on **1 App** > **Cog icon** > **Service accounts**.
- Generate a new private key, store it in your backend folder and integrate the provided code for initializing our app in index.js.
- After the app intialization code, get access to the database with:
```
let db = admin.firestore()
```

## Task 6 - Tasks Endpoint <input type="checkbox">

- Create an endpoint named "tasks" which grabs all of our tasks and returns them in an array.
- Tasks should be ordered by **id** (ascending)
- Ensure it's working by loading the endpoint in a new browser tab

## Task 7 - Display Tasks in App <input type="checkbox">

- On **PageTodo.vue**, Create a method named **getTasks** which gets all of the tasks from our endpoint and places them in our "tasks" array on our page.
- The getTasks method should be triggered when the page is loaded.
- The tasks array should be empty initially

## Task 8 - Create Task Endpoint (1) <input type="checkbox">

- Create an endpoint named **createTask** using the following code:
```
app.get('/createTask', (request,response) => {
   response.set('Access-Control-Allow-Origin', '*');
   response.send(request.query)
});
```
- Use your browser to load the endpoint with the following query string, replacing the id with your current date timestamp:
```
  http://localhost:3000/createTask?id=1593503990240&title=Shower
```
- Note that you can see the query string data returned as an object (from the request.query object).
- Note that the id is returned as a string, make this return as an integer

## Task 9 - Create Task Endpoint (2) <input type="checkbox">

- Adjust the createTask endpoint, so that it creates a new task (by calling the "add" method on the tasks collection) when we hit it in the browser with a query string like the one above.
- Ensure it's working by hitting the endpoint URL (and query string) in your browser and then refreshing our app to see if the new task was added.
- **NOTE:** We don't need busboy for this as we're not using form data or files

## Task 10 - Create Task Endpoint (3) <input type="checkbox">

- Change the **createTask** endpoint from a **get** endpoint to a **post** endpoint
- PageTodo.vue: In the **addTask** method, send the new task data to our **createTask** endpoint.
- This data should be sent as a query string using the qs library and the stringify method: https://github.com/ljharb/qs
- **Note:** You don't need to install the qs library, it comes with Node by default
- Only once the task has been added to our database should the task be added to our local tasks array.

## Task 11 - Add a Loading Screen <input type="checkbox">

- Use Quasar's loading plugin to display a loading screen when we're getting the tasks and when creating a new task


# Assignment 2 - Progressive Web Apps

  **NOTE:** you may need to clear application data on Chrome at many steps of the way (including **Unregister service worker**) to see most changes. You may also need to reload the app twice to ensure the new service worker has been activated.

## Task 1 - Get the App Running <input type="checkbox">

- Create a new project using the Firebase Console named **PWA Todo 2** (disable Google Analytics)
- On the Project Overview page, click on the Web icon below **Get started by adding Firebase to your app**
- Name the app **PWA Todo 2** and click **Register app**
- Click **Continue to console**
- Click on **1 app** > **Settings cog icon** > **Service accounts**
- You may need to click **Create service account**
- Copy the `databaseURL` from the code sample and paste it into `backend/index.js` in your project (line 22)
  e.g. "https://pwa-todo-2-etr345.firebaseio.com"
- Save **index.js**
- On Firebase Console - Click **Generate new private key** > **Generate key**
- Save the json file to your `backend` folder and rename it to **serviceAccountKey.json**
- On Firebase Console - Click **Database** > **Create database** > **Start in test mode** > **Choose a location** > Click **Done**
- Install dependencies for both app and server
```
npm install
```
```
cd backend
npm install
```

- Launch the backend server:
```
cd backend
npm start
```
- Launch the app in PWA mode and ensure it's working:
```
quasar dev -m pwa
```
- **Note:** If the app is not working, you might need to clear all application data in Chrome (including the service worker). **Dev tools** > **Application tab** > Ensure **Unregister service workers** is ticked > click **Clear site data** and reload
- **Note:** You may also need to restart the backend server
- Ensure you can add tasks and reload the app and still see the tasks. You may get some intial cross-domain errors, but these should stop after a while.



## Task 2 - Change Theme Color <input type="checkbox">
- Ensure that when the app is installed (by clicking on the + icon in the Chrome address bar) the top bar of the app window is the same color as our primary color `#00bcd4` by setting the app's theme color

## Task 3 - Generate App Icons <input type="checkbox">
- Add icons for all devices, based on the file `app-icon.png` in the root of our project - using IconGenie.
- Ensure you can see the icon on the Chrome tab - you might need to clear data & reload a couple of times

## Task 4 - Install App Button (1) <input type="checkbox">
- Only show the **Install App** button (in the footer) when the browser is capable and ready to install the app.
- The button is in `layouts/MainLayout.vue`

## Task 5 - Install App Button (2) <input type="checkbox">
- Allow the user to install the app when they click the **Install App** button

## Task 6 - Enable Precache <input type="checkbox">
- Make sure the service worker is using the **InjectManifest** mode, so that we can use a custom service worker (`src-pwa/custom-service-worker.js`)
- Enable Precaching so that our app shell is cached when we first hit the app - It's hard to find the code for this anywhere, so here it is:
```javascript
import {precacheAndRoute} from 'workbox-precaching'
precacheAndRoute(self.__WB_MANIFEST)
```

## Task 7 - Caching Strategies <input type="checkbox">
- Setup a **NetworkFirst** strategy for requests to our **tasks** endpoint.
- Verify these are working in the Chrome console.
- You can use the code from the Workbox Strategies page: https://developers.google.com/web/tools/workbox/modules/workbox-strategies#network_first_network_falling_back_to_cache
- You may need to Clear Site Data, Close & Reload Chrome to see the NetworkFirst log from Workbox

## Task 8 - Background Sync (1) <input type="checkbox">
- Setup a background sync queue for requests to our **createTask** endpoint. You can use the code on this page under **Advanced usage** > **Adding a request to the Queue**:
https://developers.google.com/web/tools/workbox/modules/workbox-background-sync
- **Note:** you can detect for background sync support first if you like, by seeing if `'sync'` is in the `self.registration` object

## Task 9 - Background Sync (2) <input type="checkbox">
- Disable your internet and kill the backend server
- Ensure that when a task is created offline, you can see task being added to the queue in the IndexedDB using Chrome Dev Tools Application tab.
- **Note:** Don't worry about the loading screen for now
- Restart the backend server & reenable your internet
- In the console, ensure that the offline tasks are uploaded when internet connection is resumed (you should see a "successfully replayed" message in the console and should see the request removed from the IndexedDB queue).
- Also make sure the task was properly uploaded by reloading the app.
- **Note:** don't worry about displaying the offline tasks within the app like we did with Quasagram

## Task 10 - Background Sync (3) <input type="checkbox">
- **PageTodo.vue** - add a catch block to our **createTask** axios request.
- If there is an error & the user is offline, display a notification saying "Task created offline".
- Also hide the loading overlay
- Test by killing backend server, disabling internet, creating a task, restarting backend server, enabling internet

## Task 11 - Push Notifications - Notification Permission (1) <input type="checkbox">
- Only display the **Enable Notifications** button if the user's browser supports Push Notifications

## Task 12 - Push Notifications - Notification Permission (2) <input type="checkbox">
- When the user clicks **Enable Notifications**, prompt the user for notifications permission
- **Note:** you might need to change the notification settings using the little **i** icon in the Chrome address bar

## Task 13 - Push Notifications - Create Push Subscription (1) <input type="checkbox">
- If the user gives Notifications permission, check if the user has an existing push subscription

## Task 14 - Push Notifications - Create Push Subscription (2) <input type="checkbox">
- If the user doesn't have a push subscription, create one and log the new subscription object to the console
- **NOTE:** you'll need to install the `web-push` library, add a script to your backend/package.json file and use it to generate some vapid keys and you'll need this method to convert your public key: https://gist.github.com/Klerith/80abd742d726dd587f4bd5d6a0ab26b6

## Task 15 - Push Notifications - Store Push Subscription in Database <input type="checkbox">
- Once the subscription is created, convert the new subscription object to a query string and then send the data to a new endpoint that stores the subscription in the Cloud Firestore database in a **subscriptions** collection
- **Note:** you will need to call `JSON.stringify`, `JSON.parse` and `qs.stringify` to get the new subscription data into a querystring that we can send to the endpoint
- **IMPORTANT:** from this point on, whenever you Clear Data (with Unregister your Service worker checked) it will render your browser's push subscription useless. Instead to reload your service worker, you can reload, close tab & open a new tab

## Task 16 - “You’re subscribed!” Notification <input type="checkbox">
- When the subscription has been saved in the database, display a notification using the service worker saying **"You're subscribed!"**

## Task 17 - Send Push Notification from Backend <input type="checkbox">
- Backend - when a new task is added, send out a push notification to all subscribed users that a new task was added.
- Check the push notification was received using **Chrome** > **Application** > **Push Messaging**

## Task 18 - Display Push Notification <input type="checkbox">
- Listen for the push notification in your service worker (`custom-service-worker.js`) and display a notification saying **"New task added!"**

## Task 19 - Handle Push Notification Click <input type="checkbox">
- When the user clicks the notification, they should be brought back to our app's home page (even if the app is closed)

## Task 20 - Host App on Firebase & Backend on Heroku <input type="checkbox">
- Setup an environment variable for easily switching the API URL from dev to live
- Host your Backend on Heroku and hook it up to the app
- Build the app for production and host it on Firebase
- Ensure the app is working on desktop and mobile browsers
