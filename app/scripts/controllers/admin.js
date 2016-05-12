'use strict';

/**
 * @ngdoc function
 * @name aaaApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the aaaApp
 */
angular.module('aaaApp')
  .controller('AdminCtrl', function ($http, $location, $scope, $window, Auth) {
    var self = this;
    var baseUrl = 'insert api url here';

    if(!Auth.isLoggedIn()) {
      $location.path('/login');
    }

    $scope.$on('$viewContentLoaded', function() {
      self.loadAllEvents();
    });

    self.loadAllEvents = function() {
      $http
        .get(baseUrl + 'events')
        .success(function(data){
          for(var i = 0; i < data.length; i++) {
            data[i].displayDate = moment.unix(data[i].date).format('M/D');
            data[i].upcoming = data[i].date > (Date.now()/1000);
          }
          self.events = data;
        });
    }

    $http
      .get('./data/annual_events.json')
      .success(function(data){
        self.annualEvents = data;
      });

    self.hasForm = function(event) {
      return !(event.form === "" || event.form === undefined);
    }

    self.deleteEvent = function(eventId) {
      $http
        .delete(baseUrl + 'events/' + eventId)
        .success(function(){
          self.loadAllEvents();
        });
    }

    self.logout = function(){
      $window.localStorage.removeItem('cloudinaryApiKey');
      $window.localStorage.removeItem('cloudinaryApiSecret');
      Auth.logout();
      $location.path('/login');
    }

  });
