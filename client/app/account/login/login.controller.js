'use strict';

angular.module('stackStoreApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, Cart) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          Auth.getCurrentUser().$promise.then(function(user){
            Cart.mergeCarts(user._id);
            $location.path('/');
          });
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
