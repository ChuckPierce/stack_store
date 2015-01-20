'use strict';

angular.module('stackStoreApp')
  .factory('Order', function ($resource) {
    // Service logic
    // ...
    var currentCart = 1;

    var Order = $resource('/api/orders/:id/:controller', { id: '@_id' }, {
      capture: {
        method: 'PUT',
        params: {
          controller: 'capture'
        }
      },
      update: {
        method: 'PUT'
      }
    });

    Order.findCart = function(myCart) {
      currentCart = myCart;
      console.log("myCart equals:", myCart);
    }

    Order.getCart = function() {
      console.log('getting cart..', currentCart);
      return currentCart;
    };

    // Public API here
    return Order;
  });
