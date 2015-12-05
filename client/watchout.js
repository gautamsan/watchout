// start slingin' some d3 here.
var options = {
  height: document.documentElement.clientHeight,
  width: document.documentElement.clientWidth,
  numOfEnemies: 1,
  winScore: 1000
};

var gameBoard = d3.select("body").append("svg")
                  .attr("width", options.width)
                  .attr("height", options.height)
                  .attr("class", "gameBoard");

var createColor = function(idx) {
  var colors = ["#FF5733", "#FFBD33", "#DBFF33", "#33FFBD", "#33FCFF"];
  return colors[idx];
}

var collide = function(node) {
  var r = node.r + 8,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;

  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.r + quad.point.r;

      console.log(quad.point, node);

      if (l < r) {
        // l = (l - r) / l * .5;
        // node.x -= x *= l;
        // node.y -= y *= l;
        // quad.point.x += x;
        // quad.point.y += y;
        console.log('collided');
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
};

var createEnemies = function() {
  var enemies = [];
  for(var i = 0; i < options.numOfEnemies; i++) {
    enemies.push(i);
  }
  return enemies.map(function(val) {
    return {
      id: val,
      x: Math.random() * ((options.width - 60) - 60) + 60,
      y: Math.random() * ((options.height - 60) - 60) + 60,
      r: Math.random() * 20 + 10
    }
  });
};

var createPlayer = function() {
  return [{
    x: options.width / 2,
    y: options.height / 2,
    r: 200 //collides only for this value!!
  }];
};

var placePlayer = function(data) {
  var player = gameBoard.selectAll(".player").data(data);
  player.enter().append("svg:rect")
          .attr("class", "player")
          .attr("x", function(d) {
            return d.x;
          })
          .attr("y", function(d) {
            return d.y;
          })
          .attr("width", 30)
          .attr("height", 30)
          .style("fill", "black");
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
            return d.r;
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

var enemy = createEnemies();
var player = createPlayer();
var characters = player.concat(enemy);

var force = d3.layout.force()
                    .gravity(0.05)
                    .charge(function(d, i) { return i ? 0 : -2000; })
                     .nodes(characters)
                     .size([options.width, options.height]);

force.start();

force.on("tick", function(e) {
  var q = d3.geom.quadtree(characters),
      i = 0,
      n = characters.length,
      collided = false;

  while (++i < n) q.visit(collide(characters[i]));

  force.resume();

  // if (collided) {
  //   countCurrentScore();
  // }
  
   // while (++i < n) {

   //      q.visit(function() {
   //        if (collide(characters[i])) {
   //          countCurrentScore();
   //        }
   //      });
   //    };
});

var dragPlayer = function(data) {
  var selectedPlayer = d3.select('.player').data(data);
  var drag = d3.behavior.drag().on('drag', function(d) {
    
    //d3.event tracks x & y coords of mouse on event
    selectedPlayer.attr('x', d3.event.x)
                  .attr('y', d3.event.y);
  });

  selectedPlayer.call(drag);
};

var countHighScore = function() {
  //object for highScore
  var highScore = d3.selectAll(".high span").data();
  highScore.append("text");
}

var countCurrentScore = function() {   
  //object for currentScore
  var currentScore = d3.selectAll(".current").data([8000]);

  currentScore.select('text').remove();
  
  currentScore.append("text")
              .text(0)
              .transition()
              .duration(10000)
              .tween("text", function(d) {
                  var i = d3.interpolateRound(0, d);
                  return function(t) {
                    this.textContent = i(t);
                  };
              });
};

var countCollisions = function() {
  //object for collisions
  var collisions = d3.selectAll(".collisions span").data();
}

var startGame = function() {                          
  placeEnemies(enemy);
  placePlayer(player);
  dragPlayer(player);
  countCurrentScore();

  setInterval(function() {
    moveEnemies(enemy)
  }, 2000);
};

startGame();

