function Scale(paper, offset_scale) {
    paper.setStart();
    paper.rect(offset_scale + 100, yScale + 195, 300, 5);
    paper.rect(offset_scale + 247.5, yScale + 50, 5, 150);
    this.balanceBody = paper.setFinish().attr({
        fill: "#000000"
    });
    this.center = [offset_scale + 250, yScale + 50];

    this.balanceTop = paper.rect(offset_scale + 150, yScale + 49, 200, 2).attr({
        fill: "#000000"
    });

    paper.setStart();
    paper.path("M"+parseInt(offset_scale + 150)+" " + (yScale + 50) + "L"+parseInt(offset_scale + 100)+" " + (yScale + 150));
    paper.path("M"+parseInt(offset_scale + 150)+" " + (yScale + 50) + "L"+parseInt(offset_scale + 200)+" " + (yScale + 150));
    paper.rect(offset_scale + 100, yScale + 147.50, 100, 5).attr({
        fill: "#000000"
    });
    this.leftThing = paper.setFinish();

    paper.setStart();
    paper.path("M"+parseInt(offset_scale + 350)+" " + (yScale + 50) + "L"+parseInt(offset_scale + 300)+" " + (yScale + 150));
    paper.path("M"+parseInt(offset_scale + 350)+" " + (yScale + 50) + "L"+parseInt(offset_scale + 400)+" " + (yScale + 150));
    paper.rect(offset_scale + 300, yScale + 147.50, 100, 5).attr({
        fill: "#000000"
    });
    this.rightThing = paper.setFinish();
    //
    this.comparing = -1;
    this.clones = [];
}

Scale.prototype.cleanClones = function() {
   for (var iClone = 0; iClone < this.clones.length; iClone++) {
      var clone = this.clones[iClone];
      clone.remove();
   };
   this.clones = [];
}

Scale.prototype.compare = function compare(a, b, i) {
    if (a.weight > b.weight) {
      t = a;
      a = b;
      b = t;
    }
    // assume now a.weight < b.weight
    if (this.comparing == i){
        return;
    }
    if (this.comparing != -1) {
       this.cleanClones();
    }
    this.comparing = i;
    var rotation = 10;
    // if (a.weight > b.weight) rotation = -10;
    var toRadian = Math.PI / 180;
    var move = [-(1 - Math.cos(rotation * toRadian)) * 100,
                Math.sin(rotation * toRadian) * 100];

    this.clones.push(a.clone().attr({
        cx: offset_scale + 150,
        cy: yScale + 117.5,
        x : offset_scale + 150,
        y : yScale + 117.5 
    }));
    this.leftThing.push(this.clones[0]);
    this.clones.push(b.clone().attr({
        cx: offset_scale + 350,
        cy: yScale + 117.5,
        x: offset_scale + 350,
        y: yScale + 117.5
    }));
    this.rightThing.push(this.clones[1]);

    this.balanceTop.transform("R" + rotation + "," + this.center[0] + "," + this.center[1]);
    this.leftThing.transform("T" + (-move[0]) + "," + (-move[1]));
    this.rightThing.transform("T" + move[0] + "," + move[1]);
};

Scale.prototype.reset = function reset(i) {
    this.cleanClones();

    var rotation = 0;
    var toRadian = Math.PI / 180;
    var move = [-(1 - Math.cos(rotation * toRadian)) * 100, Math.sin(rotation * toRadian) * 100];
    this.balanceTop.transform("R" + rotation + "," + this.center[0] + "," + this.center[1]);
    this.leftThing.transform("T" + (-move[0]) + "," + (-move[1]));
    this.rightThing.transform("T" + move[0] + "," + move[1]);
    this.comparing = i;
};
