'use strict';

/**
 * @ngdoc function
 * @name aaaApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the aaaApp
 */
angular.module('aaaApp')
  .controller('LoginCtrl', function ($http, $window, $location, $rootScope, Auth) {
    var self = this;
    var baseUrl = 'insert api url here';

    // get info if a person is logged in
    self.loggedIn = Auth.isLoggedIn();

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function() {
      self.loggedIn = Auth.isLoggedIn();

      // get user information on page load
      Auth.getUser()
        .then(function(data) {
          self.user = data.data;
        });
    });

    // function to handle login form
    self.doLogin = function() {
      self.processing = true;

      // clear the error
      self.error = '';

      Auth.login(self.loginData.username, self.loginData.password)
        .success(function(data) {
          self.processing = false;

          // if a user successfully logs in, redirect to users page
          if (data.success) {
            $window.localStorage.setItem('cloudinaryApiKey', data.cloudinary_api_key);
            $window.localStorage.setItem('cloudinaryApiSecret', data.cloudinary_api_secret);
            $location.path('/admin');
          }
          else
            self.error = data.message;

        });
    };

    // function to handle logging out
    self.doLogout = function() {
      $window.localStorage.removeItem('cloudinaryApiKey');
      $window.localStorage.removeItem('cloudinaryApiSecret');
      Auth.logout();
      self.user = '';

      $location.path('/login');
    };


  });
