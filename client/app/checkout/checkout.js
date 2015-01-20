'use strict';

angular.module('stackStoreApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/checkout', {
        templateUrl: 'app/checkout/checkout.html',
        controller: 'CheckoutCtrl'
      })
      .when('/checkout/complete', {
        templateUrl: 'app/checkout/status/complete.html',
        controller: 'StatusCtrl'
      })
      .when('/checkout/rejected', {
        templateUrl: 'app/checkout/status/rejected.html',
        controller: 'StatusCtrl'
      });

  });
