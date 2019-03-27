function Scale(paper,left,top,width,height,compareFct) {
    this.color = "#000000";
    this.baseThickness = 5;
    this.axisThickness = 5;
    this.panThickness = 5;
    this.panWidth = width/3;
    this.panHeight = height/2.5;
    this.panTextAttr = { "font-size" : 16, "font-weight": "bold", "fill": "green" };
    this.balanceTopWidth = width-this.panWidth;
    this.base = paper.rect(left,top+height,width,this.baseThickness);
    this.axis = paper.rect(left + width/2, top, this.axisThickness, height);
    this.balanceBody = paper.set(this.base,this.axis).attr("fill", this.color);
    this.center = [left + width/2, top];
    this.balanceTop = paper.rect(left+this.panWidth/2,top,width-this.panWidth, 2).attr("fill", this.color);

    paper.setStart();
    paper.path("M"+(left+this.panWidth/2)+" "+top+"L"+left+" "+(top+height-this.panHeight));
    paper.path("M"+(left+this.panWidth/2)+" "+top+"L"+(left+this.panWidth)+" " +(top+height-this.panHeight));
    paper.rect(left,(top+height-this.panHeight),this.panWidth,this.panThickness).attr("fill", this.color);
    paper.text(left+this.panWidth/2,top+height-this.panHeight+this.panTextAttr["font-size"]+10,"").attr(this.panTextAttr);
    this.leftPan = paper.setFinish();

    paper.setStart();
    paper.path("M"+(left+width-this.panWidth/2)+" "+top+"L"+(left+width)+" "+(top+height-this.panHeight));
    paper.path("M"+(left+width-this.panWidth/2)+" "+top+"L"+(left+width-this.panWidth)+" "+(top+height-this.panHeight));
    paper.rect((left+width-this.panWidth),(top+height-this.panHeight),this.panWidth,this.panThickness).attr("fill", this.color);
    paper.text(left+width-this.panWidth/2,top+height-this.panHeight+this.panTextAttr["font-size"]+10,"").attr(this.panTextAttr);
    this.rightPan = paper.setFinish();

    this.load = new Array(2);

    this.getPanPos = function() {
        var pos = {
            "left" : { "x" : left+this.panWidth/2, "y" : top+height-this.panHeight },
            "right" : { "x" : left+width-this.panWidth/2, "y" : top+height-this.panHeight }
        };
        return pos;
    };

    this.setLoad = function(side,id,raphObj) {
        this.load[side] = {
            "id" : id,
            "raphObj" : raphObj
        };
    };

    this.removeLoad = function(side) {
        this.load[side] = null;
    };

    this.isOnPan = function(id) {
        for(var iPan = 0; iPan < 2; iPan++){
            if(this.load[iPan] && this.load[iPan].id == id){
                return iPan;
            }
        }
        return false;
    };

    this.checkLoad = function() {
        for(var iPan = 0; iPan < 2; iPan++){
            if(!this.load[iPan]){
                return false;
            }
        }
        return true;
    };

    this.compare = function() {
        var res = new Array(3);
        res[0] = this.load[0].id;
        res[1] = this.load[1].id;
        var result = compareFct(res[0], res[1]);
        if(result > 0) {
            this.lean("left");
            this.setPanText(taskStrings.heavier,taskStrings.lighter);
        }else if(result < 0) {
            this.lean("right");
            this.setPanText(taskStrings.lighter,taskStrings.heavier);
        }else {
            this.backInPlace();
            this.setPanText(taskStrings.sameWeight,taskStrings.sameWeight);
        }
        res[2] = result;
        return res;
    };

    this.lean = function(side) {
        var angle = side == "right" ? 10 : -10;
        var toRadian = Math.PI / 180;
        var move = [(1-Math.cos(angle * toRadian))*this.balanceTopWidth/2,
                Math.sin(angle * toRadian) *this.balanceTopWidth/2];
        var topRot = { "transform" : "R" + angle + "," + this.center[0] + "," + this.center[1]};
        var leftTrans = { "transform" : "T" + (-move[0]) + "," + (-move[1])};
        var rightTrans = { "transform" : "T" + move[0] + "," + move[1]};
        var topRotAnim = new Raphael.animation(topRot,500,"<");
        var leftTransAnim = new Raphael.animation(leftTrans,500,"<");
        var rightTransAnim = new Raphael.animation(rightTrans,500,"<");
        this.balanceTop.animate(topRotAnim);
        this.leftPan.animate(leftTransAnim);
        this.rightPan.animate(rightTransAnim);
        this.load[0].raphObj.animate(leftTransAnim);
        this.load[1].raphObj.animate(rightTransAnim);
    };

    this.backInPlace = function() {
        var topRot = { "transform" : "R0," + this.center[0] + "," + this.center[1]};
        var trans = { "transform" : "T0,0"};
        var topRotAnim = new Raphael.animation(topRot,500,"<");
        var transAnim = new Raphael.animation(trans,500,"<");
        this.balanceTop.animate(topRotAnim);
        this.leftPan.animate(transAnim);
        this.rightPan.animate(transAnim);
        if(this.load[0]){ this.load[0].raphObj.animate(transAnim); }
        if(this.load[1]){ this.load[1].raphObj.animate(transAnim); }
        this.setPanText("","");
    };

    this.setPanText = function(leftText,rightText) {
      if((Beav.Navigator.isIE8())){
         this.leftPan[4].remove();
         this.leftPan[4] = paper.text(left+this.panWidth/2,top+height-this.panHeight+this.panTextAttr["font-size"]+10,leftText).attr(this.panTextAttr);
         this.rightPan[4].remove();
         this.rightPan[4] = paper.text(left+width-this.panWidth/2,top+height-this.panHeight+this.panTextAttr["font-size"]+10,rightText).attr(this.panTextAttr);
        }else{
         this.leftPan[3].attr("text",leftText);
         this.rightPan[3].attr("text",rightText);
        }
    };
};