'use strict';

angular.module('stackStoreApp')
  .factory('Product', function ($http, $location, $resource) {
    var Product = $resource('/api/products/:id', { id: '@_id'}, {
      update: {
        method: 'PUT'
      },
      search : {
        url: '/api/products/search/:query',
        isArray: true,
        method: 'GET'
      },
      updateQuantity : {
        url: '/api/products/qty/:id',
        method: 'PUT'
      }
    });

    return Product;

  });