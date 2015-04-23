'use strict';

angular.module('stackStoreApp')
  .controller('ProductViewCtrl', function ($scope, Product, Auth, Order, Review, User, $routeParams, Cart, $sce, $http) {
    $scope.cart;
    // why?  whyyyyyyyyyyyyyyyy
  	$scope.user = Auth.getCurrentUser();
    if ($scope.user.$promise) {
        $scope.user.$promise.then(function(user) {
            $scope.user = user;
            console.log($scope.user);
            $scope.newReview.userId = user._id;
        });
    }
    $scope.recommendations = [];
  	$scope.quantity = 1;
    $scope.isAdmin = Auth.isAdmin;
    $scope.reviews = [];
    $scope.bought = false; // not implemented yet bc orders, man
    $scope.reviewSubmitted = false;
  	
    Product.get({id: $routeParams.id}, function(product) {
        $scope.product = product;
        $http.post('http://localhost:3000/'+product._id)
          .then(function(res){
            var ids = res.data;
            angular.forEach(ids, function(id) {
              Product.get({id: id}).$promise.then(function(prod){
                $scope.recommendations.push(prod);
              })
            });
          })
    // this doesn't do anything yet bc orders, man
    //     $scope.user.orders.forEach(function(order) {
    //         order.lineItems.forEach(function(lineItem) {
    //             if(lineItem.productId == $routeParams.id) {
    //                 $scope.bought = true;
    //             }
    //         });
    //     });
    });

    // ugh this is terrible why am i even
    Review.query().$promise.then(function(reviews) {
        reviews.forEach(function(review) {
            if(review.productId === $routeParams.id) {
                $scope.reviews.push(review);
            }
        });
    });

    $scope.maxStars = [1,2,3,4,5];

    // this is so hacky omg i'm so sorry
    $scope.starClasses = ["","","","",""];
    $scope.setStars = function(num) {
        $scope.newReview.stars = num;
        for (var i = 0; i < num; i++) {
            $scope.starClasses[i] = "star-color";
        }
        for (var i = num; i < 5; i++) {
            $scope.starClasses[i] = "";
        }
    }

      $scope.newReview = {
        userId: $scope.user._id,
        productId: $routeParams.id,
        stars: 0,
        date: new Date(),
        body: ""
    }

    $scope.postReview = function() {
        Review.save($scope.newReview, function(savedReview) {
            $scope.user.reviews.push(savedReview._id);
            User.update($scope.user);
            $scope.reviews.push(savedReview);
            $scope.reviewSubmitted = true;
        });
    }

    Cart.getCart(function() {
      $scope.cart = Cart.currentCart;
      Cart.addListener(function() {
        $scope.cart = Cart.currentCart;
      });
    });


    $scope.addToCart = function(productId, quantity) {
      var alertMessages = ["Only <strong>" + $scope.product.quantity + " minute(s)</strong> of <strong>" + $scope.product.name + "</strong> in stock. Any available minutes have been added to your cart.",
                           "Only <strong>" + $scope.product.quantity + " minute(s)</strong> of <strong>" + $scope.product.name + "</strong> in stock. Cart is at maximum capacity.",
                           "You just added <strong>" + quantity + " minute(s)</strong> of <strong>" + $scope.product.name + "</strong> to your cart!"];

      $scope.cart.addToCart(productId, quantity);
      Cart.addListener(function() {
        console.log(Cart.messageIndex);
        $scope.message = $sce.trustAsHtml(alertMessages[Cart.messageIndex]);
        if (Cart.messageIndex < 2) {
          $scope.successBanner = false;
          $scope.warningBanner = true;
        } else if (Cart.messageIndex === 2) {
          $scope.warningBanner = false;
          $scope.successBanner = true;
        }
      });
      setTimeout(function() {
        $scope.$apply(function() {
          $scope.successBanner = false;
          $scope.warningBanner = false;
          $scope.quantity = 1;
        })
      }, 3000);
    }
  });
