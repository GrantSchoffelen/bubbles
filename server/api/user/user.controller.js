'use strict';

var geolib = require('geolib') // geolocation library 
var worlds = require('./worlds.js') // world data
var user = require('./user.js') // user data



exports.worlds = function(req, res) {
  var WorldsThatAreOpen = [];
  var WorldsUserIsIn = [];
  var userTime = new Date(user.user.usertime);

  //Checks if world is open based on users time
  function checkIfWorldIsOpen(worlds) {
    for (var i = 0; i < worlds.data.length; i++) {
      if (!worlds.data[i].time.timeend) {
        WorldsThatAreOpen.push(worlds.data[i])

      } else if (userTime > new Date(worlds.data[i].time.timestart) && userTime < new Date(worlds.data[i].time.timeend)) {
        WorldsThatAreOpen.push(worlds.data[i])
      }
    }
  }

  //Checks if user is within radius of world
  function checkIfUserIsInWorld(WorldsThatAreOpen) {
    for (var j = 0; j < WorldsThatAreOpen.length; j++) {
      if (geolib.isPointInCircle({
            latitude: user.user.userloc.coordinates[0],
            longitude: user.user.userloc.coordinates[1]
          }, {
            latitude: WorldsThatAreOpen[j].loc.coordinates[0],
            longitude: WorldsThatAreOpen[j].loc.coordinates[1]
          },
          WorldsThatAreOpen[j].radius
        ) === true) {
        WorldsUserIsIn.push(WorldsThatAreOpen[j])

      }
    }
  }

//Ranks worlds for user based on terms
  function rankWorldsBasedOnTerms(WorldsUserIsIn) {
    var counter = 0;
    for (var j = 0; j < WorldsUserIsIn.length; j++) {
      for (var i = 0; i < user.user.tags.length; i++) {
        if (WorldsUserIsIn[j].tags.indexOf(user.user.tags[i]) !== -1) {
          counter++

        }
      }
      WorldsUserIsIn[j].MatchingTerms = counter
      counter = 0;
    }
  }

  checkIfWorldIsOpen(worlds) //returns worlds 1,2,3,4,6,7,9 and 10
  checkIfUserIsInWorld(WorldsThatAreOpen) // returns worlds 1,2,3,4,6,7 and 9
  rankWorldsBasedOnTerms(WorldsUserIsIn)

//Sorts the ranked worlds - first one is most relavent 
// Returns worlds in the following order - 2, 9, 3, 4, 7, 6, and 1
  WorldsUserIsIn.sort(function(a, b) {
    var RankA = (a.MatchingTerms);
    var RankB = (b.MatchingTerms);
    if (RankA > RankB) return -1;
    if (RankA < RankB) return 1;
    return 0;
  })

  res.send(WorldsUserIsIn)
}