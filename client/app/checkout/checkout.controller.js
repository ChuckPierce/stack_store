'use strict';

angular.module('stackStoreApp')
  .controller('CheckoutCtrl', function ($scope, Auth, Order, Cart, User, Product, $location) {

    Stripe.setPublishableKey('pk_test_dA3Hb0dLKm0zVFQQ1DosksSf');
    
    $scope.errorMessage;
      $scope.user = Auth.getCurrentUser();
        $scope.user.$promise.then(function(user) {
          Cart.getCart(function() {
              getData();
              $scope.order.userId = user._id;
              Cart.addListener(function() {
                getData();
                $scope.order.userId = user._id;
              });
          });
      });

  	$scope.checkout = function() {
  		if((/^\d{5}(?:[-\s]\d{4})?$/).test($scope.order.shipping.zip)) {
        Stripe.card.createToken($scope.ccinfo, stripeResponseHandler);
  			return true;
  		} else {
  			return false;
  		}
  	};

function stripeResponseHandler(status, response) {
  if (response.error) {
    // show the errors on the form
    $scope.errorMessage = response.error.message;
    $scope.$apply();
  } else {
    // token contains id, last4, and card type
    $scope.order.billing.stripeToken = response['id'];
    $scope.order.billing.cardType = response['card']['brand'];
    $scope.order.billing.last4 = response['card']['last4'];
    angular.forEach($scope.order.lineItems, function(lineItem) {
      lineItem.productId = lineItem.item._id;
      lineItem.productName = lineItem.item.name;
      lineItem.price = lineItem.item.price;
      Product.updateQuantity(lineItem);
    });
    Order.save($scope.order, function(order) {
      console.log(order);
      if($scope.user) {
        $scope.user.orders.push(order._id);
        delete $scope.user.__v;
        User.update($scope.user);
      }
      $scope.cart.clearCart();
      $location.path('/checkout/complete');
    });
  }
}

function getData() {
  $scope.cart = Cart.currentCart;
  $scope.populatedCart = Cart.populatedCart;
  $scope.order = {lineItems: $scope.populatedCart.lineItems};
  $scope.order.total = $scope.cart.calculateTotal();
}

});