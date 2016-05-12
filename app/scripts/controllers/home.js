'use strict';

/**
 * @ngdoc function
 * @name aaaApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the aaaApp
 */
angular.module('aaaApp')
  .controller('HomeCtrl', function ($http) {
    var self = this;

    var baseUrl = 'insert api url here';

    $http
      .get(baseUrl + 'events')
      .success(function(data){
        data.forEach(function(event){
          event.displayDate = moment.unix(event.date).format('M/D');
          event.upcoming = event.date > (Date.now()/1000);
        });
        self.events = data;
      });

    self.hasForm = function(event) {
      return !(event.form === "" || event.form === undefined);
    }

    //set header height to window size, positions logo in center of viewport (vp)
    $(document).ready(function(){
      //mobile nav bar
      $('#menu').slicknav({
        label: '',
        duration: 500
      });
      //logo positioning
      if ($(".header_nav").css("display") == "none") {
        setCenterMobile();
      }
      else {
        setCenter();
      }

      $("header").bgswitcher({
        images: ["img/home_slideshow/s1.jpg", "img/home_slideshow/s3.jpg", "img/home_slideshow/s4.jpg",
        "img/home_slideshow/s6.jpg", "img/home_slideshow/s7.jpg", "img/home_slideshow/s8.jpg",
        "img/home_slideshow/s9.jpg", "img/home_slideshow/s10.jpg"],
        shuffle: true,
        duration: 2000
      });

      if ($(".header_nav").css("display") != "none") {
        skrollr.init({
          smoothScrolling: false
        });
      }
    });

    window.onresize = function(event) {
      if ($(".header_nav").css("display") != "none") {
        setCenter();
      }
    }

    function setCenter() {
      var vph = $(window).height();
      var vpw = $(window).width();
      //alert("height:" + vph +" width:" + vpw + " nav bar height:" + $('.nav-bar').height() + " logo height:" + $('#header-logo img').height() + "logo width:" + $('#header-logo img').width());
      $('header').css({'height': vph + 'px'});
      $('#header-logo').css({'top': vph/2 - 233 + $('.nav-bar').height()/2 + 'px'});
      $('#header-logo').css({'left': vpw/2 - $('#header-logo img').width()/2 + 'px'});
    }

    function setCenterMobile() {
      var vpw = $(window).width();
      $('header').css({'height':'210px'});
      $('#header-logo').css({'left': vpw/2 - $('#header-logo img').width()/2 + 'px'});
    }


  });
