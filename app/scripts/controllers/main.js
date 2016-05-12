'use strict';

/**
 * @ngdoc function
 * @name aaaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aaaApp
 */
angular.module('aaaApp')
  .controller('MainCtrl', function ($location) {
    var self = this;

    self.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  });
