var myCanvas;
var canvas2d;
var direction = 1;
var timeRun;
var snakes = new Array();
function SnakePosition (x,y){
    this.x = x;
    this.y = y;
};
var dataRect = new Array(50);
var dataColour = ["white","blue","black","red"];
var dataWidth;
var dataHeight;
function initDataSnake() {
    for(var y =0;y < dataRect.length;y++){
        dataRect[y]=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
            ,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
    for(var i=0;i<3;i++){
        var temp = new SnakePosition();
        temp.x = Math.floor(dataRect[0].length / 2 )+ i;
        temp.y = Math.floor(dataRect.length / 2 );
        snakes.push(temp);
    }
};
function loopFoods(){
    var tempX = Math.floor(Math.random()*50);
    var tempY = Math.floor(Math.random()*50);
    dataRect[tempY][tempX] = 1;
};
function transformSnakes(){
    //初始化snakes数据 如果有食物吃掉食物
    for(var i = 0;i<snakes.length;i++){
        if(dataRect[snakes[i].y][snakes[i].x] != 0){
            if(dataRect[snakes[i].y][snakes[i].x] == 1){
                document.getElementById("snakesMp3").play();
                //吃的
                var tempEnd = snakes[snakes.length-1];
                var tempEndLast = snakes[snakes.length-2];
                if(tempEnd.y == tempEndLast.y){
                    if(tempEnd.x > tempEndLast.x){
                        var temp = new SnakePosition();
                        temp.x = tempEnd.x +1;
                        temp.y = tempEnd.y;
                        if(temp.x > dataRect[0].length-1){
                            gameOver("吃了豆子后尾部超出范围");
                        }
                        snakes.push(temp);
                    }else{
                        var temp = new SnakePosition();
                        temp.x = tempEnd.x - 1;
                        temp.y = tempEnd.y;
                        if(temp.x < 0){
                            gameOver("吃了豆子后尾部超出范围");
                        }
                        snakes.push(temp);
                    }
                }else{
                    if(tempEnd.y > tempEndLast.y){
                        var temp = new SnakePosition();
                        temp.x = tempEnd.x;
                        temp.y = tempEnd.y + 1;
                        if(temp.y > dataRect.length-1){
                            gameOver("吃了豆子后尾部超出范围");
                        }
                        snakes.push(temp);
                    }else{
                        var temp = new SnakePosition();
                        temp.x = tempEnd.x;
                        temp.y = tempEnd.y - 1;
                        if(temp.y < 0){
                            gameOver("吃了豆子后尾部超出范围");
                        }
                        snakes.push(temp);
                    }
                }
                dataRect[snakes[i].y][snakes[i].x] = 0;
            }
        }
    }
    for(var i = 0;i < snakes.length; i++){
        if(dataRect[snakes[i].y][snakes[i].x] != 0){
            if(dataRect[snakes[i].y][snakes[i].x] == 2){
                gameOver("自已碰到自已游戏失败");
            }else if(dataRect[snakes[i].y][snakes[i].x] == 1){
                dataRect[snakes[i].y][snakes[i].x] = 2;
                console.log("当前蛇块吃完食物后再出现忽略掉");
            }else{
                console.log(snakes[i]+"未知BUG");
            }
        }else{
            dataRect[snakes[i].y][snakes[i].x] = 2;
        }
    }
    dataRect[snakes[0].y][snakes[0].x] = 3;
};
function drawDataRect(){
    canvas2d.clearRect(0,0,myCanvas.width,myCanvas.height);
    for(var y=0;y<dataRect.length;y++){
        for(var x = 0;x < dataRect[0].length;x++){
            if(dataRect[y][x] != 0){
                canvas2d.beginPath();
                canvas2d.strokeStyle="greenyellow";
                canvas2d.lineWidth=2;
                canvas2d.rect(x*dataWidth,y*dataHeight,dataWidth,dataHeight);
                canvas2d.fillStyle=dataColour[dataRect[y][x]];
                canvas2d.fillRect(x*dataWidth,y*dataHeight,dataWidth,dataHeight);
                canvas2d.closePath();
                canvas2d.stroke();
            }
        }
    }
};
function clearDataRect(){
    for(var i = 0 ; i < snakes.length; i++){
        dataRect[snakes[i].y][snakes[i].x] = 0;
    }
};
function directionMove() {
    var temp = new SnakePosition();
    switch (direction) {
        case 1:
            temp.x = snakes[0].x-1;
            temp.y = snakes[0].y;
            break;
        case 2:
            temp.x = snakes[0].x+1;
            temp.y = snakes[0].y;
            break;
        case 3:
            temp.x = snakes[0].x;
            temp.y = snakes[0].y-1;
            break;
        case 5:
            temp.x = snakes[0].x;
            temp.y = snakes[0].y+1;
            break;
    };
    if(temp.x >= 0 && temp.x < dataRect[0].length
        && temp.y >= 0 && temp.y < dataRect.length){
        snakes.unshift(temp);
        snakes.pop();
    }else{
        gameOver("超出界限游戏失败");
    }
};
function gameOver(message) {
    clearInterval(timeRun);
    setTimeout(function () {
        alert(message);
        window.location.reload();
    },500);
};
function loopDatas() {
    transformSnakes();
    drawDataRect();
    clearDataRect();
    directionMove();
};