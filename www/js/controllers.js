angular.module('starter.controllers', [])

.controller('AppController', function($scope, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
//  $scope.$on('$ionicView.beforeEnter', function () {
//    $scope.doRefresh();
//  });
	
  $scope.logout = function() {
	  $state.go("login");
  }

})

.controller('LoginController', function($scope, $rootScope, $state, $timeout, $ionicLoading, $ionicHistory, $http) {
  
  $scope.doLogin = function(form, model) {
    $ionicLoading.show();
    var data = {
    	"merchant_id": model.merchantId,
    	"password": model.password,
    }
    $http.post(url + 'login.php', data, {}).then(
	function(response) {
		var data = response.data;
		if (data.status == "200") {
			$rootScope.merchantId = data.data.id;
    		$state.go("app.home");
		} else {
			alert(data.errMsg);
		}
		$ionicLoading.hide();
	}, function(response) {
		alert("ERROR");
		$ionicLoading.hide();
	});
  }
})

.controller('HomeController', function($scope, $rootScope, $ionicLoading, $http) {
  $scope.datas = [];
  $scope.init = function () {
    $ionicLoading.show();
    var data = {
    	"merchant_id": $rootScope.merchantId,
    }
    $http.post(url + 'fetchmerchantproducts.php', data, {}).then(
	function(response) {
		var data = response.data;
		console.log(JSON.stringify(data));
		if (data.status == "200") {
			for (var i = 0; i < data.data.length; i++) {
				$scope.datas.push({
					id: data.data[i].id,
					merchant_id: data.data[i].merchant_id,
					img_url: data.data[i].img_url,
					name: data.data[i].name,
					description: data.data[i].description,
					price: data.data[i].price,
					created_time: data.data[i].created_time
				});
			}
			$ionicLoading.hide();
		} else {
			alert(data.errMsg);
			$ionicLoading.hide();
		}
	}, function(response) {
		alert("ERROR");
		$ionicLoading.hide();
	});
  }
  
  
})

.controller('AddProductController', function($scope, $state, $rootScope, $timeout, $ionicHistory, $ionicLoading, $cordovaCamera, $http) {
  $scope.categories = [];
  $scope.init = function () {
    $ionicLoading.show();
    var data = {}
    $http.post(url + 'fetchcategories.php', data, {}).then(
	function(response) {
		var data = response.data;
		console.log(JSON.stringify(data));
		if (data.status == "200") {
			for (var i = 0; i < data.data.length; i++) {
				$scope.categories.push({
					id: data.data[i].id,
					code: data.data[i].code,
					name: data.data[i].name,
					parent_category_id: data.data[i].parent_category_id,
				});
			}
			$ionicLoading.hide();
		} else {
			alert(data.errMsg);
			$ionicLoading.hide();
		}
	}, function(response) {
		alert("ERROR");
		$ionicLoading.hide();
	});
  }
  $scope.addProduct = function(form, model) {
	$ionicLoading.show();
	var imageSrc = document.getElementById('dp').src;
	console.log("Edit Profile: " + JSON.stringify(model));
	console.log("imageSrc: " + imageSrc);
	var isBase64 = false;
	
	var srcToCheck = imageSrc.split(",");
	if (typeof srcToCheck[1] != undefined) {
		var patt = new RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$');
	    var res = patt.test(srcToCheck[1]);
	    isBase64 = res;
	}
	
	if (isBase64 == false) {
		alert("Please take a picture");
		$ionicLoading.hide();
		return;
	}
	
	$ionicLoading.show();
    var data = {
    	merchant_id: $rootScope.merchantId,
		product_name: model.productName,
		product_description: model.productDesc,
		product_price: model.price,
		category_id: model.category,
		image_base64: imageSrc
    }
    $http.post(url + 'addnewproduct.php', data, {}).then(
	function(response) {
		var data = response.data;
		if (data.status == "200") {
			$ionicHistory.nextViewOptions({disableBack: true});
			$state.go("app.home");
			alert("Add product succeded");
		} else {
			alert(data.errMsg);
		}
		$ionicLoading.hide();
	}, function(response) {
		alert("ERROR");
		$ionicLoading.hide();
	});
  }
  
  
  $scope.takePicture = function() {
	  document.addEventListener("deviceready", function () {

	    var options = {
	      quality: 50,
	      destinationType: Camera.DestinationType.DATA_URL,
	      sourceType: Camera.PictureSourceType.CAMERA,
	      allowEdit: true,
	      encodingType: Camera.EncodingType.JPEG,
//	      targetWidth: 100,
//	      targetHeight: 100,
	      popoverOptions: CameraPopoverOptions,
	      saveToPhotoAlbum: false,
		  correctOrientation:true
	    };

	    $cordovaCamera.getPicture(options).then(function(imageData) {
	      var image = document.getElementById('dp');
	      image.src = "data:image/jpeg;base64," + imageData;
	    }, function(err) {
	      // error
	    });

	  }, false);
  }
})

.controller('EditProfileController', function($scope, $rootScope, $state, $timeout, $ionicHistory, $ionicLoading, $cordovaCamera, $http) {
  $scope.model = {};
  $scope.init = function () {
    $ionicLoading.show();
    var data = {
    	"merchant_id": $rootScope.merchantId,
    }
    $http.post(url + 'fetchmerchantdetail.php', data, {}).then(
	function(response) {
		var data = response.data;
		console.log(JSON.stringify(data));
		if (data.status == "200") {
			$scope.model = {
				storeName: data.data.merchant_name,
				location: data.data.address,
				openHour: data.data.open_hour,
				closeHour: data.data.close_hour,
				phoneNumber: data.data.phone
			}
			$scope.imgUrl = data.data.img_url;
		} else {
			alert(data.errMsg);
		}
		$ionicLoading.hide();
	}, function(response) {
		alert("ERROR");
		$ionicLoading.hide();
	});
  }
  
  $scope.editProfile = function(form, model) {
	$ionicLoading.show();
	var imageSrc = document.getElementById('dp').src;
	console.log("Edit Profile: " + JSON.stringify(model));
	console.log("imageSrc: " + imageSrc);
	
	$ionicLoading.show();
    var data = {
    	merchant_id: $rootScope.merchantId,
		address: model.location,
		open_hour: model.openHour,
		close_hour: model.closeHour,
		phone: model.phoneNumber,
		image_base64: imageSrc
    }
    $http.post(url + 'updatemerchant.php', data, {}).then(
	function(response) {
		var data = response.data;
		if (data.status == "200") {
			$ionicHistory.nextViewOptions({disableBack: true});
			$state.go("app.home");
			alert("Update merchant succeded");
		} else {
			alert(data.errMsg);
		}
		$ionicLoading.hide();
	}, function(response) {
		alert("ERROR");
		$ionicLoading.hide();
	});
  }
  
  $scope.takePicture = function() {
	  document.addEventListener("deviceready", function () {

	    var options = {
	      quality: 50,
	      destinationType: Camera.DestinationType.DATA_URL,
	      sourceType: Camera.PictureSourceType.CAMERA,
	      allowEdit: true,
	      encodingType: Camera.EncodingType.JPEG,
//	      targetWidth: 100,
//	      targetHeight: 100,
	      popoverOptions: CameraPopoverOptions,
	      saveToPhotoAlbum: false,
		  correctOrientation: true
	    };

	    $cordovaCamera.getPicture(options).then(function(imageData) {
	      var image = document.getElementById('dp');
	      image.src = "data:image/jpeg;base64," + imageData;
	    }, function(err) {
	      // error
	    });

	  }, false);
  }
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
