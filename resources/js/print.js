/**
 * Created by gewangjie on 16/2/10.
 */
var screenWidth = window.innerWidth,
    canvasTop = document.getElementById('canvas').offsetTop,
    canvasLeft = document.getElementById('canvas').offsetLeft;
//init
var canvas = document.getElementById("canvas");  //获取canvas
//var info = document.getElementById('info');//相对canvas的鼠标位置信息
var context = canvas.getContext('2d');  //canvas追加2d画图
var line = localStorage.line ? JSON.parse(localStorage.line) : [];
var lineNum = 0;
var lastX = -1;  //路径坐标，从起始到下一个的坐标
var lastY = -1;  //路径坐标
var flag = 0;  //标志，判断是按下后移动还是未按下移动 重要
var penwidth = 1; //画笔宽度
var pencolor = "#000";//画笔颜色
var shadowWidth = document.getElementById('shadowWidth');//画笔虚化宽度
var penShadowWidth = 1;
var preX = 0, preY = 0;
var color = document.getElementById('color');
var width = document.getElementById('width');

canvas.addEventListener('touchmove', onTouchMove, false);   //鼠标移动事件
canvas.addEventListener('touchstart', onTouchStart, false);  //鼠标按下事件
canvas.addEventListener('touchend', onTouchEnd, false);     //鼠标抬起事件
color.addEventListener('change', selectedColor, false);       //笔色选择事件
width.addEventListener('change', selectedWidth, false);       //笔粗选择事件
shadowWidth.addEventListener('change', selectedShadowWidth, false);//虚化选择事件

function transformPiontX(num) {
    return num - (screenWidth - 300) / 2 - canvasLeft;
}
function transformPiontY(num) {
    return num - canvasTop - 10;
}
//触摸操作
function onTouchStart(evt) {
    flag = 1;  //标志按下
    line[lineNum] = {
        linex: [],
        liney: [],
        linen: [],
        linetime: [],
        lineColor: pencolor,
        lineWidth: penwidth,
        lineShadowWidth:penShadowWidth
    };
    preX = transformPiontX(evt.touches[0].clientX);
    preY = transformPiontY(evt.touches[0].clientY);
    line[lineNum].linex.push(preX);  //坐标存入数组   layer获取相对于当前元素的坐标，不同于pagex获取相对页面
    line[lineNum].liney.push(preY);
    line[lineNum].linen.push(0);  //按下0位
    line[lineNum].linetime.push(new Date().getTime());
    //info.innerHTML = '鼠标相对画布坐标：x = ' + preX + ' y = ' + preY;
}
function onTouchEnd() {
    flag = 0;
    line[lineNum].linex.push(preX);  //坐标存入数组   layer获取相对于当前元素的坐标，不同于pagex获取相对页面
    line[lineNum].liney.push(preY);
    line[lineNum].linen.push(0);  //按下0位
    line[lineNum].linetime.push(new Date().getTime());
    //info.innerHTML = '鼠标相对画布坐标：x = ' + preX + ' y = ' + preY;
    lineNum++;
}
function onTouchMove(evt) {
    if (flag == 1) {
        preX = transformPiontX(evt.touches[0].clientX);
        preY = transformPiontY(evt.touches[0].clientY);
        line[lineNum].linex.push(preX);  //坐标存入数组   layer获取相对于当前元素的坐标，不同于pagex获取相对页面
        line[lineNum].liney.push(preY);
        line[lineNum].linen.push(1);  //移动1位
        line[lineNum].linetime.push(new Date().getTime());//步骤和记录的时间戳
        //绘制
        context.save();  //存储当前画布状态，破坏以前
        context.beginPath();  //开始绘制路径
        for (var i = 0; i < line[lineNum].linex.length; i++) {  //移动鼠标，这个数组会不断push插入1，计算移动次数
            lastX = line[lineNum].linex[i];  //移动坐标
            lastY = line[lineNum].liney[i];
            if (line[lineNum].linen[i] == 0) {  //刚按下那个坐标位置，移动开始前
                context.moveTo(lastX, lastY);  //绘制路径的起始点坐标
            } else {  //发生移动
                context.lineTo(lastX, lastY);  //绘制以后的左边点
            }
        }
        context.lineWidth = line[lineNum].lineWidth;  //线宽度
        context.shadowColor = line[lineNum].lineColor;
        context.shadowBlur = line[lineNum].lineShadowWidth;
        context.strokeStyle = line[lineNum].lineColor; //线颜色
        context.stroke();  //绘制
        context.restore();  //释放画布以前状态，不能写字就破坏了
        //info.innerHTML = '鼠标相对画布坐标：x = ' + preX + ' y = ' + preY;
    }
}
//操作数据
function consoleData() {
    console.log(line);
}
function back(el) {
    if (lineNum > 0) {
        line.pop();
        lineNum--;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < lineNum; i++) {
            var lineItem = line[i];
            render(lineItem);
        }
    } else {
        el=$.tips({
            content:'你没写字呐！',
            stayTime:2000,
            type:"error"
        })
        el.on("tips:hide",function(){
            console.log("tips hide");
        })
    }
}
function save(){
    if(lineNum > 0) {
        if (confirm('是否下载?')) {
            var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            window.location.href = image;
        }
        localStorage.setItem('line', JSON.stringify(line));
        console.log(JSON.parse(localStorage.line));
    }else{
        el=$.tips({
            content:'你没写字呐！',
            stayTime:2000,
            type:"error"
        })
        el.on("tips:hide",function(){
            console.log("tips hide");
        })
    }

}
function clean(){
    console.log('clean');
    context.clearRect(0, 0, canvas.width, canvas.height);
    line=[];
    window.localStorage.removeItem('line');
}
//选择笔的属性
function selectedColor() {
    pencolor = color.value;
    console.log(color.value);
}
function selectedWidth() {
    penwidth = width.value;
    $('#width_show').html(width.value);
    console.log(width.value);
}
function selectedShadowWidth() {
    penShadowWidth = shadowWidth.value;
    $('#shadowWidth_show').html(shadowWidth.value);
    console.log(shadowWidth.value);
}
//replay
function replay(){
    console.log('replay')
    console.log(line);
    context.save();  //存储当前画布状态，破坏以前
    context.beginPath();  //开始绘制路径
    lineNum = line.length;
    for (var i = 0; i < lineNum; i++) {
        var lineItem = line[i];
        render(lineItem);
    }
}
replay();
//渲染
function render(lineItem){
    for (var j = 0; j < lineItem.linex.length; j++) {//模拟操作
        context.save();  //存储当前画布状态，破坏以前
        context.beginPath();  //开始绘制路径
        for (var k = 0; k < j; k++) {
            lastX = lineItem.linex[k];  //移动坐标
            lastY = lineItem.liney[k];
            if (lineItem.linen[k] == 0) {  //刚按下那个坐标位置，移动开始前
                context.moveTo(lastX, lastY);  //绘制路径的起始点坐标
            } else {  //发生移动
                context.lineTo(lastX, lastY);  //绘制以后的左边点
            }
        }
        context.lineWidth = lineItem.lineWidth;  //线宽度
        context.shadowColor = lineItem.lineColor;
        context.shadowBlur = lineItem.lineShadowWidth;
        context.strokeStyle = lineItem.lineColor; //线颜色
        context.stroke();  //绘制
        context.restore();  //释放画布以前状态，不能写字就破坏了
    }
}

