var dataRect = new Array(18);
var dataRectTemp = new Array(18);
var totalClearCount = 0;
const dataColor = ["black","red","green","blue","beige","firebrick","greenyellow"];
var dataWidth ;
var dataHeight;
var timeRun;
var myCanvas;
var canvas2d;
var dataIndex = 0;
var positonY = 0;
var positonX ;
var isHasData = false;
var currentData;
var clearMp3 ;
var dataSquare = [];
dataSquare[0] = [
    [2,2],
    [2,2]
];
var dataLine = [];
dataLine[0] = [
    [3],
    [3],
    [3]
];
dataLine[1] = [
    [3,3,3]
];
var dataOne = [];
dataOne[0] = [
    [0,5,0],
    [5,5,5]
];
dataOne[1] = [
    [5,5,5],
    [0,5,0]
];
dataOne[2] = [
    [0,5],
    [5,5],
    [0,5]
];
dataOne[3] = [
    [5,0],
    [5,5],
    [5,0]
];
var dataTwo = [];
dataTwo[0] = [
    [5,5],
    [5,0],
    [5,0]
];
dataTwo[1] = [
    [5,5],
    [0,5],
    [0,5]
];
dataTwo[2] = [
    [5,0],
    [5,0],
    [5,5]
];
dataTwo[3] = [
    [0,5],
    [0,5],
    [5,5]
];
var dataThree = [];
dataThree[0] = [
    [6,0],
    [6,6],
    [0,6]
];
dataThree[1] = [
    [0,6],
    [6,6],
    [6,0]
];
var dataSix = [];
dataSix[0]=[
    [4,0,0],
    [4,4,4]
];
dataSix[1]=[
    [0,0,4],
    [4,4,4]
];
dataSix[2]=[
    [4,0],
    [4,0],
    [4,4]
];
dataSix[3]=[
    [0,4],
    [0,4],
    [4,4]
];
var dataServen = [];
dataServen[0]=[
    [1,1,1],
    [0,1,1]
];
dataServen[1]=[
    [1,1,0],
    [1,1,1]
];
var dataPluralisms = [dataSquare,dataLine,dataOne,dataTwo,dataThree,dataSix,dataServen];
function initDataRect() {
    for(let x=0;x<dataRect.length;x++){
        dataRect[x] = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
};
function saveTemp() {
    for(let x=0;x<dataRect.length;x++){
        dataRectTemp[x] = dataRect[x].concat();
    }
};
function revertTemp() {
    for(let x=0;x<dataRect.length;x++){
        dataRect[x] = dataRectTemp[x].concat();
    }
};
function timeRuning() {
    if(!isHasData){
        currentData = dataPluralisms[Math.floor(Math.random()*7)];
        positonY = 0;
        positonX = Math.floor(dataRect[0].length / 2) - 1;
        dataIndex = 0;
        isHasData = true;
    }
    downData();
};
function downData(){
    if(!isHasData){
        return;
    }
    if(checkData(dataRect)){
        changeData();
        drawData();
        saveTemp();
        clearTemp();
        positonY++;
        //positonY < dataRect.length
        if(checkData(dataRectTemp)){
            revertTemp();
        }else{
            isHasData = false;
            checkFull();
        }
    }else{
        if(positonY == 0){
            clearInterval(timeRun);
            alert("gameOver一共消灭了:"+totalClearCount);
            window.location.reload();
        }
        isHasData = false;
    }
};
function checkData(obj){
    if(positonY == dataRect.length){
        isHasData = false;
        return false;
    }
    let tempYY = currentData[dataIndex].length-1;
    for(let y = 0;y<currentData[dataIndex].length;y++){
        let tempY = positonY - y;
        for(let x = 0;x < currentData[dataIndex][0].length;x++ ){
            if(currentData[dataIndex][tempYY-y][x] != 0 && obj[tempY][positonX+x] != 0 ){
                return false;
            }
            if(positonX + x == obj[0].length-1){
                break;
            }
        }
        if(tempY == 0){
            return true;
        }
    }
    return true;
};
function changeData() {
    let tempYY = currentData[dataIndex].length-1;
    for(let y = 0;y<currentData[dataIndex].length;y++){
        let tempY = positonY - y;
        for(let x = 0;x < currentData[dataIndex][0].length;x++ ){
            if(currentData[dataIndex][tempYY-y][x] != 0){
                dataRect[tempY][positonX+x] = currentData[dataIndex][tempYY-y][x];
            }
            if(positonX + x == dataRect[0].length - 1){
                break;
            }
        }
        if(tempY == 0){
            break;
        }
    }
};
function drawData() {
    canvas2d.clearRect(0,0,myCanvas.width,myCanvas.height);
    for(let y=0;y<dataRect.length;y++){
        for(let x=0;x<dataRect[0].length;x++){
            canvas2d.fillStyle=dataColor[dataRect[y][x]];
            canvas2d.fillRect(x*dataWidth,y*dataHeight,dataWidth,dataHeight);
            canvas2d.stroke();
        }
    }
};
function moveLeft(){
    if(!isHasData){
        return;
    }
    if(positonX != 0){
        positonY--;
        positonX--;
        if(checkData(dataRect)){
            for(let y = 0;y < currentData[dataIndex].length;y++){
                let currentTemp = currentData[dataIndex][currentData[dataIndex].length-1][currentData[dataIndex][0].length-1];
                if(currentTemp != 0){
                    dataRect[positonY-y][positonX+currentData[dataIndex][0].length] = 0;
                }
                if(positonY-y == 0){
                    break;
                }
            }
            changeData();
            drawData();
            saveTemp();
            clearTemp();
            positonY++;
            if(checkData(dataRectTemp)){
                revertTemp();
            }else{
                isHasData = false;
                checkFull();
            }
        }else{
            positonY++;
            positonX++;
        }
    }
};
function tempRight(){
        for(let y = 0;y < currentData[dataIndex].length;y++){
            let currentTemp = currentData[dataIndex][currentData[dataIndex].length-1][0];
            if(currentTemp != 0){
                dataRect[positonY-y][positonX-1] = 0;
            }
            if(positonY-y == 0){
                break;
            }
        }
     changeData();
     drawData();
    saveTemp();
    clearTemp();
    positonY++;
    if(checkData(dataRectTemp)){
        revertTemp();
    }else{
        isHasData = false;
        checkFull();
    }
};
function moveRight() {
    if(!isHasData){
        return;
    }
    if(positonX < (dataRect[0].length-1)){
        positonY--;
        if(dataRect[0].length - positonX > currentData[dataIndex][0].length){
            positonX++;
            if(checkData(dataRect)){
                tempRight();
            }else{
                positonX--;
                positonY++;
                return;
            }
        }else{
            let tempCount = 0;
            out: for(let x = 0;x < currentData[dataIndex][0].length;x++){
                for(let y=0;y<currentData[dataIndex].length;y++){
                    let templength = currentData[dataIndex][currentData[dataIndex].length-1-y][currentData[dataIndex][0].length-1-x];
                    if(templength == 0){
                        tempCount++;
                    }else{
                        break out;
                    }
                }
            }
            let autoNumber = Math.floor(tempCount/currentData[dataIndex].length);
            if(dataRect[0].length - positonX > currentData[dataIndex][0].length - autoNumber){
                positonX++;
                if(checkData(dataRect)){
                    tempRight();
                }else{
                    positonX--;
                    positonY++;
                    return;
                }
            }else{
                positonY++;
            }
        }
    }
};
function clearTemp() {
    let tempYY = currentData[dataIndex].length-1;
    for(let y = 0;y<currentData[dataIndex].length;y++){
        let tempY = positonY - y;
        for(let x = 0;x < currentData[dataIndex][0].length;x++ ){
            if(currentData[dataIndex][tempYY-y][x] != 0){
                dataRectTemp[tempY][positonX+x] = 0;
            }
            if(positonX + x == dataRectTemp[0].length-1){
                break;
            }
        }
        if(tempY == 0){
            break;
        }
    }
};
function chameleon(){
    if(!isHasData){
        return;
    }
    if(currentData.length != 1){
        positonY--;
        let tempIndex = dataIndex;
        dataIndex = dataIndex + 1 < currentData.length?dataIndex+1 : 0;
        if(currentData[dataIndex][0].length <= dataRect[0].length-positonX
            && checkData(dataRect)){
            changeData();
            drawData();
            saveTemp();
            clearTemp();
            positonY++;
            if(checkData(dataRectTemp)){
                revertTemp();
            }else{
                isHasData = false;
                checkFull();
            }
        }else{
            dataIndex = tempIndex;
            positonY++;
        }
    }else{
        console.log("变不了形");
    }
};
function checkFull() {
    clearInterval(timeRun);
    positonY--;
    for(let y=0; y < currentData[dataIndex].length; ){
        for(let x = 0; x < dataRect[0].length;x++){
            if(dataRect[positonY-y][x] == 0){
                y++;
                break;
            }
            if(x == dataRect[0].length-1){
                clearMp3.play();
                totalClearCount++;
                clearFull(positonY-y);
            }
        }
        if(positonY-y < 0){
            break;
        }
    }
    drawData();
    timeRun = setInterval(timeRuning,1000);
};
function clearFull(currentY) {
    if(currentY == 0){
        dataRect[0] = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    }else{
        for(let y = currentY ;y > 0 ;y--){
            dataRect[y] = dataRect[y-1];
        }
        dataRect[0] = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
};