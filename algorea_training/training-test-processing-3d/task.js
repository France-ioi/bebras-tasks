function initTask(subTask) {

   subTask.gridInfos = {
      hideSaveOrLoad: false,
      actionDelay: 200,
      buttonHideInitialDrawing: true,
      processing3D: true,
      buttonScaleDrawing: true,

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {
            processing: ["cursor", "focused", "width", "height", "arc", "ellipse", "line", "point", "quad", "rect", "triangle", "bezier", "bezierDetail", "bezierPoint", "bezierTangent", "curve", "curveDetail", "curvePoint", "curveTangent", "curveTightness", "box", "sphere", "sphereDetail", "ellipseMode", "noSmooth", "rectMode", "smooth", "strokeCap", "strokeJoin", "strokeWeight", "beginShape", "bezierVertex", "curveVertex", "endShape", "texture", "textureMode", "vertex", "shape", "shapeMode", "isVisible", "setVisible", "disableStyle", "enableStyle", "getChild", "print", "println", "applyMatrix", "popMatrix", "printMatrix", "pushMatrix", "resetMatrix", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "translate", "ambientLight", "directionalLight", "lightFalloff", "lightSpecular", "lights", "noLights", "normal", "pointLight", "spotLight", "beginCamera", "camera", "endCamera", "frustum", "ortho", "perspective", "printCamera", "printProjection", "modelX", "modelY", "modelZ", "screenX", "screenY", "screenZ", "ambient", "emissive", "shininess", "specular", "background", "colorMode", "fill", "noFill", "noStroke", "stroke", "alpha", "blendColor", "blue", "brightness", "color", "green", "hue", "lerpColor", "red", "saturation", "createImage", "image", "imageMode", "noTint", "tint", "resize", "blend", "copy", "filter", "get", "loadPixels", "pixels", "set", "updatePixels", "createGraphics", "beginDraw", "endDraw", "PFont_list", "createFont", "loadFont", "text_", "textFont", "textAlign", "textLeading", "textMode", "textSize", "textWidth", "textAscent", "textDescent"]
         },
         standardBlocks: {
            wholeCategories: ["input", "logic", "loops", "math", "texts", "lists", "colour", "dicts", "variables", "functions"]
         }
      },
      maxInstructions: 100,
      checkEndEveryTurn: false,
      checkEndCondition: function(context, lastTurn) {}
   };

   subTask.data = {
      easy: [
         {
            initialDrawing: function(processing) {
                processing.noStroke();
                processing.lights();
                processing.pushMatrix();
                processing.fill(255, 0, 0);
                processing.sphere(39.9);
                processing.translate(0, -60, 0);
                processing.fill(0, 255, 0);
                processing.sphere(19.9);
                processing.popMatrix();
                processing.fill(255, 255, 255);
            }
         }
      ]
   };

   initBlocklySubTask(subTask);
}

initWrapper(initTask, null, null);

