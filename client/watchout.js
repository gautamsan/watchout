// start slingin' some d3 here.
var options = {
  height: 500,
  width: 800,
  numOfEnemies: 30
};

var gameBoard = d3.select("body").append("svg")
                  .attr("width", options.width)
                  .attr("height", options.height)
                  .attr("class", "gameBoard");

var stats = {
  highScore: 0,
  currentScore: 0,
  collisions: 0
};

var createColor = function(idx) {
  var colors = ["#FF5733", "#FFBD33", "#DBFF33", "#33FFBD", "#33FCFF"];
  return colors[idx];
}

var createEnemies = function() {
  var enemies = [];
  for(var i = 0; i < 30; i++) {
    enemies.push(i);
  }
  return enemies.map(function(val) {
    return {
      id: val,
      x: Math.random() * options.width,
      y: Math.random() * options.height
    }
  });
  //put numOfEnemies items in the [enemies]
  //map over the [enemies]
    //make each enemy an object with id, x-coord, y-coord
  //return the [enemies]
};

var placeEnemies = function(data) {
  var enemies = gameBoard.selectAll(".enemy").data(data);
  enemies.enter().append("svg:circle")
          .attr("class", "enemy")
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          }).attr("r", function(d) {
            return Math.random() * 40;
          }).style("fill", function(d, i) {
            return createColor(i % 5);
          });
};

var startGame = function() {
  placeEnemies(createEnemies());
}

startGame();

