'use strict';

/**
 * @ngdoc function
 * @name aaaApp.controller:EditeventCtrl
 * @description
 * # EditeventCtrl
 * Controller of the aaaApp
 */
angular.module('aaaApp')
  .controller('EditeventCtrl', function ($http, $scope, $routeParams, $location) {

    var self = this;
    self.eventId = $routeParams.id;
    var baseUrl = 'insert api url here';
    self.formData = {};

    $http
      .get(baseUrl + 'events/' + self.eventId)
      .success(function(data){
        self.formData.name = data.name;
        self.formData.link = data.link;
        self.formData.date = data.date;
        self.formData.form = data.form;
        self.formData.image = data.image;
        self.displayDate = moment.unix(data.date).format('M/D');
      });

    self.editEvent = function(formData) {
      $http
        .put(baseUrl + 'events/' + self.eventId, {
          name: formData.name,
          date: formData.date,
          image: formData.image,
          link: formData.link,
          form: formData.form,
          upcoming: formData.upcoming
        })
        .success(function(data){
          $location.path('/admin');
        });
    }

    self.hasForm = function(event) {
      return !(event.form === "" || event.form === undefined);
    }

    $scope.fileNameChanged = function(el) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var url = 'insert-cloudinary-url-here';
        var timestamp = new Date().getTime();
        var secret = 'insert-cloudinary-secret-here';
        var payload = {
          file: e.target.result,
          api_key: 'insert-cloudinary-api-key',
          timestamp: timestamp,
          signature: CryptoJS.SHA1('format=png&timestamp=' + timestamp + secret).toString(CryptoJS.enc.Hex),
          resource_type: 'image',
          format: 'png'
        };
        $http.post(url, payload).success(function(data) {
          self.formData.image = data.url;
        });
      }
      for (var iter = 0; iter < el.files.length ; iter ++ ) {
        reader.readAsDataURL(el.files[0]);
      }
    }

    $('#upfile1').on('click', function() {
      $('#fileUpload').trigger('click');
    });

    var picker = new Pikaday({
        field: document.getElementById('datepicker'),
        format: 'MMMM Do YYYY',
        onSelect: function() {
          // set date for 11:59 pm that day
          self.formData.date = this.getMoment().unix() + 86399;
          self.displayDate = moment.unix(self.formData.date).format('M/D');
          $scope.$apply();
        }
    });
  });
