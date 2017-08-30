function initTask(subTask) {

   subTask.gridInfos = {
      hideSaveOrLoad: false,
      actionDelay: 200,
      buttonHideInitialDrawing: true,

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {
            processing: ["popStyle", "pushStyle", "cursor", "focused", "frameCount", "frameRate", "__frameRate", "width", "height", "resize", "arc", "ellipse", "line", "point", "quad", "rect", "triangle", "bezier", "bezierDetail", "bezierPoint", "bezierTangent", "curve", "curveDetail", "curvePoint", "curveTangent", "curveTightness", "box", "sphere", "sphereDetail", "ellipseMode", "noSmooth", "rectMode", "smooth", "strokeCap", "strokeJoin", "strokeWeight", "beginShape", "bezierVertex", "curveVertex", "endShape", "texture", "textureMode", "vertex", "shape", "shapeMode", "isVisible", "setVisible", "disableStyle", "enableStyle", "getChild", "print", "println", "applyMatrix", "popMatrix", "printMatrix", "pushMatrix", "resetMatrix", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "translate", "ambientLight", "directionalLight", "lightFalloff", "lightSpecular", "lights", "noLights", "normal", "pointLight", "spotLight", "beginCamera", "camera", "endCamera", "frustum", "ortho", "perspective", "printCamera", "printProjection", "modelX", "modelY", "modelZ", "screenX", "screenY", "screenZ", "ambient", "emissive", "shininess", "specular", "background", "colorMode", "fill", "noFill", "noStroke", "stroke", "alpha", "blendColor", "blue", "brightness", "color", "green", "hue", "lerpColor", "red", "saturation", "createImage", "image", "imageMode", "noTint", "tint", "blend", "copy", "filter", "get", "loadPixels", "pixels", "set", "updatePixels", "createGraphics", "createFont", "loadFont", "text_", "textFont", "textAlign", "textLeading", "textMode", "textSize", "textWidth", "textAscent", "textDescent"]
         },
         standardBlocks: {
            wholeCategories: ["input", "logic", "loops", "math", "texts", "lists", "colour", "dicts", "variables", "functions"]
         }
      },
      maxInstructions: 100,
      checkEndEveryTurn: false,
      checkEndCondition: function(context, lastTurn) {
         var success = context.checkCoveredColors([255, 0, 0], [0, 255, 0])
         if (!success[0] && !success[1]) {
            throw(strings.completelyWrong);
         } else if (!success[0]) {
            throw(strings.redLeft);
         } else if (!success[1]) {
            throw(strings.greenTouched);
         }
         throw(strings.drawingCorrect);
      }
   };

   subTask.data = {
      easy: [
         {
            initialDrawing: function(processing) {
               processing.noStroke();
               processing.fill(255, 0, 0);
               processing.ellipse(150, 180, 180, 180);
               processing.ellipse(70, 70, 100, 100);
               processing.ellipse(230, 70, 100, 100);
               processing.fill(255);
               processing.ellipse(150, 180, 150, 150);
               processing.fill(0, 255, 0);
               processing.ellipse(150, 180, 50, 50);
            }
         }
      ]
   };

   initBlocklySubTask(subTask);
}

initWrapper(initTask, null, null);
   
