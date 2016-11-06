function initTask() {
   var gridWidth = 15;
   var posParasols = [];
   var solved = false;
   var isLoaded = false;
   var n_parasols = 7;
   var para_attr = [
       ["#ff7f27", 110, 40],
       ["#b5e61d", 200, 50],
       ["#ed1c24", 80, 40],
       ["#00a2e8", 140, 50],
       ["#22b14c", 110, 40],
       ["#b8b8b8", 170, 40],
       ["#ffaec9", 50, 60]
     ];
   var para_init_pos = [
       [60, 100],
       [165, 170],
       [270, 100],
       [345, 130],
       [420, 60],
       [525, 150],
       [630, 70]
     ];
   var parasols = [null, null, null, null, null, null, null];
   var success_message = 'Bravo, tous les parasols sont plantés sur le sable.';

   function moveTo(iParasol, set, x, y) {
      posParasols[iParasol] = [x,y];
      for (var iElem = 0; iElem < set.length; iElem++) {
         var el = set[iElem];
         el.transform(el.origTransform + 'T' + x + ',' + y);
      }
   }

   function drawParasol(paper, color, width, height) {
     var handle = paper.rect(- 1, 14, 3, 10000);
     handle.attr({fill: "black"});
     paper.setStart();
     var main = paper.path("m 356,686.8 c 0,0 -101.7,-57.2 -177.6,-1 -64.5,-35.8 -97.5,-37 -176.3,0 C 82.1,600.7 178.3,516.5 354.6,516.5 c 176.3,0 278.1,84.2 352.6,169.3 -113.3,-66.5 -176.3,0 -176.3,0 -57.8,-25.3 -93.5,-47.1 -176.9,1.0");
     var bl = paper.path("m 178.3,685.8 c 0,0 36.7,-142.7 176.3,-169.3");
     var br = paper.path("m 530.8,685.8 c 0,0 -24.5,-152.7 -176.3,-169.3");
     var top = paper.setFinish();
     top.attr({
       fill: color,
       "stroke-width": '2'
     });
     top.transform('S' + (1.06 * width / 750) + ',' + (0.2 * height / 50) + ',0,0T' + (-width / 2) + ',' + (-90 + (50 - height) * 2.065));

     var hat = paper.path("m 336,515 c 0,0 16.5,-33.5 37.5,-0.5");
     hat.attr({
       "stroke-width": '2'
     });
     hat.transform('S' + (1.06 * width / 750) + ',0.2,0,0T' + (-width / 2) + ',-90');

     var parasol = paper.set();
     parasol.push(main);
     parasol.push(br);
     parasol.push(bl);
     parasol.push(hat);
     for (var iElem = 0; iElem < parasol.length; iElem++) {
        var el = parasol[iElem];
        el.origTransform = el.transform();
     }
     parasol.push(handle);
     return {
       el: parasol,
       main: main,
       handle: handle
     };
   }

   //TODO: quand on affiche la solution, de nouveaux parasols sont affichés
   // par dessus l'image de la solution

   task.load = function(views, callback) {
     if (isLoaded)
       return;
     isLoaded = true;
     interval = setInterval(function() {  task.checkCollisions(true); }, 1000);
     paper = Raphael(document.getElementById('beach'));

     // delimiters
     border_left = paper.path("M70,355 L70,325");
     border_right = paper.path("M382,355 L382,325");
     border_left.attr("stroke-width", 4);
     border_left.attr("opacity", 0);
     border_right.attr("stroke-width", 4);
     border_right.attr("opacity", 0);
     
     // beach
     var bottom = paper.height;
     paper.rect(0,bottom-8,paper.width,8)
       .attr({stroke:'none', fill:'#AAAAFF'});
     paper.path('M68,355 C47,295 405,297 384,355')
       .attr({stroke:'none', fill:'#EDF000'});

     // parasols
     for(var i = 0 ; i < n_parasols; i++) {
       parasols[i] = drawParasol(paper, para_attr[i][0], para_attr[i][1], para_attr[i][2]);
       moveTo(i, parasols[i].el, para_init_pos[i][0], para_init_pos[i][1]);
       posParasols[i] = [0, 0];
       drag(i, parasols[i]);
     }

     reset();
     callback();
   };

   task.unload = function(callback) {
      interval = clearInterval(interval);
      isLoaded = false;
      $('#beach').html('');
      callback();
   };

   task.reloadAnswer = function(strAnswer, callback) {
      solved = false;
      reset();
      if (strAnswer == "[]") {
          strAnswer = "";
      }
      if (strAnswer == "") {
         posParasols = [];
         for (var iParasol = 0; iParasol < n_parasols; iParasol++) {
            posParasols[iParasol] = [0, 0];
         }
      } else {
         posParasols = $.parseJSON(strAnswer);
      }
      for (var iParasol = 0; iParasol < n_parasols; iParasol++) {
         moveTo(iParasol, parasols[iParasol].el, posParasols[iParasol][0], posParasols[iParasol][1]);
      }
      checkSuccess();
      callback();
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify(posParasols));
   }; 

   function reset() {
     $("#info, #success, #error").html("");
   }

   function collideBBox(a, b) {
     a = a.getBBox();
     b = b.getBBox();
     return !(a.x > b.x2 || a.x2 < b.x ||
              a.y > b.y2 || a.y2 < b.y)
   }

   function collideEllipse(a, b) {
     if(!collideBBox(a, b)) {
       return false;
     }

     a = a.getBBox();
     a = {x: a.x, x2: a.x2, y: a.y, y2: a.y2};
     b = b.getBBox();
     b = {x: b.x, x2: b.x2, y: b.y, y2: b.y2};

     radius = (a.x2 - a.x) / 2.0;
     height = (a.y2 - a.y);

     // Transform to unit circle
     a.y  /= height;
     a.y2 /= height;
     b.y  /= height;
     b.y2 /= height;
     a.x  /= radius;
     a.x2 /= radius;
     b.x  /= radius;
     b.x2 /= radius;

     // Center circle to origin
     b.y -= (a.y + 1);
     b.y2 -= (a.y + 1);
     b.x -= (a.x + 1);
     b.x2 -= (a.x + 1);

     // If circle is inside rectangle
     if(b.x <= 0 && b.x2 >=0 && b.y <= 0 && b.y2 >= 0) {
       return true;
     }

     if( b.x <= 0 && b.x2 >= 0 && Math.abs(b.y) <= 1
      || b.x <= 0 && b.x2 >= 0 && Math.abs(b.y2) <= 1
      || b.y <= 0 && b.y2 >= 0 && Math.abs(b.x) <= 1
      || b.y <= 0 && b.y2 >= 0 && Math.abs(b.x2) <= 1) {
        return true;
      }

     if( b.x * b.x + b.y * b.y <= 1
      || b.x2 * b.x2 + b.y * b.y <= 1
      || b.x2 * b.x2 + b.y2 * b.y2 <= 1
      || b.x * b.x + b.y2 * b.y2 <= 1) {
        return true;
      }
      return false;
   }


   function collideWithAny(i) {
     var parasol = parasols[i];
     for(var j = 0; j < n_parasols; j++) {
       if(i == j) continue;
     }
     return false;
   }

   task.checkCollisions = function(draw) {
      var hasCollision = false;
      var colliding = paper.set();
      for(var par1 = 0; par1 < n_parasols; par1++) {
         var parasol1 = parasols[par1];
         for(var par2 = 0; par2 < n_parasols; par2++) {
            if (par1 == par2) {
               continue;
            }
            var parasol2 = parasols[par2];
            if((collideEllipse(parasol1.main, parasol2.main) && collideEllipse(parasol2.main, parasol1.main))
                || collideBBox(parasol1.main, parasol2.handle)
                || collideBBox(parasol2.main, parasol1.handle)) {
            } else {
               continue;
            }
            hasCollision = true;
            colliding.push(parasol1.el);
            break;
         }
      }
      if (draw) {
         colliding.animate({ opacity : 0.3 }, 500, function() {
            colliding.animate({ opacity : 1 }, 500, function() {
            });
         });
      }
      return hasCollision;
   }

   function boundX(iParasol) {
     var parasol = parasols[iParasol];

     var x = parasol.handle.getBBox().x;
     var startX = x;
     if (x < 0) {
        x = 0;
     }
        
     if (x > 700) {
        x = 700;
     }
     
     if(iParasol > 0) {
       var left = parasols[iParasol-1];
       if(left.handle.getBBox().x + gridWidth > x) {
          x = left.handle.getBBox().x + gridWidth;
       }
     }

     if(iParasol < n_parasols - 1) {
        var right = parasols[iParasol+1];
        if(x > right.handle.getBBox().x - gridWidth) {
          x = right.handle.getBBox().x - gridWidth;
        }
     }
     return x - startX;
   }

   function boundY(iParasol) {
     var parasol = parasols[iParasol];

     var y = parasol.handle.getBBox().y;
     var startY = y;
     if (y < 20) {
        y = 20;
     }
        
     if (y > 300) {
        y = 300;
     }
     return y - startY;
   }

   task.checkAllOnBeach = function() {
       var last = border_left.getBBox().x
       for(var iPar = 0; iPar < n_parasols; iPar++) {
         if(!(last < parasols[iPar].handle.getBBox().x)) {
           return false;
         }
         last = parasols[iPar].handle.getBBox().x;
       }

       if(!(last <= border_right.getBBox().x2)) {
         return false;
       }
       return true;
   }

   function checkSuccess() {
       if (!task.checkAllOnBeach()) {
          $('#success').html("");
          return false;
       }
       if (task.checkCollisions(false)) {
          $('#success').html("");
          return false; 
       }
       solved = true;
       $('#reset').hide();
       $('#success').html(success_message);
       return true;
   }

   function drag(iParasol, parasol) {
     lx = 0,
     ly = 0,
     ox = 0,
     oy = 0,
     moveFnc = function(dx, dy) {
       if (solved) {
          return;
       }
       var nlx = Math.round((dx + ox) / gridWidth) * gridWidth;
       var nly = dy + oy;
       moveTo(iParasol, parasol.el, nlx, nly);
       nlx += boundX(iParasol);
       nly += boundY(iParasol);
       lx = nlx;
       ly = nly;
       moveTo(iParasol, parasol.el, nlx, nly);
     },
     startFnc = function() {
        ox = posParasols[iParasol][0];
        oy = posParasols[iParasol][1];
     },
     endFnc = function() {
       ox = lx;
       oy = ly;
       if (checkSuccess()) {
          platform.validate("done", function(){});
       }
     };
     for (iElem = 0; iElem < parasol.el.length; iElem++) {
        var elem = parasol.el[iElem];
        elem.origTransform = elem.transform();
     }
     parasol.el.drag(moveFnc, startFnc, endFnc);
   }
}
initTask();
