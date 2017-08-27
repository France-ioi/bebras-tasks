function initTask(subTask) {

   subTask.gridInfos = {
      hideSaveOrLoad: false,
      actionDelay: 200,

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {
            processing: ["popStyle", "pushStyle", "cursor", "focused", "frameCount", "frameRate", "__frameRate", "width", "height", "resize", "arc", "ellipse", "line", "point", "quad", "rect", "triangle", "bezier", "bezierDetail", "bezierPoint", "bezierTangent", "curve", "curveDetail", "curvePoint", "curveTangent", "curveTightness", "box", "sphere", "sphereDetail", "ellipseMode", "noSmooth", "rectMode", "smooth", "strokeCap", "strokeJoin", "strokeWeight", "beginShape", "bezierVertex", "curveVertex", "endShape", "texture", "textureMode", "vertex", "shape", "shapeMode", "isVisible", "setVisible", "disableStyle", "enableStyle", "getChild", "print", "println", "applyMatrix", "popMatrix", "printMatrix", "pushMatrix", "resetMatrix", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "translate", "ambientLight", "directionalLight", "lightFalloff", "lightSpecular", "lights", "noLights", "normal", "pointLight", "spotLight", "beginCamera", "camera", "endCamera", "frustum", "ortho", "perspective", "printCamera", "printProjection", "modelX", "modelY", "modelZ", "screenX", "screenY", "screenZ", "ambient", "emissive", "shininess", "specular", "background", "colorMode", "fill", "noFill", "noStroke", "stroke", "alpha", "blendColor", "blue", "brightness", "color", "green", "hue", "lerpColor", "red", "saturation", "createImage", "image", "imageMode", "noTint", "tint", "blend", "copy", "filter", "get", "loadPixels", "pixels", "set", "updatePixels", "createGraphics", "createFont", "loadFont", "text", "textFont", "textAlign", "textLeading", "textMode", "textSize", "textWidth", "textAscent", "textDescent"]
         },
         standardBlocks: {
            includeAll: true
         }
      },
      maxInstructions: 100,
      checkEndEveryTurn: false,
      checkEndCondition: function(context, lastTurn) {
         var ops = [
            { func: 'fill', args: [0, 0, 0] },
            { func: 'ellipse', args: [150, 180, 180, 180] },
            { func: 'ellipse', args: [70, 70, 100, 100] },
            { func: 'ellipse', args: [230, 70, 100, 100] }
         ];
         if (context.processing.ops.length != ops.length) {
            throw(strings.drawingWrong);
         }
         for (var iOp = 0; iOp < context.processing.ops.length && iOp < ops.length; iOp++) {
            var cOp = context.processing.ops[iOp];
            if (cOp.func != ops[iOp].func || cOp.args.length != ops[iOp].args.length) {
               throw(strings.drawingWrong);
            }
            for (var iArg = 0; iArg < cOp.args.length && iOp < ops[iOp].args.length; iArg++) {
               if (cOp.args[iArg] != ops[iOp].args[iArg]) {
                  throw(strings.drawingWrong);
               }
            }
         }
         throw(strings.drawingCorrect);
      }
   };

   subTask.data = {
      easy: [
         {}
      ]
   };

   initBlocklySubTask(subTask);
}

initWrapper(initTask, null, null);
   
