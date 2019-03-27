function initTask(subTask) {
    var state = {};
    var level;
    var answer = null;
    var data = {
        allShapes: ["triangle", "diamond", "rectangle", "circle", "star", "reverseTriangle", "pentagon", "roundedRectangle", "hexagon", "squareStar"],
          // , "ellipse"
       easy: {
           all: ["triangle", "rectangle", "circle", "star", "reverseTriangle", "diamond"],
           target: ["star", "reverseTriangle", "triangle", "star"],
           origin: [ "circle", "rectangle", "diamond", "circle"],
           process: []
       },
       medium: {
            all: ["triangle", "rectangle", "circle", "star", "reverseTriangle", "diamond"],
            origin: [ "circle", "star", "rectangle", "triangle"],
            target: ["rectangle", "triangle", "reverseTriangle", "star"],
            process: []
       },
       old_medium: {
            all: ["triangle", "diamond", "rectangle", "circle", "star", "reverseTriangle"],
            origin: [ "circle", "star", "rectangle", "diamond", "triangle"],
            target: ["rectangle", "triangle", "reverseTriangle", "circle", "star"],
            process: []
       },
       hard: {
            all: ["triangle", "rectangle", "circle", "star", "reverseTriangle", "diamond", "squareStar"],
            origin: ["triangle", "star",  "circle", "diamond", "reverseTriangle", "rectangle"],
            target: ["reverseTriangle", "rectangle",  "triangle", "star",  "circle", "diamond"],
            process: []
       }
    };
    var buttonAttr = {
        "stroke": "black",
        "stroke-width": 1,
        "fill": "rgb(200,200,200)",
        "r": 5
    };
    var buttonSelectedAttr = {
        "stroke": "red",
        "stroke-width": 4
    };
    var beforeAfterAttr = {
        "stroke": "rgb(200,200,200)",
        "stroke-width": 2
    };
    var arrowAttr = {
        "stroke": "black",
        "stroke-width": 1,
        "fill": "none"
    };
    var shapeRadius = 22;
    var buttonMargin = 8;
    var frameMargin = buttonSelectedAttr["stroke-width"] / 2;
    var marginY = 10;
    var slotsHeight = 2*shapeRadius + buttonMargin + 2*frameMargin;
    var shapeWidth = 2 * shapeRadius;
    var marginX = 12;
    var slotWidth = shapeWidth + 2 * marginX;
    var shapeColors = {
        triangle: 'blue',
        diamond: 'red',
        rectangle: 'lime',
        circle: 'grey',
        star: 'yellow',
        reverseTriangle: 'pink',
        pentagon: 'purple',
        roundedRectangle: 'green', // FUTURE: not in use at the moment
        hexagon: 'brown',
        ellipse: 'orange',
        squareStar: 'olive'
    };

    var textAttr = {
        "font-size": 16
    };

    var shapeContainers = { // width field is computed later
        all: {
            target: 'allShapes',
            height: slotsHeight+2*marginY
        },
        origin: {
            target: 'originShapes',
            height: slotsHeight+2
        },
        target: {
            target: 'targetShapes',
            height: slotsHeight+2
        }
    };
    var pair = [];
    var papers = [];
    var frame;
    var raphShapes = {};
    var beforeAfter = [];
    var beforeAfterPos = [];
    var nReplaced;

    subTask.loadLevel = function(curLevel) {
       level = curLevel;
    };

    subTask.getStateObject = function() {
       return state;
    };

    subTask.reloadAnswerObject = function(answerObj) {
       answer = answerObj;
    };

    subTask.resetDisplay = function() {
        initAllShapes();
        hideTaskProcess();
    };

    subTask.getAnswerObject = function() {
       return answer;
    };

    subTask.getDefaultAnswerObject = function() {
       var defaultAnswer = {
           tracks: []
       };
       return defaultAnswer;
    };

    subTask.unloadLevel = function(callback) {
       destroyShapes();
       callback();
    };

    function getResultAndMessage() {
       if (checkTask()) {
          return {
             successRate: 1,
             message: taskStrings.success
          };
       }
       return {
          successRate: 0,
          message: taskStrings.error
       };
    }

    subTask.getGrade = function(callback) {
       callback(getResultAndMessage());
    };


    function initAllShapes() {
        $.each(shapeContainers, function(name, c) {
            c.width = data[level][name].length * slotWidth;
            papers[name] = subTask.raphaelFactory.create(c.target, c.target, c.width, c.height);
            raphShapes[name] = [];
        });

        $.each(shapeContainers, function(name, c) {
            drawShapes(name, c, data[level][name]);
            if (getResult(answer.tracks)) {
                drawShapes('origin', {
                    target: 'originShapes'
                }, getResult(answer.tracks));
            }
        });
        initBeforeAfter();
        initUndo();
    };

    function initBeforeAfter() {
        var w = slotWidth+2*marginX;
        var h = slotWidth;
        var paperH = 2*h + 55 + 2*textAttr["font-size"];
        var yText_1 = textAttr["font-size"]/2;
        var yText_2 = yText_1 + h + 38 + textAttr["font-size"];
        var yText = [ yText_1, yText_2 ];
        var y = [ (yText_1 + 2*marginY), (yText_2 + 2*marginY) ];
        var x = marginX;
        papers['beforeAfter'] = subTask.raphaelFactory.create("beforeAfter", "beforeAfter", w, paperH);
        for(var iFrame = 0; iFrame < 2; iFrame++){
            var text = (iFrame == 0) ? taskStrings.before : taskStrings.after;
            papers['beforeAfter'].rect(x,y[iFrame],slotWidth,h).attr(beforeAfterAttr);
            papers['beforeAfter'].text(x+slotWidth/2,yText[iFrame],text).attr(textAttr);
            beforeAfterPos[iFrame] = [ (x + slotWidth/2), (y[iFrame] + h/2) ];
        }
    };

    function initUndo() {
        $('#undo').val(taskStrings.undo);
        $('#undo').off("click");
        $('#undo').click(undo);
    };

    function drawShapes(name, container, data) {
        var w = container.width;
        var h = container.height;
        var buttonW = shapeWidth + 2*buttonMargin;
        var buttonH = shapeWidth + 2*buttonMargin;
        papers[name].clear();
        $.each(data, function(i, shape) {
           var x = shapeRadius + marginX + i * slotWidth;
           var y = shapeRadius + frameMargin + marginY;
            var shapePath = getShapes(shape, papers[name], x, y, shapeRadius).attr({
                fill: shapeColors[shape]
            });
            raphShapes[name][i] = { "obj":shapePath, "type":shape };
            if(name == "all") {
                var button = papers[name].rect(x-buttonW/2,y-buttonH/2,buttonW,buttonH).attr(buttonAttr).toBack();
                var set = papers[name].set(button,shapePath).attr({"cursor":"pointer"});
                
                set.touchstart(function(ev){
                    // console.log(ev);
                    set.unmousedown();
                    clickShape(shape);
                });
                set.mousedown(function(ev){
                    // console.log(ev);
                    clickShape(shape);
                });
            }else{
                var set = papers[name].set(shapePath);
            }
        });
    }

    function getShapes(shape, paper, x, y, radius) {
        if (shape === 'circle') {
            return paper.circle(x, y, radius - 1);
        } else if (shape === 'ellipse') {
            return paper.ellipse(x, y, radius / 1.5, radius - 1);
        } else {
            return paper.path(getShapePath(shape, x, y, radius));
        }
    }

    function destroyShapes() {
        if (papers.length > 0) {
            $.each(shapeContainers, function(name, c) {
                papers[name].clear();
            });
        }
    }

    function clickShape(shape) {
        removeComment();
        $.each(pair, function(i, p) {
            if (p === shape) {
                return;
            }
        });

        if (pair.length < 2) {
            addFrame(shape);
            pair.push(shape);
            hideTaskProcess();
        }

        addBeforeAfter(pair);
        if (pair.length === 2) {
            replaceShape(pair);
            showTaskProcess();
            if(frame) frame.remove();
            pair = [];
        }
    };

    function addFrame(shape){
        if(frame) {
           frame.remove();
        }
        var numShape = 0;
        for(var iShape = 0; iShape < raphShapes["all"].length; iShape++){
            if(raphShapes["all"][iShape].type == shape) {
               sh = raphShapes["all"][iShape].obj;
               numShape = iShape;
            }
        }
        var slotsWidth = shapeContainers.origin.width;
        var x = shapeRadius + marginX + numShape * slotWidth-shapeRadius-buttonMargin-frameMargin;
        var y = shapeRadius + frameMargin + marginY-shapeRadius-buttonMargin-frameMargin;
        var w = 2 * (shapeRadius + frameMargin + buttonMargin);
        var h = w;
        frame = papers["all"].rect(x,y,w,h,5).attr(buttonSelectedAttr).toBack();
    };

    function addBeforeAfter(pair) {
        for(var iShape = 0; iShape < 2; iShape++){
            if(beforeAfter[iShape]) {
               beforeAfter[iShape].remove();
            }
        }
        for(var iShape = 0; iShape < pair.length; iShape++){
            var x = beforeAfterPos[iShape][0];
            var y = beforeAfterPos[iShape][1];
            beforeAfter[iShape] = getShapes(pair[iShape], papers["beforeAfter"], x, y, shapeRadius).attr({ fill: shapeColors[pair[iShape]] });
        }
    };

    function replaceShape(pair) {
        var duration = 500;
        answer.tracks.push({
            pair: pair
        });
        nReplaced = 0;
        for(var iShape = 0; iShape < raphShapes["origin"].length; iShape++){
            if(pair[0] == raphShapes["origin"][iShape].type){
                nReplaced++;
                var fadeOut = Raphael.animation({"opacity":0},duration,fadeIn(iShape,pair[1]));
                subTask.raphaelFactory.animate("fadeOut",raphShapes["origin"][iShape].obj,fadeOut);
            }
        }
        var sameShape = (pair[0] == pair[1]);
        showComment(taskStrings.replacedShape(nReplaced, sameShape));
    };

    function fadeIn(iShape, newShape){
        return function(){
            var duration = 500;
            var slotsWidth = shapeContainers.origin.width;
            var x = shapeRadius + marginX + iShape * slotWidth;
            var y = shapeRadius + frameMargin + marginY;
            var shapePath = getShapes(newShape, papers["origin"], x, y, shapeRadius).attr({ fill: shapeColors[newShape] });
            var fadeIn = Raphael.animation({"opacity":1},duration);
            raphShapes["origin"][iShape] = { "obj":shapePath, "type":newShape };
            papers["origin"].set().push(shapePath).attr("opacity",0);
            subTask.raphaelFactory.animate("fadeIn",shapePath,fadeIn);
        }
    };

    function undo() {
    	  removeComment();
        hideTaskProcess();
        if(pair.length == 1){
            pair = [];
            if (frame) frame.remove();
        }else if (answer.tracks.length > 0 && papers["origin"].width != null) {
            var track = answer.tracks[answer.tracks.length - 1];
            track.pair.pop();
            pair = track.pair;
            answer.tracks.pop();
            drawShapes('origin', {
                target: 'originShapes'
            }, getResult(answer.tracks));
            pair = [];
        }
        if (answer.tracks.length === 0) {
            pair = [];
        }
        addBeforeAfter(pair);
    };

    function showComment(string) {
        $("#comment").html(string);
    };

    function removeComment() {
        $("#comment").html("");
    };

    function checkTask() {
        if (!getResult(answer.tracks)) {
            return false;
        }

        var isMatched = true;
        $.each(data[level].target, function(index, target) {
            if (getResult(answer.tracks)[index] !== target) {
                isMatched = false;
            }
        });
        return isMatched;
    }

    function getResult(tracks) {
        var result = [];
        $.each(data[level].origin, function(index, origin) {
            result.push(origin);
        });
        $.each(tracks, function(index, track) {
            $.each(result, function(i, r) {
                if (r === track.pair[0]) {
                    result[i] = track.pair[1];
                }
            });
        });

        return result;
    }

    function showTaskProcess(){
        $('#taskProcess').css("visibility","visible");
    };

    function hideTaskProcess(){
        $('#taskProcess').css("visibility","hidden");
    };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
