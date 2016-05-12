'use strict';

/**
 * @ngdoc function
 * @name aaaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the aaaApp
 */
angular.module('aaaApp')
  .controller('AboutCtrl', function ($http) {

    var self = this;

    $http
      .get('./data/about.json')
      .success(function(data){
        self.about = data;
      });

    $(document).ready(function(){
      //mobile nav bar
      $('#menu').slicknav({
        label: '',
        duration: 500
      });
      if ($(".header_nav").css("display") != "none") {
        resizeDiv();
      }
      setBackground();
    });

    window.onresize = function(event) {
      if ($(".header_nav").css("display") != "none") {
        resizeDiv();
      }
    }

    function resizeDiv() {
      var vph = $(window).height();
      $('header').css({'height': vph*(11/16) + $('.nav-bar').height()/2 + 'px'});
    }

    function setBackground() {
      if ($(".header_nav").css("display") != "none") {
        $('header').css({"background":"url('img/boardpic.jpg') fixed no-repeat","background-size":"cover"});
      }
      else {
        $('header').css({"height":"195px","background":"url('img/boardpicmobile.jpg') no-repeat","background-size":"365px"});
      }
    }


  });
