function initTask(subTask) {
    var state = {};
    var maze = {};
    var level;
    var answer = null;
    var playedOptimally = true;
    var data = {
        easy: {
            walls: {
                unit: "wall",
                horizontal: [
                    [3,0,0,0],
                    [1,0,0,0],
                    [2,0,0,0]
                ],
                vertical: [
                    [0,0,0,0,0],
                    [0,0,0,0,0]
                ]
            },
            rooms: [
               [1,0,0,0,0],
               [1,0,0,0,0],
               [1,0,0,0,0]
            ],
            maxThickness: 3
        },
        medium: {
            walls: {
                unit: "wall",
                horizontal: [
                    [3,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                vertical: [
                    [2,0,0,0],
                    [0,0,0,0]
                ]
            },
            rooms: [
               [1,0,0,0],
               [0,0,0,0],
               [0,0,0,0]
            ],
            maxThickness: 3
        },
        hard: {
            walls: {
                unit: "meter",
                horizontal: [
                    [12,0,0],
                    [0,0,0],
                    [0,0,0],
                    [0,0,0]
                ],
                vertical: [
                    [8,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ]
            },
            rooms: [
               [1,0,0,0],
               [0,0,0,0],
               [0,0,0,0],
               [0,0,0,0]
            ],
            maxThickness: 19
        }
    };
    var textAttr = {
       fill: "black",
       "font-size": "18px",
       "font-weight": "bold"
    };
    var duration = 200; // animation
    var paper = null;
    var paperWidth = 500;
    var radius = 25;
    var hallwayLength = 60;
    var hallwayWidth = 28;
    var blockWidth = 7;
    var blockSpacing = 4;
    var treasurePos = {
        col: -1,
        row: -1
    };
    var colorHidden = "#525252";
    var colorDiscovered = "#ffe0c8";
    var colorWall = "#e26800";
    var wallBits = [];
    var wallBitsCols = 4;
    var wallBitsRows = 4;
    var wallBitsPos = null;
    var openingW = 12;

    subTask.loadLevel = function(curLevel) {
       level = curLevel;
       displayHelper.hideValidateButton = true;
       answer = subTask.getDefaultAnswerObject();
       initMaze();
    };

    subTask.getStateObject = function() {
       return state;
    };

    subTask.reloadAnswerObject = function(answerObj) {
       answer = answerObj;
       if (answer !== undefined) {
           initMaze();
       }
    };

    subTask.resetDisplay = function() {
        if (answer == null) {
           return;
        }
        wallBitsPos = { "vertical" : [], "horizontal": [] };
        var height =  (data[level].rooms.length - 1) * (radius * 2 + hallwayLength) + 2 * radius;
        if (paper != null) {
           paper.remove();
        }
        paper = subTask.raphaelFactory.create("anim", "anim", paperWidth, height);
        draw();
        updateFeedback();
        if (typeof(enableRtl) != "undefined") {
           $("body").attr("dir", "rtl");
           $(".largeScreen #zone_1").css("float", "right");
           $(".largeScreen #zone_2").css("float", "right");
        }
    };
    
    function draw() {
        paper.clear();
        $.each(maze.rooms, function(row, rooms) {
            $.each(rooms, function(col, room) {
                drawCircle(row, col, room);
            });
        });

        $.each(maze.walls.vertical, function(row, walls) {
            $.each(walls, function(col, wall) {
                drawWall(row, col, wall, "vertical", function() {
                   updateWalls("vertical", row, col, wall.thickness);
                });
            });
        });

        $.each(maze.walls.horizontal, function(row, walls) {
            $.each(walls, function(col, wall) {
                drawWall(row, col, wall, "horizontal", function() {
                   updateWalls("horizontal", row, col, wall.thickness);
                });
            });
        });
    }

    subTask.getAnswerObject = function() {
       return answer;
    };
    
    function initMaze() {
        var walls = {
           unit: "",
           vertical: [],
           horizontal: []
        };
        var rooms = [];
        for (var row = 0 ; row < data[level].rooms.length ; row++) {
            rooms.push([]);
            for (var col = 0 ; col < data[level].rooms[row].length ; col++) {
                rooms[row][col] = data[level].rooms[row][col];
            }
        }
        var dataWalls = data[level].walls;
        for (var row = 0 ; row < dataWalls.vertical.length ; row++) {
            walls.vertical.push([]);
            for (var col = 0 ; col < dataWalls.vertical[row].length ; col++) {
                walls.vertical[row][col] = { thickness: dataWalls.vertical[row][col], broken: false};
            }
        }
        for (var row = 0 ; row < dataWalls.horizontal.length ; row++) {
            walls.horizontal.push([]);
            for (var col = 0 ; col < dataWalls.horizontal[row].length ; col++) {
                walls.horizontal[row][col] = { thickness: dataWalls.horizontal[row][col], broken: false};
            }
        }

        // Active this line for dynamic adjustment of the grid size
        // hallwayLength = (paperWidth - rooms[0].length * radius * 2) / (rooms[0].length - 1);

        var maxThickness = data[level].maxThickness;
        switch (level) {
            case "easy":
                walls.unit = "wall";
                fillWallsThickness(walls, "horizontal", maxThickness);
                break;
            case "medium":
                walls.unit = "wall";
                fillWallsThickness(walls, "vertical", maxThickness);
                fillWallsThickness(walls, "horizontal", maxThickness);
                break;
            case "hard":
                walls.unit = "meter";
                fillWallsThickness(walls, "vertical", maxThickness);
                fillWallsThickness(walls, "horizontal", maxThickness);
                break;
            default:
                break;
        }
        maze = {
           walls: walls,
           rooms: rooms
        };
        playedOptimally = true;
        for (var iWall = 0; iWall < answer.brokenWalls.length; iWall++) {
            var wall = answer.brokenWalls[iWall];
            tryBreakWall(wall.type, wall.row, wall.col);
        }
    };
    

    subTask.getDefaultAnswerObject = function() {
       return {
           brokenWalls: [],
           result: 0
       };
    };

    subTask.unloadLevel = function(callback) {
       callback();
    };

    function getResultAndMessage() {
        var message = "";
        var successRate = 0;
        if (areAllRoomDiscovered()) {
           if (playedOptimally) {
                message = taskStrings.success;
                successRate = 1;
            } else {
                message = taskStrings.error(level);
            }
        } else {
            message = taskStrings.notFinished;
        }
        return {
            successRate: successRate,
            message: message
        };
    }

    subTask.getGrade = function(callback) {       
       callback(getResultAndMessage());
    };

    function fillWallsThickness(walls, type, max) {
        var random = new RandomGenerator(1); // no seed is used
        for (var row = 0 ; row < data[level].walls[type].length ; row ++) {
            for (var col = 0 ; col < data[level].walls[type][row].length ; col ++) {
                if (col !== 0 || row !== 0) {
                    var min = 1;
                    if(level == "hard"){
                        min = 8;
                    }
                    if ((level == "easy") && (col == 2)) {
                       min = 2;
                    }
                    walls[type][row][col].thickness = random.nextInt(min, max);
                }
            }
        }
    }

    function drawCircle(row, col, room) {
        var cx = col * (radius * 2 + hallwayLength) + radius;
        var cy = row * (radius * 2 + hallwayLength) + radius;
        paper.circle(cx, cy, radius).attr({
            fill: room !== 0 ? colorDiscovered : colorHidden
        });

        if (treasurePos.col !== -1) {
            var imgUrl = $("#treasure").attr("src");
            paper.image(imgUrl, treasurePos.col * (radius * 2 + hallwayLength) + hallwayWidth / 2-5, treasurePos.row * (radius * 2 + hallwayLength) + hallwayWidth / 2-3, 30, 30);
        }
    }
    
    function wallDiscoveredRooms(type, row, col) {
       var nbRooms = 0;
       if (maze.rooms[row][col] === 1) {
          nbRooms++;
       }
       if ((type === "horizontal") && (maze.rooms[row][col + 1] === 1)) {
          nbRooms++;
       }
       if ((type === "vertical") && (maze.rooms[row + 1][col] === 1)) {
          nbRooms++;
       }
       return nbRooms;
    }

    function drawWall(row, col, wall, type, clickFct) {
        var firstWallPos = (hallwayLength - wall.thickness * 10 - (wall.thickness - 1) * 2) / 2;
        var x = col * (radius * 2 + hallwayLength);
        var y = row * (radius * 2 + hallwayLength);
        var wallLength = wall.thickness*2;

        var discovered = (wallDiscoveredRooms(type, row, col) > 0);
        if (type === "horizontal") {
            x += radius * 2;
            paper.rect(x, y + radius - hallwayWidth / 2, hallwayLength, hallwayWidth).attr({ fill: discovered ? colorDiscovered : colorHidden, "stroke-width": 1}).click(clickFct);

            if (discovered && maze.walls.unit === "wall") {
                for (var block = 0 ; block < wall.thickness ; block++) {
                    paper.rect(x + firstWallPos + block * (blockWidth + blockSpacing), y + radius - hallwayWidth / 2, blockWidth, hallwayWidth)
                         .attr({ fill: colorWall, "stroke-width": 0})
                         .click(clickFct);
                }
            } else if (discovered && maze.walls.unit === "meter") {

                paper.rect(x + (hallwayLength - wallLength) / 2, y + radius - hallwayWidth / 2, wallLength, hallwayWidth)
                     .attr({ fill: colorWall, "stroke-width": 0})
                     .click(clickFct);
                paper.text(x + hallwayLength / 2, y + radius, wall.thickness)
                     .attr(textAttr)
                     .click(clickFct).toFront();
            }

            if (wall.broken) {
                paper.rect(x - radius + hallwayLength / 2, y + radius - 4, 40, openingW)
                     .attr({
                       fill: colorDiscovered,
                       stroke: 0
                   });
                addWallBits(type,row,col,wall.thickness);
                if(level == "hard") {
                    paper.text(x + hallwayLength / 2, y + radius, wall.thickness).attr(textAttr);
                }

            }
        } else {
            y += radius * 2;
            paper.rect(x - hallwayWidth / 2 + radius, y, hallwayWidth, hallwayLength).attr({ fill: discovered ? colorDiscovered : colorHidden, "stroke-width": 1}).click(clickFct);

            if (discovered && maze.walls.unit === "wall") {
                for (var block = 0 ; block < wall.thickness ; block ++) {
                    paper.rect(x - hallwayWidth / 2 + radius, y + firstWallPos + block * (blockWidth + blockSpacing), hallwayWidth, blockWidth).attr({ fill: colorWall, "stroke-width": 0}).click(clickFct);
                }
            } else if (discovered && maze.walls.unit === "meter") {
                paper.rect(x - hallwayWidth / 2 + radius, y + (hallwayLength - wallLength) / 2, hallwayWidth, wallLength).attr({ fill: colorWall, "stroke-width": 0}).click(clickFct);
                paper.text(x + radius, y + hallwayLength / 2, wall.thickness).attr(textAttr).click(clickFct).toFront();
            }

            if (wall.broken) {
                paper.rect(x + radius - 4, y + hallwayLength / 2 - 20, openingW, 40).attr({
                    fill: colorDiscovered,
                    stroke: 0
                });
                addWallBits(type,row,col,wall.thickness);
                if(level == "hard") {
                    paper.text(x + radius, y + hallwayLength / 2, wall.thickness).attr(textAttr);
                }

            }
        }
    }

    function updateWalls(type, row, col, thickness) {
        if (maze.walls[type][row][col].broken) {
           return;
        }
        if (areAllRoomDiscovered()) {
           return;
        }
        
        if (tryBreakWall(type, row, col)) {
           answer.brokenWalls.push({
              type: type,
              row: row,
              col: col
           });
           answer.result += thickness;
           destroyWall(type,row,col,thickness);
        }
        updateFeedback();
        if (areAllRoomDiscovered()) {
            subTask.delayFactory.create("delay",function(){platform.validate("done")},1000);
        }
    }

    function updateFeedback() {
        var message = (level == "hard") ? taskStrings.feedbackHard : taskStrings.feedbackEasyMedium;
        $("#result").html(message + "<br/><span id=\"nb_walls\">"+answer.result+"</span>");
    }

    function destroyWall(type,row,col,wall) {
        var wallBits = createWallBits(type,row,col,wall);
        destructionAnim(wallBits,row,col,type,wall);
    };

    function createWallBits(type,row,col,wall){
        var firstWallPos = (hallwayLength - wall * 10 - (wall - 1) * 2) / 2;
        var x = col * (radius * 2 + hallwayLength);
        var y = row * (radius * 2 + hallwayLength);
        var wallLength = wall*2;
        removeWallBits();
        if (type === "horizontal") {
            x += radius * 2;
            var openingY = y + radius - openingW/2;
            var openingX = x - radius + hallwayLength / 2;
            paper.rect(openingX,openingY,40,openingW).attr({fill: colorDiscovered,stroke: 0});
            if(level != "hard"){
                for (var iBlock = 0; iBlock < wall; iBlock++) {
                    var xBlock = x + firstWallPos + iBlock * (blockWidth + blockSpacing);
                    diceBlock(type,iBlock,xBlock,openingY,blockWidth);
                }
            }else{
                var xBlock = x + (hallwayLength - wallLength) / 2
                diceBlock(type,0,xBlock,openingY,wallLength);
            }
        }else{
            y += radius * 2;
            var openingX = x + radius - openingW/2;
            var openingY = y - radius + hallwayLength / 2;
            paper.rect(openingX,openingY,openingW,40).attr({fill: colorDiscovered,stroke: 0});
            if(level != "hard"){
                for (var iBlock = 0; iBlock < wall; iBlock++) {
                    var yBlock = y + firstWallPos + iBlock * (blockWidth + blockSpacing);
                    diceBlock(type,iBlock,yBlock,openingX,blockWidth);
                }
            }else{
                var yBlock = y + (hallwayLength - wallLength) / 2
                diceBlock(type,0,yBlock,openingX,wallLength);
            }
        }
        return wallBits;
    };

    function diceBlock(type,iBlock,blockPos,openingPos,wallWidth) {
        if (Beav.Navigator.isIE8()) {
           return;
        }
        if(level != "hard"){
            var wBitsCols = wallBitsCols;
            var wBitsRows = wallBitsRows;
        }else{
            var wBitsCols = (type == "horizontal") ? 2*wallBitsCols : wallBitsCols;
            var wBitsRows = (type == "horizontal") ? wallBitsRows : 2*wallBitsRows;
        }
        if(type == "horizontal"){
            var wallBitsW = wallWidth/wBitsCols;
            var wallBitsH = openingW/wBitsRows;
            wallBits[iBlock] = [];
            for(var iRow = 0; iRow < wBitsRows; iRow++){
                wallBits[iBlock][iRow] = [];
                var wBitsY = openingPos + openingW*iRow/wBitsRows;
                for(var iCol = 0; iCol < wBitsCols; iCol++){
                    var wBitsX = blockPos + wallWidth*iCol/wBitsCols;
                    var wBit = paper.rect(wBitsX, wBitsY, wallBitsW, wallBitsH);
                    wBit.attr({ fill: colorWall, "stroke-width": 0}).toFront();
                    wallBits[iBlock][iRow][iCol] = wBit;
                }
            }
        }else{
            var wallBitsW = openingW/wBitsCols;
            var wallBitsH = wallWidth/wBitsRows;
            wallBits[iBlock] = [];
            for(var iRow = 0; iRow < wBitsRows; iRow++){
                wallBits[iBlock][iRow] = [];
                var wBitsY = blockPos + wallWidth*iRow/wBitsRows;
                for(var iCol = 0; iCol < wBitsCols; iCol++){
                    var wBitsX = openingPos + openingW*iCol/wBitsCols;
                    var wBit = paper.rect(wBitsX, wBitsY, wallBitsW, wallBitsH);
                    wBit.attr({ fill: colorWall, "stroke-width": 0}).toFront();
                    wallBits[iBlock][iRow][iCol] = wBit;
                }
            }
        }
    };

    function resetWallBitsPos(type, row, col) {
         if (wallBitsPos[type] == undefined) {
            wallBitsPos[type] = [];
         }
         if (wallBitsPos[type][row] == undefined) {
            wallBitsPos[type][row] = [];
         }
         if (wallBitsPos[type][row][col] == undefined) {
            wallBitsPos[type][row][col] = [];
         }
    }
    function destructionAnim(wallBits,row,col,type,wallThickness) {
        if(level != "hard") {
            var wallWidth = blockWidth;
            var nBlocks = wallThickness;
            var wBitsCols = wallBitsCols;
            var wBitsRows = wallBitsRows;
        }else{
            var wallWidth = wallThickness*2;
            var nBlocks = 1;
            var wBitsCols = (type == "horizontal") ? 2*wallBitsCols : wallBitsCols;
            var wBitsRows = (type == "horizontal") ? wallBitsRows : 2*wallBitsRows;
        }
        var wallBitsW = (type == "horizontal") ? wallWidth/wBitsCols : openingW/wBitsCols;
        var wallBitsH = (type == "horizontal") ? openingW/wBitsRows : wallWidth/wBitsRows;
        resetWallBitsPos(type, row, col);
        wallBitsPos[type][row][col] = [];
        for (var iBlock = 0; iBlock < nBlocks; iBlock++) {
            wallBitsPos[type][row][col][iBlock] = [];
            for(var iRow = 0; iRow < wBitsRows; iRow++){
                wallBitsPos[type][row][col][iBlock][iRow] = [];
                for(var iCol = 0; iCol < wBitsCols; iCol++){
                    var oldX = wallBits[iBlock][iRow][iCol].attr("x");
                    var oldY = wallBits[iBlock][iRow][iCol].attr("y");
                    if(iRow < wBitsRows/2){
                        var jRow = iRow;
                        var yFactor = -1;
                    }else{
                        var jRow = wBitsRows-1-iRow;
                        var yFactor = 1;
                    }
                    if(iCol < wBitsCols/2){
                        var jCol = iCol;
                        var xFactor = -1;
                    }else{
                        var jCol = wBitsCols-1-iCol;
                        var xFactor = 1;
                    }

                    if(type == "horizontal"){
                        var newX = oldX + xFactor*2*wallBitsW*(1-0.2*jCol+0.5*jRow);
                        var newY = oldY + yFactor*1.05*wallBitsH*(1+2*jRow);
                    }else{
                        var newX = oldX + xFactor*1.05*wallBitsW*(1+2*jCol);
                        var newY = oldY + yFactor*2*wallBitsH*(1.1-0.2*jRow+0.5*jCol);
                    }

                    var anim = Raphael.animation({ "x" : newX, "y": newY },duration,">");
                    subTask.raphaelFactory.animate("anim",wallBits[iBlock][iRow][iCol],anim);
                    wallBitsPos[type][row][col][iBlock][iRow][iCol] = { "x" : newX, "y" : newY };
                }
            }
        }
        subTask.delayFactory.create("draw"+type+wallThickness,draw,2*duration);
    };

    function removeWallBits(){
        for (var iBlock = 0; iBlock < wallBits.length; iBlock++) {
            for(var iRow = 0; iRow < wallBits[iBlock].length; iRow++){
                for(var iCol = 0; iCol < wallBits[iBlock][iRow].length; iCol++){
                    wallBits[iBlock][iRow][iCol].remove();
                }
            }
        }
    };

    function addWallBits(type,row,col,wThickness) {
        if(level != "hard") {
            var wallWidth = blockWidth;
            var nBlocks = wThickness;
            var wBitsCols = wallBitsCols;
            var wBitsRows = wallBitsRows;
        }else{
            var wallWidth = wThickness*2;
            var nBlocks = 1;
            var wBitsCols = (type == "horizontal") ? 2*wallBitsCols : wallBitsCols;
            var wBitsRows = (type == "horizontal") ? wallBitsRows : 2*wallBitsRows;
        }
        var wallBitsW = (type == "horizontal") ? wallWidth/wBitsCols : openingW/wBitsCols;
        var wallBitsH = (type == "horizontal") ? openingW/wBitsRows : wallWidth/wBitsRows;
        resetWallBitsPos(type, row, col);
        for(var iBlock = 0; iBlock < nBlocks; iBlock++) {
            if (wallBitsPos[type][row][col][iBlock] == undefined) {
               wallBitsPos[type][row][col][iBlock] = [];
            }
            for(var iRow = 0; iRow < wallBitsPos[type][row][col][iBlock].length; iRow++){
                for(var iCol = 0; iCol < wallBitsPos[type][row][col][iBlock][iRow].length; iCol++){
                    var x = wallBitsPos[type][row][col][iBlock][iRow][iCol].x;
                    var y = wallBitsPos[type][row][col][iBlock][iRow][iCol].y;
                    paper.rect(x,y,wallBitsW,wallBitsH).attr({ fill: colorWall, stroke: 0 }).toFront();
                }
            }
        }
    };


    function getRoomWalls(row, col) {
       var deltas = [
          {type: "horizontal", row: 0, col: 0},
          {type: "horizontal", row: 0, col: -1},
          {type: "vertical", row: 0, col: 0},
          {type: "vertical", row: -1, col: 0}
       ];
       var roomWalls = [];
       for (var iDelta = 0; iDelta < deltas.length; iDelta++) {
          var delta = deltas[iDelta];
          var newRow = row + delta.row;
          var newCol = col + delta.col;
          if ((maze.walls[delta.type][newRow] != undefined) && (maze.walls[delta.type][newRow][newCol] != undefined)) {
             roomWalls.push({type: delta.type, row: newRow, col: newCol});
          }
       }
       return roomWalls;
    }

       
    function minThicknessOfDiscoveredWall(startRow, startCol) {
        var minThickness = 1000;
        var roomsExplored = [];
        for (var iRow = 0; iRow < maze.rooms.length; iRow++) {
           roomsExplored.push([]);
           for (var iCol = 0; iCol < maze.rooms[iRow].length; iCol++) {
              roomsExplored[iRow].push(false);
           }
        }
        function explore(row, col) {
           if ((col < 0) || (row < 0) || (roomsExplored[row] == undefined) || (roomsExplored[row][col] == undefined)) {
              return;
           }
           if (maze.rooms[row][col] == 1) {
              return;
           }
           if (roomsExplored[row][col]) {
              return;
           }
           roomsExplored[row][col] = true;
           var roomWalls = getRoomWalls(row, col);
           for (var iWall = 0; iWall < roomWalls.length; iWall++) {
              var roomWall = roomWalls[iWall];
              var wall = maze.walls[roomWall.type][roomWall.row][roomWall.col];
              if (!wall.broken) {
                 if (wallDiscoveredRooms(roomWall.type, roomWall.row, roomWall.col) == 1) {
                    minThickness = Math.min(minThickness, wall.thickness);
                 }
                 if (roomWall.type == "vertical") {
                    explore(roomWall.row, roomWall.col);
                    explore(roomWall.row + 1, roomWall.col);
                 } else {
                    explore(roomWall.row, roomWall.col);
                    explore(roomWall.row, roomWall.col + 1);
                 }
              }
           }
        }
        explore(startRow, startCol);
        return minThickness;
    }
    
    function roomHasHiddenOrThinnerWall(row, col, thickness) {
       var roomWalls = getRoomWalls(row, col);
       for (var iWall = 0; iWall < roomWalls.length; iWall++) {
          var roomWall = roomWalls[iWall];
          var wall = maze.walls[roomWall.type][roomWall.row][roomWall.col];
          if (wall.thickness < thickness) {
             return true;
          }
          if (wallDiscoveredRooms(roomWall.type, roomWall.row, roomWall.col) < 2) {
             return true;
          }          
       }
       return false;
    }
    
    function fillUndiscoveredWalls(thickness) {
        $.each(["vertical", "horizontal"], function(iType, type) {
           $.each(maze.walls[type], function(row, walls) {
               $.each(walls, function(col, wall) {
                  if ((wallDiscoveredRooms(type, row, col) == 0) && (wall.thickness > thickness)) {
                      wall.thickness = thickness;
                  }
               });
           });       
        });
    }

    function tryBreakWall(type, row, col) {
        var discoveredRow;
        var discoveredCol;
        if (type === "horizontal") {
            discoveredRow = row;
            if (maze.rooms[row][col] === 1) {
               discoveredCol = col + 1;
            } else if (maze.rooms[row][col + 1] === 1) {
               discoveredCol = col;
            } else {
               return false;
            }
        } else {
            discoveredCol = col;
            if (maze.rooms[row][col] === 1) {
                discoveredRow = row + 1;
            } else if (maze.rooms[row + 1][col] === 1) {
                discoveredRow = row;
            } else {
               return false;
            }
        }
        if (wallDiscoveredRooms(type, row, col) == 2) {
            playedOptimally = false;
        } else {
           var thickness = maze.walls[type][row][col].thickness;
           var minThickness = minThicknessOfDiscoveredWall(discoveredRow, discoveredCol);
           if (thickness > minThickness) {
              playedOptimally = false;
              if (roomHasHiddenOrThinnerWall(discoveredRow, discoveredCol, thickness)) {
                 fillUndiscoveredWalls(thickness - 1);
              }
           }
        }
        
        
        if (level === "easy") {
            $.each(maze.rooms, function(row, rooms) {
               maze.rooms[row][discoveredCol] = 1;
            });
        } else {
            maze.rooms[discoveredRow][discoveredCol] = 1;
        }
       
        if (areAllRoomDiscovered()) {
            treasurePos = {
                col: discoveredCol,
                row: discoveredRow
            };
        }
        maze.walls[type][row][col].broken = true;
        return true;
    }

    function areAllRoomDiscovered() {
        var allRoomsDiscovered = true;
        $.each(maze.rooms, function(row, rooms) {
            $.each(rooms, function(col, room) {
                if (room === 0) {
                    allRoomsDiscovered = false;
                }
            });
        });
        return allRoomsDiscovered;
    }

}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
