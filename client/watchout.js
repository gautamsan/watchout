// start slingin' some d3 here.
var options = {
  height: document.documentElement.clientHeight,
  width: document.documentElement.clientWidth,
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
      x: Math.random() * ((options.width - 60) - 60) + 60,
      y: Math.random() * ((options.height - 60) - 60) + 60
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
            return Math.random() * 20 + 10;
          }).style("fill", function(d, i) {
            return createColor(i % 5);
          });
};

var moveEnemies = function(data) {
  var enemies = gameBoard.selectAll(".enemy").data(data);
  enemies.transition()
          .attr("cx", function(d) {
            return Math.random() * ((options.width-60) - 60) + 60;
          })
          .attr("cy", function(d) {
            return Math.random() * ((options.height-60) - 60) + 60;
          }).duration(2000)
};

var startGame = function() {
  var enemy = createEnemies();
  placeEnemies(enemy);
  setInterval(function() {
    moveEnemies(enemy)
  }, 2000);
}

startGame();

