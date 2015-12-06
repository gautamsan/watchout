// start slingin' some d3 here.
var options = {
  height: document.documentElement.clientHeight,
  width: document.documentElement.clientWidth,
  numOfEnemies: 20,
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

var scoreBoard = {
  highScore: 0,
  collisions: 0
}

// var collide = function(node) {

//   node = d3.select(node);

//   var r = node.attr('r') + 8,
//       nx1 = node.attr('cx') - r,
//       nx2 = node.attr('cx') + r,
//       ny1 = node.attr('cy') - r,
//       ny2 = node.attr('cy') + r;


//   return function(quad, x1, y1, x2, y2) {
//     if (quad.point && (quad.point !== node)) {
//       var x = node.attr('cx') - quad.point.x,
//           y = node.attr('cy') - quad.point.y,
//           l = Math.sqrt(x * x + y * y),
//           r = node.attr('r') + quad.point.r;

//       console.log(node.attr('r'), quad.point[0].r);

//       if (l < r) {
//         // l = (l - r) / l * .5;
//         // node.x -= x *= l;
//         // node.y -= y *= l;
//         // quad.point.x += x;
//         // quad.point.y += y;
//         console.log('collided');
//       }
//     }
//     return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//   };
// };

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
      r: Math.random() * 30 + 20
    }
  });
};

var createPlayer = function() {
  return [{
    x: options.width / 2,
    y: options.height / 2,
  }];
};

var placePlayer = function(data) {
  var player = gameBoard.selectAll(".player").data(data);
  player.enter().append("svg:rect")
          .attr("class", "player characters")
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
          .attr("class", "enemy characters")
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

placeEnemies(enemy);
placePlayer(player);

var enemies = d3.selectAll(".enemy").data(enemy);
var players = d3.selectAll(".player");

// var characters = player.concat(enemy);
// var d3chars = d3.selectAll('.characters').data(characters);

// var force = d3.layout.force()
//                     .gravity(0.05)
//                     .charge(function(d, i) { return i ? 0 : -2000; })
//                      .nodes(d3chars)
//                      .size([options.width, options.height]);

// force.start();

// force.on("tick", function(e) {

//   var q = d3.geom.quadtree(d3chars),
//       i = 0,
//       n = characters.length,
//       collided = false;

//   while (++i < n) q.visit(collide(d3chars[0][i]));

//   force.resume();

//   // if (collided) {
//   //   countCurrentScore();
//   // }
  
//    // while (++i < n) {

//    //      q.visit(function() {
//    //        if (collide(characters[i])) {
//    //          countCurrentScore();
//    //        }
//    //      });
//    //    };
// });

var dragPlayer = function(data) {
  var selectedPlayer = d3.select('.player').data(data);
  var drag = d3.behavior.drag().on('drag', function(d) {
    
    //d3.event tracks x & y coords of mouse on event
    selectedPlayer.attr('x', d3.event.x)
                  .attr('y', d3.event.y);
  });

  selectedPlayer.call(drag);
};

var throttle = function(func, wait) {

  var throttled = false;

  return function() {
    if (!throttled) {
      func.call();
      throttled = true;
      setTimeout(function() {
        throttled = false;
      }, wait);
    }
  };
};

var detectCollision = function() {

  var collision = false;

  //take all the enemies
    //get the cx and cy of each enemy
    //get the position of the player
    //get the difference

    //pythagoras stuff
      //if less than size of player then collision is true

  //if collision
     //colision = true
     //reset the score
  // for(var i = 0; i < enemies.length; i++) {
  //   console.log(enemies[i]);
  //   var cx = enemies[i].attr("cx");
  //   var cy = enemies[i].attr("cy");
  // }

  var curPlayer = d3.select('.player');

  enemies.each(function(d) {

    var node = d3.select(this);
    var cx = node.attr('cx') - node.attr('r');
    var cy = node.attr('cy') - node.attr('r');

    var x = cx - curPlayer.attr('x') + 10;
    var y = cy - curPlayer.attr('y') + 10;


    if (Math.sqrt(x*x+y*y) < node.attr('r') + 70) {
      collision = true;
    }
  });

  if (collision) {
    var currentScore = d3.select(".current");
    currentScore = +currentScore.select('text').text();
    //store the currentScore in var
    countCurrentScore();
    //check highscore
    //add collision
    countHighScore(currentScore);
    throttleCollisions();
  }
};

var countHighScore = function(score) {
  //object for highScore
  var highScore = d3.selectAll(".high");

  if(score > scoreBoard.highScore) {
    scoreBoard.highScore = score;
    highScore.select('text').remove()
    highScore.append("text")
           .text(scoreBoard.highScore);
  }

  //highScore.text(scoreBoard.highScore);
}

var countCurrentScore = function() {   
  //object for currentScore
  var currentScore = d3.selectAll(".current").data([20000]);

  currentScore.select('text').remove();
  
  currentScore.append("text")
              .text(0)
              .transition()
              .duration(30000)
              .tween("text", function(d) {
                  var i = d3.interpolateRound(0, d);
                  return function(t) {
                    this.textContent = i(t);
                  };
              });
};

var countCollisions = function() {
  //object for collisions
  var collisions = d3.selectAll(".collisions");

  scoreBoard.collisions++;

  collisions.select('text').remove()
  collisions.append("text")
            .text(scoreBoard.collisions);
}

var throttleCollisions = throttle(countCollisions, 1000);

var startGame = function() {                          
  // placeEnemies(enemy);
  // placePlayer(player);
  dragPlayer(player);
  countCurrentScore();

  setInterval(function() {
    moveEnemies(enemy)
  }, 2000);

  setInterval(function() {
    detectCollision();
  }, 17);
};

startGame();

