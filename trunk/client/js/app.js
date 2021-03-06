var app;

app = angular.module('App', ['ngResource']);


/**
 * application main router.
 * responsible for initializing the appropriate controller
 * & loading the necessary view/html fragment. 
 * @param {angular object} $routeProvider
 * @return {angular object} $locationProvider
 */
app.config(function( $routeProvider, $locationProvider ) {

	$routeProvider

		.when( '/', {
			controller : 'DisplayCtrl',
			templateUrl: 'partials/displayProducts.html'
		})

		.when( '/edit/:id', {
			controller : 'EditCtrl',
			templateUrl: 'partials/editProduct.html'
		})

		.when( '/add', {
			controller : 'AddCtrl',
			templateUrl: 'partials/addProduct.html'
		})

		.otherwise({redirectTo: '/'});
});



/**
 * angular service which maps all REST api end-points. 
 * @param {angular object} $resource
 */
app.factory('productsService', function( $resource ) {
	return $resource('api/products/:id', {id: '@id'}, {update: {method: 'PUT'}});
});



/**
 * Display controller - renders the products table, responsible of deletion as well.
 * @param {angular object} $scope
 * @param {angular object} productsService
 * @param {angular object} $rootScope
 */
app.controller('DisplayCtrl', function( $scope, productsService, $rootScope ) {

	function getAllProducts() {

		// check cached data.
		if ( !$rootScope.products ) {
			// make http request.
			$rootScope.products = $scope.products = productsService.query(); }
	}

	// delete product.
	$scope.destroy = function( productId, index ) {
		productsService.delete({ id: productId }, function( res ) {
			if (res && res.success) {
				$scope.products.splice( index, 1 );
			}
		});
	};

	$scope.init = function() {
		getAllProducts();
	};
});



/**
 * edit controller - renders the edit form. update server & memory.
 * @param {angular object} $scope
 * @param {angular object} $location
 * @param {angular object} $routeParams
 * @param {angular object} productsService
 */
app.controller('EditCtrl', function( $scope, $location, $routeParams, productsService ) {
	
	function getProductById() {
		var id;
		id = $routeParams.id;

		productsService.get({ id: id }, function( res ) {
			if ( res && res.success ) {
				$scope.product = res.data;	
			}
		});
	}

	$scope.update = function() {
		$scope.product.price = parseInt( $scope.product.price, 10 );
		if (isNaN( $scope.product.price ) ) {
			alert( 'Product Price must be a number!' );
			return;
		}

		productsService.update( $scope.product , function( res ) {
			if ( res && res.success ) {
				for ( var count=0; count<$scope.products.length; count++ ) {		
					var p = $scope.products[count];
					if ( $scope.product._id === p._id ) {
						$scope.products[count] = _.extend( p, $scope.product ); 
						break;
					}
				}
				$location.path('/');
			}	
		});
	};

	$scope.init = function() {
		getProductById();
	};
});



/**
 * add controller - renders the add form. update server & memory data.
 * @param {angular object} $scope
 * @param {angular object} $location
 * @param {angular object} $rootScope
 * @param {angular object} productsService
 */
app.controller('AddCtrl', function( $scope, $location, $rootScope, productsService ) {

	$scope.save = function() {

		// validation for mongoDB.
		$scope.product.price = parseInt( $scope.product.price, 10 );
		if ( isNaN( $scope.product.price ) ) {
			alert( 'Price must be a number!' );
			return;
		}

		productsService.save( $scope.product, function( res ) {
			if ( res && res.success ) {
				$rootScope.products.push( res.data );
				$location.path('/');
			}	
		});	
	};
});
