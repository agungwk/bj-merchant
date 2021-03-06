// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers'])

.run(function($ionicPlatform, $ionicLoading, $rootScope, $cordovaPushV5, $http, $location) {
  $rootScope.isLogin = false;
  $rootScope.merchantId = null;
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    FCMPlugin.getToken(
      function(token){
//        alert(token);
        console.log('token: ' + token);
		$rootScope.deviceToken = token;
      },
      function(err){
        console.log('error retrieving token: ' + err);
      }
    )
    
    FCMPlugin.onNotification(
	  function(data){
	    if(data.wasTapped){
	      //Notification was received on device tray and tapped by the user. 
	      alert( JSON.stringify(data) );
	    }else{
	      //Notification was received in foreground. Maybe the user needs to be notified. 
	      alert( JSON.stringify(data) );
	    }
	  },
	  function(msg){
	    console.log('onNotification callback successfully registered: ' + msg);
	  },
	  function(err){
	    console.log('Error registering onNotification callback: ' + err);
	  }
	);
  });
  
  $rootScope.$on('$locationChangeStart', function (event, next, current) {
	// redirect to login page if not logged in
	if ($location.path() !== '/login' && $rootScope.isLogin !== true) {
		$rootScope.isLogin = false;
		$location.path('/login');
	}
  });

  // var options = {
  // 	android: {
  // 	  senderID: "12345679"
  // 	},
  //   ios: {
  //     alert: "true",
  //     badge: "true",
  //     sound: "true"
  //   },
  //   windows: {}
  // };
  //
  // // initialize
  // $cordovaPushV5.initialize(options).then(function() {
  //   // start listening for new notifications
  //   $cordovaPushV5.onNotification();
  //   // start listening for errors
  //   $cordovaPushV5.onError();
  //
  //   // register to get registrationId
  //   $cordovaPushV5.register().then(function(registrationId) {
  //     // save `registrationId` somewhere;
  //   })
  // });
  //
  // // triggered every time notification received
  // $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data){
  //   // data.message,
  //   // data.title,
  //   // data.count,
  //   // data.sound,
  //   // data.image,
  //   // data.additionalData
  // });
  //
  // // triggered every time error occurs
  // $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e){
  //   // e.message
  // });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppController'
  })
  .state('prelogin', {
    url: '/prelogin',
    abstract: true,
    templateUrl: 'templates/prelogin-menu.html',
    controller: 'PreloginController'
  })
  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'templates/login.html',
    controller: 'LoginController'
  })
  .state('prelogin.registration', {
    url: '/registration',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/registration.html',
        controller: 'RegistrationController'
      }
    },
    params: {
      data: {}
    }
  })
  .state('app.home', {
    url: '/home',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
      }
    }
  })
  .state('app.addProduct', {
    url: '/addProduct',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/add-product.html',
        controller: 'AddProductController'
      }
    }
  })
  .state('app.editProfile', {
    url: '/editProfile',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/edit-profile.html',
        controller: 'EditProfileController'
      }
    },
    params: {
      data: {}
    }
  })
  .state('maps', {
    url: '/maps',
    cache: false,
    templateUrl: 'templates/maps.html',
    controller: 'MapsController',
    params: {
      data: {}
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
