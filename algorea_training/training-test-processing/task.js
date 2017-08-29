function initTask(subTask) {

   subTask.gridInfos = {
      hideSaveOrLoad: false,
      actionDelay: 200,

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
         var ops = [
            { block: 'fill', values: [0] },
            { block: 'ellipse', values: [150, 180, 180, 180] },
            { block: 'ellipse', values: [70, 70, 100, 100] },
            { block: 'ellipse', values: [230, 70, 100, 100] }
         ];
         if (context.processing.ops.length != ops.length) {
            throw(context.processing.ops.length > ops.length ? strings.drawingIndirect : strings.drawingWrong);
         }
         for (var iOp = 0; iOp < context.processing.ops.length && iOp < ops.length; iOp++) {
            var cOp = context.processing.ops[iOp];
            if (cOp.block != ops[iOp].block || cOp.values.length != ops[iOp].values.length) {
               throw(strings.drawingWrong);
            }
            for (var iArg = 0; iArg < cOp.values.length && iOp < ops[iOp].values.length; iArg++) {
               if (cOp.values[iArg] != ops[iOp].values[iArg]) {
                  throw(strings.drawingWrong);
               }
            }
         }
         throw(strings.drawingCorrect);
      }
   };

   subTask.data = {
      easy: [
         {
            initialDrawing: function(processing) {
               processing.fill(0);
               processing.ellipse(150, 180, 180, 180);
               processing.ellipse(70, 70, 100, 100);
               processing.ellipse(230, 70, 100, 100);
            }
         }
      ]
   };

   initBlocklySubTask(subTask);
}

initWrapper(initTask, null, null);
   
