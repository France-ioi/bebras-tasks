function initTask(subTask) {

   subTask.gridInfos = {
      hideSaveOrLoad: false,
      actionDelay: 200,
      buttonHideInitialDrawing: true,
      buttonScaleDrawing: true,

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {
            //processing: ["popStyle", "pushStyle", "cursor", "focused", "width", "height", "arc", "ellipse", "line", "point", "quad", "rect", "triangle", "bezier", "bezierDetail", "bezierPoint", "bezierTangent", "curve", "curveDetail", "curvePoint", "curveTangent", "curveTightness", "ellipseMode", "noSmooth", "rectMode", "smooth", "strokeCap", "strokeJoin", "strokeWeight", "beginShape", "bezierVertex", "curveVertex", "endShape", "texture", "textureMode", "vertex", "shape", "shapeMode", "isVisible", "setVisible", "disableStyle", "enableStyle", "getChild", "print", "println", "applyMatrix", "popMatrix", "printMatrix", "pushMatrix", "resetMatrix", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "translate", "ambientLight", "directionalLight", "lightFalloff", "lightSpecular", "lights", "noLights", "normal", "pointLight", "spotLight", "beginCamera", "camera", "endCamera", "frustum", "ortho", "perspective", "printCamera", "printProjection", "modelX", "modelY", "modelZ", "screenX", "screenY", "screenZ", "ambient", "emissive", "shininess", "specular", "background", "colorMode", "fill", "noFill", "noStroke", "stroke", "alpha", "blendColor", "blue", "brightness", "color", "green", "hue", "lerpColor", "red", "saturation", "createImage", "image", "imageMode", "noTint", "tint", "resize", "blend", "copy", "filter", "get", "loadPixels", "pixels", "set", "updatePixels", "createGraphics", "beginDraw", "endDraw", "PFont_list", "createFont", "loadFont", "text_", "textFont", "textAlign", "textLeading", "textMode", "textSize", "textWidth", "textAscent", "textDescent"]
            processing: ["popStyle", "pushStyle", "arc", "ellipse", "line", "point", "rect", "triangle", "stroke", "noStroke", "strokeWeight", "fill","color", "print", "textWidth", "text_"],
            //"bezier", "bezierDetail", "bezierPoint", "bezierTangent", "curve", "curveDetail", "curvePoint", "curveTangent", "curveTightness", "ellipseMode", "noSmooth", "rectMode", "smooth", "strokeCap", "strokeJoin", "strokeWeight", "beginShape", "bezierVertex", "curveVertex", "endShape", "texture", "textureMode", "vertex", "shape", "shapeMode", "isVisible", "setVisible", "disableStyle", "enableStyle", "getChild", "print", "println", "applyMatrix", "popMatrix", "printMatrix", "pushMatrix", "resetMatrix", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "translate", "ambientLight", "directionalLight", "lightFalloff", "lightSpecular", "lights", "noLights", "normal", "pointLight", "spotLight", "beginCamera", "camera", "endCamera", "frustum", "ortho", "perspective", "printCamera", "printProjection", "modelX", "modelY", "modelZ", "screenX", "screenY", "screenZ", "ambient", "emissive", "shininess", "specular", "background", "colorMode", "fill", "noFill", "noStroke", "stroke", "alpha", "blendColor", "blue", "brightness", "color", "green", "hue", "lerpColor", "red", "saturation", "createImage", "image", "imageMode", "noTint", "tint", "resize", "blend", "copy", "filter", "get", "loadPixels", "pixels", "set", "updatePixels", "createGraphics", "beginDraw", "endDraw", "PFont_list", "createFont", "loadFont", "text_", "textFont", "textAlign", "textLeading", "textMode", "textSize", "textWidth", "textAscent", "textDescent"]
         },
         standardBlocks: {
            //wholeCategories: ["input", "logic", "loops", "math", "texts", "lists", "colour", "dicts", "variables", "functions"]
         }
      },
      maxInstructions: 100,
      checkEndEveryTurn: false,
      checkEndCondition: function(context, lastTurn) {
         return context.gradeDrawing(lastTurn)
      },
      gradingConfig: {
         drawingBias: 5,
         vlidateColors: true, 
         missedPixelsThreshold: 10, // percents
         extraPixelsThreshold: 10 // percents
      },      
      example: {
         blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="6P-G!a[HB3yg`(Dde[Ld" deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="stroke" id="(,K@f+uid48x]rhsUa9q"><value name="PARAM_0"><shadow type="math_number" id="RKdiI_J-(TBj)UaVY0jy"><field name="NUM">0</field></shadow><block type="color" id="3xp:`V(zl2:+_RCv};9{"><value name="PARAM_0"><shadow type="math_number" id="9Y-QU4+?u[s]Au#*-xQ{"><field name="NUM">255</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id=".FA[VW3uI6pe(@4w9~:p"><field name="NUM">1</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="|oqW-+1RJ+i!Y{xPAVDo"><field name="NUM">1</field></shadow></value></block></value><next><block type="line" id="ucXC:],Iw,4:8Hb92Fex"><value name="PARAM_0"><shadow type="math_number" id="{1p:S((j[U75j2K`cpMT"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="DvC+P.}Fw:kpm3,Fz2tB"><field name="NUM">60</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="kU9zm2li6bXFsq1k#?:2"><field name="NUM">300</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="(?{)6G?rG6n22Ot?0?aA"><field name="NUM">60</field></shadow></value><next><block type="line" id="NofL|e{cxP(hs2(_9!MN"><value name="PARAM_0"><shadow type="math_number" id="Dg}YZoG0SL1vV)iFq|?5"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="ORI|hoNsTOK7bSRFioCY"><field name="NUM">80</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="971803FQ:?tV7op,rs|v"><field name="NUM">300</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="mP(I=zks1a-nMX}[mm68"><field name="NUM">80</field></shadow></value><next><block type="line" id="3k2YRYLez}R==v7YO3YI"><value name="PARAM_0"><shadow type="math_number" id="jEbya-WLKn9we?P?!,L#"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="?FmSuxIfI*A*jFf,YKzD"><field name="NUM">100</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="@E[8780.L.QW@j*Sp4IB"><field name="NUM">300</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="`=]nX0Mk4Fe5TZ{n~fqi"><field name="NUM">100</field></shadow></value></block></next></block></next></block></next></block></next></block></xml>'
      },
      startingExample: {
         easy: {
            //blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="6P-G!a[HB3yg`(Dde[Ld" deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="stroke" id="(,K@f+uid48x]rhsUa9q"><value name="PARAM_0"><shadow type="math_number" id="RKdiI_J-(TBj)UaVY0jy"><field name="NUM">0</field></shadow><block type="color" id="3xp:`V(zl2:+_RCv};9{"><value name="PARAM_0"><shadow type="math_number" id="9Y-QU4+?u[s]Au#*-xQ{"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id=".FA[VW3uI6pe(@4w9~:p"><field name="NUM">0</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="|oqW-+1RJ+i!Y{xPAVDo"><field name="NUM">0</field></shadow></value></block></value><next><block type="line" id="ucXC:],Iw,4:8Hb92Fex"><value name="PARAM_0"><shadow type="math_number" id="{1p:S((j[U75j2K`cpMT"><field name="NUM">51</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="DvC+P.}Fw:kpm3,Fz2tB"><field name="NUM">21</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="kU9zm2li6bXFsq1k#?:2"><field name="NUM">99</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="(?{)6G?rG6n22Ot?0?aA"><field name="NUM">241</field></shadow></value><next><block type="line" id="NofL|e{cxP(hs2(_9!MN"><value name="PARAM_0"><shadow type="math_number" id="Dg}YZoG0SL1vV)iFq|?5"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="ORI|hoNsTOK7bSRFioCY"><field name="NUM">80</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="971803FQ:?tV7op,rs|v"><field name="NUM">300</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="mP(I=zks1a-nMX}[mm68"><field name="NUM">80</field></shadow></value><next><block type="line" id="3k2YRYLez}R==v7YO3YI"><value name="PARAM_0"><shadow type="math_number" id="jEbya-WLKn9we?P?!,L#"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="?FmSuxIfI*A*jFf,YKzD"><field name="NUM">100</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="@E[8780.L.QW@j*Sp4IB"><field name="NUM">300</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="`=]nX0Mk4Fe5TZ{n~fqi"><field name="NUM">100</field></shadow></value></block></next></block></next></block></next></block></next></block></xml>'

            blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="6P-G!a[HB3yg`(Dde[Ld" deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="stroke" id="(,K@f+uid48x]rhsUa9q"><value name="PARAM_0"><shadow type="math_number" id="RKdiI_J-(TBj)UaVY0jy"><field name="NUM">0</field></shadow><block type="color" id="3xp:`V(zl2:+_RCv};9{"><value name="PARAM_0"><shadow type="math_number" id="9Y-QU4+?u[s]Au#*-xQ{"><field name="NUM">255</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id=".FA[VW3uI6pe(@4w9~:p"><field name="NUM">0</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="|oqW-+1RJ+i!Y{xPAVDo"><field name="NUM">0</field></shadow></value></block></value><next><block type="line" id="ucXC:],Iw,4:8Hb92Fex"><value name="PARAM_0"><shadow type="math_number" id="{1p:S((j[U75j2K`cpMT"><field name="NUM">50</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="DvC+P.}Fw:kpm3,Fz2tB"><field name="NUM">20</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="kU9zm2li6bXFsq1k#?:2"><field name="NUM">100</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="(?{)6G?rG6n22Ot?0?aA"><field name="NUM">240</field></shadow></value><next><block type="stroke" id="LKA!0t=!./jBmEi7L~#g"><value name="PARAM_0"><shadow type="math_number" id="RKdiI_J-(TBj)UaVY0jy"><field name="NUM">0</field></shadow><block type="color" id="kywm1Rb?myH1lr~7nN?I"><value name="PARAM_0"><shadow type="math_number" id="Iu6!!reW@XOp,mlqWyph"><field name="NUM">33</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="r[LHU1qXG?ofr*HHY@ZF"><field name="NUM">128</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="t,Ypl4O20@MQ_vy-.CPC"><field name="NUM">33</field></shadow></value></block></value><next><block type="line" id="NofL|e{cxP(hs2(_9!MN"><value name="PARAM_0"><shadow type="math_number" id="Dg}YZoG0SL1vV)iFq|?5"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="ORI|hoNsTOK7bSRFioCY"><field name="NUM">80</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="971803FQ:?tV7op,rs|v"><field name="NUM">300</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="mP(I=zks1a-nMX}[mm68"><field name="NUM">80</field></shadow></value><next><block type="stroke" id="F~AZQbZqh_.V8IaWr!(d"><value name="PARAM_0"><shadow type="math_number" id="RKdiI_J-(TBj)UaVY0jy"><field name="NUM">0</field></shadow><block type="color" id="P2rs3Scq6SW0y8OXeb;X"><value name="PARAM_0"><shadow type="math_number" id=",|=:`x[zsRs=NpT(d)}:"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="b}{U:cM#=P:x4l0HIFgz"><field name="NUM">0</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="AH}XXI8Foh-W7PZUOo~Q"><field name="NUM">66</field></shadow></value></block></value><next><block type="line" id="3k2YRYLez}R==v7YO3YI"><value name="PARAM_0"><shadow type="math_number" id="jEbya-WLKn9we?P?!,L#"><field name="NUM">0</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id="?FmSuxIfI*A*jFf,YKzD"><field name="NUM">100</field></shadow></value><value name="PARAM_2"><shadow type="math_number" id="@E[8780.L.QW@j*Sp4IB"><field name="NUM">300</field></shadow></value><value name="PARAM_3"><shadow type="math_number" id="`=]nX0Mk4Fe5TZ{n~fqi"><field name="NUM">100</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>'
         }
      }
   };

   subTask.data = {
      easy: [
         {
            initialDrawing: function(p) {
               p.stroke(255,110,0);
               p.quad(238, 231, 286, 220, 269, 263, 230, 276);
               p.ellipse(256, 146, 30, 60);
               p.arc(250, 70, 80, 40, 0, Math.PI);
               p.arc(100, 70, 80, 40, Math.PI/2, 2*Math.PI);
               p.triangle(150, 150, 200, 150, 175, 200);
               p.stroke(255,0,0);
               p.line(50, 20, 100, 240);
               p.rect(20, 150, 100, 50);
            },
            //gradingConfig: ... // it can be overloaded here
         }
      ],
      medium: [
         {
            initialDrawing: function(p) {
               p.rect(20, 150, 120, 200);
            }
         }         
      ]
   };

   initBlocklySubTask(subTask);

/*
   // TODO: remove dev
   var answer = '[[1],[1,2],["test"],["ipsum","amet"]]';
   task.reloadAnswer(answer, function() {
         task.gradeAnswer(answer, '', function(res) {
            //alert(res)
         })
   })
*/
}

initWrapper(initTask, ['easy', 'medium'], null);

