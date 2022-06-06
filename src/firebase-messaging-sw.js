importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js');
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics. 
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-analytics.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

//Collabtic FireBase Project
var config = {
	apiKey: "AIzaSyA-kcHbwnUCwZDbYjOoNoLMM9WjjU0WVl4",
	authDomain: "collabtic-app.firebaseapp.com",
	databaseURL: "https://collabtic-app.firebaseio.com",
	projectId: "collabtic-app",
	storageBucket: "collabtic-app.appspot.com",
	messagingSenderId: "550936066065",
	appId: "1:550936066065:web:501f01e0b60fa738bb59b0"
};

//MAHLE firebase config
/*var config = {
   apiKey: "AIzaSyCoAJgO0p3Q0Bj5ke0MHkH6BRGn_ijC_WI",
   authDomain: "mahle-17089.firebaseapp.com",
   databaseURL: "https://mahle-17089.firebaseio.com",
   projectId: "mahle-17089",
   storageBucket: "mahle-17089.appspot.com",
   messagingSenderId: "438537718573",
   appId: "1:438537718573:web:f962e63fd562feb8fe61a4"
};*/

firebase.initializeApp(config);

//var database = firebase.database();

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

console.log(11111);
/*
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/itwonders-web-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});
*/
