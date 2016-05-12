'use strict';

/**
 * @ngdoc function
 * @name aaaApp.controller:FsCtrl
 * @description
 * # FsCtrl
 * Controller of the aaaApp
 */
angular.module('aaaApp')
  .controller('FsCtrl', function ($http) {

    var self = this;

    $http
      .get('./data/fs.json')
      .success(function(data){
        self.fs = data;
        self.fs.scenes.forEach(function(scene){
          if(scene.coords.length === 2) {
            scene.twoCoords = true;
          } else {
            scene.twoCoords = false;
          }
        })
      });

    //mobile nav bar
    $('#menu').slicknav({
      label: '',
      duration: 500
    });

    //set header height to window size, positions logo in center of viewport (vp)
    $(document).ready(function(){
      if ($(".header_nav").css("display") == "none") {
        setCenterMobile();
      }
      else {
        setCenter();
      }

      $("header").bgswitcher({
        images: ['img/fs/IMG_8690.jpg','img/fs/IMG_8038.jpg','img/fs/IMG_6912.jpg', 'img/fs/IMG_8237.jpg', 'img/fs/IMG_6250.jpg'],
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
      $('header').css({'height': vph + 'px'});
      //alert("height:" + vph +" width:" + vpw + " nav bar height:" + $('.nav-bar').height() + " logo height:" + $('#header-logo img').height() + "logo width:" + $('#header-logo img').width());
      $('#header-logo').css({'top': vph/2 - 270 + $('.nav-bar').height()/2 + 'px'});
      $('#header-logo').css({'left': vpw/2 - $('#header-logo img').width()/2 + 'px'});
    }

    function setCenterMobile() {
      var vph = $(window).height();
      var vpw = $(window).width();
      $('header').css({'height':'200px'});
      $('#header-logo').css({'top':'-5px'});
      $('#header-logo').css({'left': vpw/2 - $('#header-logo img').width()/2 + 'px'});
    }

  });
