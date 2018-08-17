function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;

   var canvas;
   var canvasCtx;
   var imageData;
   var width;
   var height;

   var sizes = [[50, 50], [100, 100], [200, 200], [400, 400], [600, 600]];

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      displayHelper.hideValidateButton = true;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initSizes();
      initCanvas();
      initButton();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return {};
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   subTask.getGrade = function(callback) {
      callback({
         successRate: 0
      });
   };

   function initSizes() {
      $("#sizeList").empty();
      for(var iSize in sizes) {
         var curWidth = sizes[iSize][0];
         var curHeight = sizes[iSize][1];
         $("#sizeList").append("<option value=\"" + iSize + "\">" + curWidth + " x " + curHeight + "</option>");
      }
      $("#sizeList").unbind("change");
      $("#sizeList").change(function(ev){
         var index = $("#sizeList").val();
         width = sizes[index][0];
         height = sizes[index][1];
         initCanvas();
      });
      width = sizes[0][0];
      height = sizes[0][1];
   }

   function initCanvas() {
      canvas = document.getElementById("canvas");
      canvas.width = width;
      canvas.height = height;
      canvasCtx = canvas.getContext("2d");

      var image = document.getElementById("beaver");
      canvasCtx.drawImage(image, 0, 0, width, height);
      imageData = canvasCtx.getImageData(0, 0, width, height);
   }

   function initButton() {
      $("#execute").unbind("click");
      $("#execute").click(clickChange);
   }

   function clickChange() {
      invertImageData();
      writeCanvas();
   }

   function invertImageData() {
      // Each pixel is 4 values: RGBA.
      for(var index = 0; index < imageData.data.length; index += 4) {
         imageData.data[index] = 255 - imageData.data[index];
         imageData.data[index + 1] = 255 - imageData.data[index + 1];
         imageData.data[index + 2] = 255 - imageData.data[index + 2];
      }
   }

   function writeCanvas() {
      canvasCtx.putImageData(imageData, 0, 0);
   }
}
initWrapper(initTask, ["easy", "medium", "hard"]);
