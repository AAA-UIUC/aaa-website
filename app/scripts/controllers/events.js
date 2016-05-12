'use strict';

/**
 * @ngdoc function
 * @name aaaApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the aaaApp
 */
angular.module('aaaApp')
  .controller('EventsCtrl', function ($http) {

    var self = this;
    var baseUrl = 'insert api url here';

    $http
      // .get('./data/events.json')
      .get(baseUrl + 'events')
      .success(function(data){
        for(var i = 0; i < data.length; i++) {
          data[i].displayDate = moment.unix(data[i].date).format('M/D');
          data[i].upcoming = data[i].date > (Date.now()/1000);
        }
        self.events = data;
      });

    $http
      .get('./data/annual_events.json')
      .success(function(data){
        self.annualEvents = data;
      });

    self.hasForm = function(event) {
      return !(event.form === "" || event.form === undefined);
    }

  });
