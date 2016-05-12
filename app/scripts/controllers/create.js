'use strict';

/**
 * @ngdoc function
 * @name aaaApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the aaaApp
 */
angular.module('aaaApp')
  .controller('CreateCtrl', function ($http, $scope, $location, $window, Auth) {
    var self = this;

    var baseUrl = 'insert api url here';

    if(!Auth.isLoggedIn()) {
      $location.path('/login');
    }

    self.formData = {};

    self.loadAllEvents = function() {
      $http
        .get(baseUrl + 'events')
        .success(function(data){
          self.events = data;
        });
    }

    self.createEvent = function(formData) {
      $http
        .post(baseUrl + 'events', {
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
        var url = 'https://api.cloudinary.com/v1_1/aaauiuc/image/upload';
        var timestamp = new Date().getTime();
        var secret = $window.localStorage.cloudinaryApiSecret;
        var payload = {
          file: e.target.result,
          api_key: $window.localStorage.cloudinaryApiKey,
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
