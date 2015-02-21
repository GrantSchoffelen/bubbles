'use strict';

angular.module('bubbleApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/users/get/worlds').success(function(worlds) {
      $scope.worlds = worlds;
      console.log(worlds)
    });

  });
