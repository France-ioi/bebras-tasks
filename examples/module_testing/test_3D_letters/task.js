function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      basic: {
         initPos: [
            
         ],
         nbSpheres: 200
      },
      easy: {
         initPos: [
            { x: -80, y: -20 },
            { x: -70, y: -20 },
            { x: -60, y: -20 },
            { x: -90, y: -10 },
            { x: -50, y: -10 },
            { x: -90, y: 0 },
            { x: -80, y: 0 },
            { x: -70, y: 0 },
            { x: -60, y: 0 },
            { x: -50, y: 0 },
            { x: -90, y: 10 },
            { x: -50, y: 10 },
            { x: -90, y: 20 },
            { x: -50, y: 20 },

            { x: -20, y: -20 },
            { x: -10, y: -20 },
            { x: 0, y: -20 },
            { x: 10, y: -20 },
            { x: -20, y: -10 },
            { x: 20, y: -10 },
            { x: -20, y: 0 },
            { x: -10, y: 0 },
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: -20, y: 10 },
            { x: 20, y: 10 },
            { x: -20, y: 20 },
            { x: -10, y: 20 },
            { x: 0, y: 20 },
            { x: 10, y: 20 },

            { x: 60, y: -20 },
            { x: 70, y: -20 },
            { x: 80, y: -20 },
            { x: 90, y: -20 },
            { x: 50, y: -10 },
            { x: 50, y: 0 },
            { x: 50, y: 10 },
            { x: 60, y: 20 },
            { x: 70, y: 20 },
            { x: 80, y: 20 },
            { x: 90, y: 20 },

         ],
         // nbSpheres: 41
         nbSpheres: 200
      }
   };

   var paper;
   var paperW = 500;
   var paperH = 500;

   var marginX = 20;
   var marginY = 20;

   var circleR = 5;
   var maxR = Math.min(paperW/2,paperH/2);
   var x0 = paperW/2;
   var y0 = paperH/2;

   var nbSpheres;
   var initPos;
   var spherePos = [];
   var spheres = [];
   var overlay;

   var rotMatrix = [
         [1,0,0],
         [0,1,0],
         [0,0,1]
      ];

   var rng;

   var colors = {
      green: "#88BB88",
      darkGreen: "#508855",
      black: "#30242B",
      yellow: "#f5a623",
      grey: "#eaeaea",
      darkGrey: "#a6a6a6"
   };

   var circleAttr = {
      stroke: "none",
      fill: colors.black,
      r: circleR,
      opacity: 0.5
   };
   var overlayAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0
   };

   subTask.loadLevel = function(curLevel) {
      displayHelper.avatarType = "laptop";
      if(Beav.Navigator.supportsResponsive()){
         displayHelper.responsive = true;
      }else{
         displayHelper.responsive = false;
      }
      level = curLevel;

      initPos = data[level].initPos;
      nbSpheres = data[level].nbSpheres;

      rng = new RandomGenerator(subTask.taskParams.randomSeed);

      displayHelper.taskW = paperW;
      displayHelper.taskH = paperH;
      displayHelper.minTaskW = 500;
      displayHelper.maxTaskW = 900;

      initSpherePos();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
   };

   subTask.resetDisplay = function() {
      displayError("");
      initPaper();
      initHandlers();
      updateSpheres();
      
      displayHelper.customValidate = checkResult;
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = { 
         // shifts: Beav.Object.clone(initShifts)
      };

      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function getResultAndMessage() {
      var res = checkResult(true);
      return res
   };

   function initSpherePos() {
      var maxX = -maxR;
      var minX = maxR;
      var maxY = -maxR;
      var minY = maxR;
      for(var iSph = 0; iSph < initPos.length; iSph++){
         var { x, y } = initPos[iSph];
         do{
            var z = rng.nextInt(-maxR,maxR);
            var r = Math.sqrt(x*x + y*y + z*z);
         }while(r > maxR)
         spherePos.push({ x, y, z });
         maxX = Math.max(maxX,x);
         maxY = Math.max(maxY,y);
         minX = Math.min(minX,x);
         minY = Math.min(minY,y);
      }
      minX = minX - 2*marginX;
      minY = minY - 2*marginY;
      maxX = maxX + 2*marginX;
      maxY = maxY + 2*marginY;
      for(var iSph = initPos.length; iSph < nbSpheres; iSph++){
         var x, y, z;
         do{
            do{
               x = rng.nextInt(-maxR,maxR);
               y = rng.nextInt(-maxR,maxR);
            }while(x > minX && x < maxX && y > minY && y < maxY)
            z = rng.nextInt(-maxR,maxR);
            var r = Math.sqrt(x*x + y*y + z*z);
         }while(r > maxR)
         // do{
         //    var r = rng.nextInt(0,maxR);
         //    var long = rng.nextInt(0,359);
         //    var cola = rng.nextInt(0,180);
         //    var x = r*Math.sin(cola*Math.PI/180)*Math.cos(long*Math.PI/180)
         //    var y = r*Math.sin(cola*Math.PI/180)*Math.sin(long*Math.PI/180);
         //    var z = r*Math.cos(cola*Math.PI/180);
         //    var minD = Infinity;
         //    for(var jSph = 0; jSph < spherePos.length; jSph++){
         //       var pos = spherePos[jSph];
         //       var d = Beav.Geometry.distance(x,y,z,pos.x,pos.y,pos.z);
         //       if(d < minD){
         //          minD = d;
         //       }
         //    }
         // }while(minD < 2*circleR)
         spherePos[iSph] = { x, y, z };
         // console.log(x,y,z)
      }
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);
      overlay = paper.rect(0,0,paperW,paperH).attr(overlayAttr);
   };

   function initHandlers() {
      Beav.dragWithTouch(overlay, onMove, onStart, onEnd);
      overlay.attr("cursor","grab");
   };

   function onStart() {

   };

   function onMove(dx,dy,x,y,event) {
      if(Beav.Geometry.distance(0,0,dx,dy) < 1){
         return
      }

      getRotationMatrix(dx,dy);
      updateSpheres();
   };

   function onEnd() {
      for(var iSph = 0; iSph < nbSpheres; iSph++){
         var pos = spherePos[iSph];
         if(!pos){
            continue
         }
         var { cx, cy, cz } = getRotatedSpherePos(pos);
         pos.x = cx - x0;
         pos.y = cy - y0;
         pos.z = cz;
      }
   };

   function getRotationMatrix(dx,dy) {
      var u = Math.sqrt(dx*dx + dy*dy);
      var ux = dy/u;
      var uy = -dx/u;
      var angle = u*Math.PI/(2*maxR);
      var c = Math.cos(angle);
      var s = Math.sin(angle);

      var Rxx = ux*ux*(1 - c) + c;
      var Rxy = ux*uy*(1 - c);
      var Rxz = uy*s;
      var Ryx = ux*uy*(1 - c);
      var Ryy = uy*uy*(1 - c) + c;
      var Ryz = -ux*s;
      var Rzx = -uy*s;
      var Rzy = ux*s;
      var Rzz = c;

      rotMatrix = [
            [Rxx,Rxy,Rxz],
            [Ryx,Ryy,Ryz],
            [Rzx,Rzy,Rzz]
         ];
   };

   function updateSpheres() {
      for(var iSph = 0; iSph < nbSpheres; iSph++){
         var pos = spherePos[iSph];
         if(!pos){
            continue
         }
         var { cx, cy } = getRotatedSpherePos(pos);
         if(!spheres[iSph]){
            spheres[iSph] = paper.circle(cx,cy).attr(circleAttr);
         }else{
            spheres[iSph].attr({ cx, cy });
         }
      }
      overlay.toFront();
   };

   function getRotatedSpherePos(pos) {
      var { x, y, z } = pos;
      var cx = rotMatrix[0][0]*x + rotMatrix[0][1]*y + rotMatrix[0][2]*z + x0;
      var cy = rotMatrix[1][0]*x + rotMatrix[1][1]*y + rotMatrix[1][2]*z + y0;
      var cz = rotMatrix[2][0]*x + rotMatrix[2][1]*y + rotMatrix[2][2]*z;

      return { cx, cy, cz }
   };

   function checkResult(noVisual) {
      // console.log(gridContent)
	  // var decodedText = "";
     //  for(var row = 0; row < nbRows; row++){
     //     for(var col = 0; col < nbCol; col++){
     //        decodedText += gridContent[row][col];
     //     }
     //  }
	  // var hash = getHash(decodedText);
     //  if(hash != data[level].hash){
     //     var error = taskStrings.errorWrongMessage;
     //     if(!noVisual){
     //        displayError(error);
     //     }
     //     // console.error(row,col)
     //     return { successRate: 0, message: error }
     //  }

      if(!noVisual){
         platform.validate("done");
      }
      return { successRate: 1, message: taskStrings.success }
   };

   function displayError(msg) {
      displayHelper.displayError(msg);
   };

   $('#task').attr('alkindi', '');
}

initialLevel = "basic";
initWrapper(initTask, ["basic", "easy", /*"medium", "hard"*/]);
displayHelper.useFullWidth();
