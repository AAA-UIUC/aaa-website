'use strict';

/**
 * @ngdoc function
 * @name aaaApp.controller:BoardCtrl
 * @description
 * # BoardCtrl
 * Controller of the aaaApp
 */
angular.module('aaaApp')
  .controller('BoardCtrl', function ($http) {

    var self = this;

    $http
      .get('./data/board.json')
      .success(function(data){
        self.board = data;
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
        $('header').css({"background":"url('img/boardbbq2.jpg') fixed no-repeat","background-size":"cover"});
      }
      else {
        $('header').css({"height":"195px","background":"url('img/boardbbq2.jpg') no-repeat","background-size":"365px"});
      }
    }

  });
