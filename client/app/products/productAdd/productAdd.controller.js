'use strict';

angular.module('stackStoreApp')
  .controller('ProductAddCtrl', function ($scope, Product, Category, Auth) {
    $scope.isAdmin = Auth.isAdmin;

    $scope.newProduct = {
    	categories: [],
        images: []
    }
    $scope.newCat = {
        name: ""
    }

    $scope.addedSuccess = false;

    $scope.categories = Category.query();
    console.log($scope.categories);

    //FilePicker*******************************************************************
    filepicker.setKey("ABXzKGxApRcCcK8K59thqz");

    filepicker.makeDropPane($('#filePickerDropPane')[0], {
      multiple: true,
      dragEnter: function() {
        $("#filePickerDropPane").html("Drop to upload").css({
          'backgroundColor': "#E0E0E0",
          'border': "1px solid #000"
        });
      },
      dragLeave: function() {
        $("#filePickerDropPane").html("Drop files here").css({
          'backgroundColor': "#F6F6F6",
          'border': "1px dashed #666"
        });
      },
      onSuccess: function(Blobs) {
        $("#filePickerDropPane").text("Done, see result below");
        $("#localDropResult").text(JSON.stringify(Blobs));

        $scope.newProduct.images.push(Blobs[0].url);
        $scope.$apply();

      },
      onError: function(type, message) {
        $("#localDropResult").text('('+type+') '+ message);
      },
      onProgress: function(percentage) {
        $("#exampleDropPane").text("Uploading ("+percentage+"%)");
      }
    });
    //EndFilePickerStuff*******************************************************


    $scope.addCategory = function() {
        var newCat = new Category({name: $scope.newCat.name});
        newCat.$save(function(cat) {
            if (cat.$promise) console.log("!!");
            console.log(cat);
            $scope.categories.push({name: cat.name, _id: cat._id});
        })
        $scope.newCat.name = "";
    }

    $scope.addProduct = function(){
        var num = $scope.newProduct.price
        $scope.newProduct.price = Math.round(num * 100)/100;
    	Product.save($scope.newProduct);
    	$scope.addedSuccess = true;

    	$scope.addProductForm.$setPristine();
    	$scope.newProduct = {
    		name: "",
    		categories: [],
    		images: [],
    		description: {},
    		price: null
    	}
    }

    $scope.toggleCat = function(cat) {
    	var indexCat = $scope.newProduct.categories.indexOf(cat);
    	if(indexCat > -1){
    		$scope.newProduct.categories.splice(indexCat,1);
    	}
    	else{
    		$scope.newProduct.categories.push(cat._id);
    	}
    }
  });
