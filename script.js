// TODO: группировка перемычек и полотен

var canvas = new fabric.Canvas('myConvas', {
    height: (canvasContainer.offsetWidth / 2 > canvasContainer.offsetHeight / 2) ? 500 : canvasContainer.offsetWidth / 2,
    width: canvasContainer.offsetWidth,
    selectionColor: 'rgba(245, 215, 155, 0.5)',
});
var position = {
    firstClickPositionX: 0,
    firstClickPositionY: 0,
    lastClickPositionX: 0,
    lastClickPositionY: 0,
    tempX: 0,
    tempY: 0,
    cursorOnElElemetObj: 0,
    cursorOnElElemetWidth: 0,
    cursorOnElElemetHeight: 0,
    isCursorOnEl: false,
    isEventOn: false,
    isStartDrawingWithMouse: false,
    isSelectionMode: false,
    i: 0,
    drawingType: "circle",
    GetAndSetAreaStream: 0,
    DrawingWithMouseLineTop: 0,
    DrawingWithMouseLineBottom: 0,
    DrawingWithMouseLineRigth: 0,
    DrawingWithMouseLineLeft: 0,
    Start: function () {
        if (!position.isEventOn)
            position.Events();
        document.oncontextmenu = function (e) {
            position.ShowCanvasMenu(e); // меню: показать
            return false;
        }
        position.Cursor();
        // position.GridDrawing(); // проприсовка сетки
        position.Contur(0, "DrawingConturGrid") // контур 
    },
    Events: function () {
        position.isEventOn = true;
        canvas.on('object:selected', position.EventObjectSelected);
        canvas.on('object:modified', position.EventObjectModified);
        canvas.on('object:added', position.EventObjectAdded);
        canvas.on('object:removed', position.EventObjectAdded);
        canvas.on('object:moving', position.EventObjectMoving);
        canvas.on('mouse:move', function (o) {
            position.tempX = o.pageX;
            position.tempY = o.pageY;
            if (o.target) {
                position.cursorOnElElemetObj = o.target;
                position.isCursorOnEl = true;
                position.cursorOnElElemetHeight = o.target.height;
                position.cursorOnElElemetWidth = o.target.cacheWidth;
            }
            else
                position.isCursorOnEl = false;
            position.Contur(o, "rightBottomContur"); // контур
        })
        canvas.on('mouse:down', function (o) {
            position.firstClickPositionX = o.e.layerX
            position.firstClickPositionY = o.e.layerY;
            position.StartDrawingWithMouse(o);
            canvas.bringToFront(canvas.getActiveObject()); // z index активного объекта 
        })
        canvas.on('mouse:up', function (o) {
            position.lastClickPositionX = o.e.layerX
            position.lastClickPositionY = o.e.layerY;
            position.StopDrawingWithMouse(o);
        });
        selectOn.onclick = function () {
            position.isSelectionMode = true;
        };
        selectOf.onclick = function () {
            position.isSelectionMode = false;
        };
        group.onclick = function () {
            position.Group();
        };
        ungroup.onclick = function () {
            position.Ungroup();
        };
        remove.onclick = function () {
            position.RemoveSelect();
        };
        setTypeRect.onclick = function () {
            position.drawingType = "rect";
        };
        setTypeCircle.onclick = function () {
            position.drawingType = "circle";
        };
        setTypeTriangle.onclick = function () {
            position.drawingType = "triangle";
        };
        setTypeJumper.onclick = function () {
            position.drawingType = "jumper";
        };
        heightElInput.oninput = function () {
            canvas.getActiveObject().setHeight(parseInt(heightElInput.value));
            canvas.getActiveObject().scaleY = 1
            canvas.renderAll();
        };
        widthElInput.oninput = function () {
            canvas.getActiveObject().setWidth(parseInt(widthElInput.value));
            canvas.getActiveObject().scaleX = 1
            canvas.renderAll();
        };
        document.onclick = function () {
            position.HideCanvasMenu(); // меню: скрыть
        };
        window.onresize = function (event) { // изменение размера
            canvas.setHeight((canvasContainer.offsetWidth / 2 > canvasContainer.offsetHeight / 2) ? 500 : canvasContainer.offsetWidth / 2);
            canvas.setWidth(canvasContainer.offsetWidth);
        };
        canvas.on('mouse:over', function (e) {
            position.RedBorder(e, "over"); // красная рамка при Hover
        });
        canvas.on('mouse:out', function (e) {
            position.RedBorder(e, "out"); // красная рамка при Hover
        });

    },
    EventObjectMoving: function () { // Событие перемещение
        canvas.forEachObject(function (targ) { position.BlocksMagnet(targ); }); // примагничивание блоков
        canvas.renderAll();
        // position.GetAndSetArea(); // Полощаль
    }, EventObjectRemoved: function () { // Событие удаление
        position.ShowInfo(); // отображение информации
        position.GetAndSetArea(); // Полощаль
    }, EventObjectModified: function (e) {  // Событие изменение
        position.SetDataToCanvasMenu(e); // меню: установка занчений
        position.ShowInfo(); // отображение информации
        position.GetAndSetArea(); // Полощаль
    }, EventObjectSelected: function (e) {  // Событие выбор
        position.SetDataToCanvasMenu(e); // меню: установка занчений
    }, EventObjectAdded: function (e) { // Событие добавление
        position.SetDataToCanvasMenu(e);
        position.ShowInfo(); // отображение информации
        position.GetAndSetArea(); // Полощаль
    }, ShowCanvasMenu: function (e) { // меню: показать
        if (!position.isCursorOnEl) {
            convasContextMenu.style.display = "block";
            convasContextMenu.style.top = e.clientY + 'px';
            convasContextMenu.style.left = e.clientX + 'px';
            convasElContextMenu.style.display = "none";
        } else {
            convasElContextMenu.style.display = "block";
            convasElContextMenu.style.top = e.clientY + 'px';
            convasElContextMenu.style.left = e.clientX + 'px';
            convasContextMenu.style.display = "none";
        }
    }, ShowInfo: function () { // информация про все элементы
        canvas.getObjects().map(function (o) {
            if (o.get('type') != "line") {
                var id = o.get('id');
                var type = o.get('type');
                // console.log(id, type);
            }
        });
    }, HideCanvasMenu: function () { // меню: скрыть
        convasElContextMenu.style.display = "none";
        convasContextMenu.style.display = "none";
    }, SetDataToCanvasMenu: function (evt) { // меню: установка занчений
        var activeObject = canvas.getActiveObject();
        if (activeObject != undefined) {
            document.getElementById("heightElInput").value = parseInt(evt.target.getHeight() - 1);
            document.getElementById("widthElInput").value = parseInt(evt.target.getWidth() - 1);
        }
    }, StartDrawingWithMouse: function (o) { // создание полотна
        if (!position.isCursorOnEl && !position.isSelectionMode) {
            position.isStartDrawingWithMouse = true;
            position.Contur(o, "Add"); // контур
            canvas.remove(position.DrawingWithMouseLineLeft);
        }
    }, StopDrawingWithMouse: function (o) {
        if (position.isStartDrawingWithMouse) {
            position.isStartDrawingWithMouse = false;
            position.Contur(o, "delContur"); // контур
            if (position.drawingType == "rect") {
                var rect = new fabric.Rect({
                    left: position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX : position.lastClickPositionX,
                    top: position.firstClickPositionY < position.lastClickPositionY ? position.firstClickPositionY : position.lastClickPositionY,
                    fill: '#eccdae',
                    width: Math.abs(position.firstClickPositionX - position.lastClickPositionX) > 100 ? Math.abs(position.firstClickPositionX - position.lastClickPositionX) : 100,
                    height: Math.abs(position.firstClickPositionY - position.lastClickPositionY) > 100 ? Math.abs(position.firstClickPositionY - position.lastClickPositionY) : 100,
                });
                canvas.add(rect);
            } else if (position.drawingType == "jumper") {
                var rect = new fabric.Rect({
                    name: 'jumper',
                    left: position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX : position.lastClickPositionX,
                    top: position.firstClickPositionY < position.lastClickPositionY ? position.firstClickPositionY : position.lastClickPositionY,
                    fill: '#fec180',
                    width: Math.abs(position.firstClickPositionX - position.lastClickPositionX) > 100 ? Math.abs(position.firstClickPositionX - position.lastClickPositionX) : 100,
                    height: Math.abs(position.firstClickPositionY - position.lastClickPositionY) > 100 ? Math.abs(position.firstClickPositionY - position.lastClickPositionY) : 100,
                });
                rect.toObject = function () {
                    return {
                        name: 'jumper'
                    };
                };
                canvas.add(rect);
            } else if (position.drawingType == "circle") {
                var circle = new fabric.Circle({
                    radius: Math.abs(position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX - position.lastClickPositionX : position.lastClickPositionX - position.firstClickPositionX) / 2 < 100 ? 100 : Math.abs(position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX - position.lastClickPositionX : position.lastClickPositionX - position.firstClickPositionX) / 2,
                    fill: '#eccdae',
                    left: position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX : position.lastClickPositionX,
                    top: position.firstClickPositionY < position.lastClickPositionY ? position.firstClickPositionY : position.lastClickPositionY,
                });
                canvas.add(circle);
            } else if (position.drawingType == "triangle") {
                var triangle = new fabric.Triangle({
                    left: position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX : position.lastClickPositionX,
                    top: position.firstClickPositionY < position.lastClickPositionY ? position.firstClickPositionY : position.lastClickPositionY,
                    fill: '#eccdae',
                    width: Math.abs(position.firstClickPositionX - position.lastClickPositionX) > 100 ? Math.abs(position.firstClickPositionX - position.lastClickPositionX) : 100,
                    height: Math.abs(position.firstClickPositionY - position.lastClickPositionY) > 100 ? Math.abs(position.firstClickPositionY - position.lastClickPositionY) : 100,
                });
                canvas.add(triangle);
            }
        }
    }, RemoveSelect: function () { // удалить выбранный эелмент
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();
        if (activeObject) {
            var aaa = activeObject.getBoundingRect();
            console.log(aaa);
            if (confirm('Are you sure?')) {
                canvas.remove(activeObject);
            }

        }
        else if (activeGroup) {
            if (confirm('Are you sure?')) {
                var objectsInGroup = activeGroup.getObjects();
                canvas.discardActiveGroup();
                objectsInGroup.forEach(function (object) {
                    canvas.remove(object);
                });
            }
        }
    }, Group: function () { // группы: создать
        var activegroup = canvas.getActiveGroup();
        try {
            var objectsInGroup = activegroup.getObjects();
            activegroup.clone(function (newgroup) {
                canvas.discardActiveGroup();
                objectsInGroup.forEach(function (object) {
                    canvas.remove(object);
                });
                canvas.add(newgroup);
            });
        } catch (error) {
            alert("I can't group the one element");
        }

    }, Ungroup: function () { // группы: удалить
        try {
            var activeObject = canvas.getActiveObject();
            if (activeObject.type == "group") {
                var items = activeObject._objects;
                activeObject._restoreObjectsState();
                canvas.remove(activeObject);
                for (var i = 0; i < items.length; i++) {
                    canvas.add(items[i]);
                    canvas.item(canvas.size() - 1).hasControls = true;
                }
                canvas.renderAll();
            }
        } catch (error) {
            alert("I can't ungroup the one element or the item is not selected!");
        }
    }, BlocksMagnet: function (targ) { // примагничивание блоков
        activeObject = canvas.getActiveObject();
        if (targ === activeObject || activeObject.angle != 0 || targ.angle != 0) return;

        var targLeft = targ.getLeft();
        var targWidth = targ.getWidth();
        var targTop = targ.getTop();
        var targHeight = targ.getHeight();

        var activeLeft = activeObject.getLeft();
        var activeWidth = activeObject.getWidth();
        var activeTop = activeObject.getTop();
        var activeHeight = activeObject.getHeight();

        if (activeObject.get('name') != "jumper") { // Если не перемычка 
            if ( // активное лево и таргет право
                Math.abs(targLeft + targWidth - activeLeft) <= 10 &&
                (activeTop + activeHeight) > targTop &&
                activeTop < (targTop + targHeight)
            ) {
                activeObject.left = targLeft + targWidth
            } else if ( // активное право и таргет лево
                Math.abs(activeLeft + activeWidth - targLeft) <= 10 &&
                (activeTop + activeHeight) > targTop &&
                activeTop < (targTop + targHeight)
            ) {
                activeObject.left = targLeftt - activeWidth
            } else if ( // активное низ и таргет верх
                Math.abs((activeTop + activeHeight) - targTop) <= 10 &&
                activeLeft + activeWidth > targLeft &&
                activeLeft < targLeft + targWidth
            ) {
                activeObject.top = targTop - activeHeight;
            } else if ( // активное верх и таргет низ
                Math.abs((activeTop) - (targTop + targHeight)) <= 10 &&
                activeLeft + activeWidth > targLeft &&
                activeLeft < targLeft + targWidth
            ) {
                activeObject.top = targTop + targHeight;
            }
           
        } else { // Если перемычка
            if ( // активное лево и таргет право
                Math.abs(targLeft - activeLeft) <= 30 &&
                Math.abs(targTop - activeTop) <= 30
            ) {
                activeObject.left = targLeft;
                activeObject.top = targTop;
            } else if ( // активное право и таргет лево
                Math.abs((targLeft + targWidth) - (activeLeft + activeWidth)) <= 30 &&
                Math.abs(targTop - activeTop) <= 30
            ) {
                activeObject.left = ((targLeft + targWidth)  - activeWidth);
                activeObject.top = targTop;
            } else if ( // активное лево низ и таргет право низ
                Math.abs((targLeft + targWidth) - (activeLeft + activeWidth)) <= 30 &&
                Math.abs((targTop + targHeight) - (activeTop + activeHeight)) <= 30
            ) {
                activeObject.left = ((targLeft + targWidth)  - activeWidth);
                activeObject.top = (targHeight + targTop) - activeHeight;
            } else if ( // активное право низ и таргет лево низ
                Math.abs(targLeft - activeLeft) <= 30 &&
                Math.abs((targTop + targHeight) - (activeTop + activeHeight)) <= 30
            ) {
                activeObject.left = targLeft;
                activeObject.top = (targHeight + targTop) - activeHeight;
            }
        }
    }, GridDrawing: function () { // проприсовка сетки
        // var grid = 20;
        // for (var i = 0; i < (window.innerWidth / grid); i++) {
        //     canvas.add(new fabric.Line([i * grid, 0, i * grid, window.innerWidth], {
        //         stroke: '#ccc',
        //         selectable: false,

        //     }));
        //     canvas.add(new fabric.Line([0, i * grid, window.innerWidth, i * grid], {
        //         stroke: '#ccc',
        //         selectable: false,

        //     }))
        // }
    }, GetAndSetArea: function () { // плошщадь 
        var minLeft = 0;
        var maxLeft = 0;
        var minTop = 0;
        var maxTop = 0;
        var angle = 0;
        document.getElementById("areaInfoFild").textContent = "Идет подсчет";
        canvas.forEachObject(function (obj) {
            if (obj.type != "line") {
                if (obj.angle != 0)
                    angle = obj.angle;
                if (minLeft == 0)
                    minLeft = obj.left;
                else if (minLeft > obj.left)
                    minLeft = obj.left;
                if (maxLeft == 0)
                    maxLeft = obj.left + obj.width;
                else if (maxLeft < obj.left + obj.width)
                    maxLeft = obj.left + obj.width;
                if (minTop == 0)
                    minTop = obj.top;
                else if (minTop > obj.top)
                    minTop = obj.top;
                if (maxTop == 0)
                    maxTop = obj.top + obj.height;
                else if (maxTop < obj.top + obj.height)
                    maxTop = obj.left + obj.width;
            }
        });
        position.GetAndSetAreaStream++;
        var time = performance.now();
        var count = 0;
        function StartAgain() {
            if (position.GetAndSetAreaStream == 1) {
                if (minLeft < maxLeft) {
                    for (var j = minTop; j < maxTop; j++) {
                        var c = canvas.getContext('2d');
                        var p = c.getImageData(minLeft, j, 1, 1).data;
                        if (p[0] == 236) {
                            count = count + 1;
                        }
                    }
                    setTimeout(function () {
                        minLeft++;
                        StartAgain();
                    }, 0);
                } else {
                    document.getElementById("areaInfoFild").textContent = count;
                    position.GetAndSetAreaStream--;
                }
            } else if (position.GetAndSetAreaStream > 1) {
                position.GetAndSetAreaStream = 0;
                setTimeout(function () {
                    position.GetAndSetArea()
                }, 10);
            }
        }
        StartAgain();
    }, Contur: function (o, command) {
        if (command == "Add") {
            var myConvasHeight = parseInt(myConvas.style.height);
            var myConvasWidth = parseInt(myConvas.style.width);
            position.DrawingWithMouseLineTop = canvas.add(new fabric.Line([0, 0, 0, myConvasWidth], {
                class: "contur",
                strokeDashArray: [5, 5],
                left: myConvasWidth,
                top: o.e.layerY,
                stroke: '#b35c00',
                selectable: false,
                angle: 90
            }));
            position.DrawingWithMouseLineLeft = canvas.add(new fabric.Line([0, 0, 0, myConvasHeight], {
                class: "contur",
                strokeDashArray: [5, 5],
                left: o.e.layerX,
                top: 0,
                stroke: '#b35c00',
                selectable: false
            }));
            position.DrawingWithMouseLineLeft = canvas.add(new fabric.Line([0, 0, 0, myConvasHeight], {
                class: "contur-right",
                strokeDashArray: [5, 5],
                left: 0,
                top: 0,
                stroke: '#b35c00',
                selectable: false
            }));
            position.DrawingWithMouseLineLeft = canvas.add(new fabric.Line([0, 0, 0, myConvasWidth], {
                class: "contur-bottom",
                strokeDashArray: [5, 5],
                left: 0,
                top: 0,
                stroke: '#b35c00',
                angle: 90,
                selectable: false
            }));
            canvas.renderAll();
        } else if (command == "rightBottomContur") {
            var canvasObjects = canvas.getObjects();
            for (obj in canvasObjects) {
                if (canvasObjects[obj].class == "contur-right") {
                    canvasObjects[obj].set({ left: o.e.layerX });
                }
                if (canvasObjects[obj].class == "contur-bottom") {
                    canvasObjects[obj].set({ left: canvasContainer.offsetWidth });
                    canvasObjects[obj].set({ top: o.e.layerY });
                }
            }
            canvas.renderAll();
        } else if (command == "delContur") {
            var canvasObjects = canvas.getObjects();
            var ObjectsArray = new Array();
            function delContur() {
                for (obj in canvasObjects) {
                    if (canvasObjects[obj].class == "contur" || canvasObjects[obj].class == "contur-right" || canvasObjects[obj].class == "contur-bottom") {
                        canvas.remove(canvasObjects[obj]);
                        delContur();
                    }
                }
            }
            delContur()
        } else if (command == "DrawingConturGrid") {
            var myConvasHeight = parseInt(myConvas.style.height);
            var myConvasWidth = parseInt(myConvas.style.width);
            canvas.add(new fabric.Line([0, 0, 0, myConvasHeight], {
                strokeDashArray: [5, 5],
                left: 62,
                top: 0,
                stroke: '#b35c00',
                selectable: false
            }));
            canvas.add(new fabric.Line([0, 0, 0, myConvasHeight], {
                strokeDashArray: [5, 5],
                left: myConvasWidth - 62,
                top: 0,
                stroke: '#b35c00',
                selectable: false
            }));
            canvas.add(new fabric.Line([0, 0, 0, myConvasWidth], {
                strokeDashArray: [5, 5],
                left: myConvasWidth,
                top: 62,
                stroke: '#b35c00',
                selectable: false,
                angle: 90
            }));
            canvas.add(new fabric.Line([0, 0, 0, myConvasWidth], {
                strokeDashArray: [5, 5],
                left: myConvasWidth,
                top: canvasContainer.offsetHeight - 62,
                stroke: '#b35c00',
                selectable: false,
                angle: 90
            }));
            canvas.renderAll();
        }
    }, Cursor: function () {
        document.onmousemove = handler;
        function handler(event) {
            document.getElementById("cursor").style.top = event.pageY + "px";
            document.getElementById("cursor").style.left = event.pageX + "px";
        }
        document.getElementById("convasElContextMenu").onmouseover =
            document.getElementById("convasElContextMenu").onmouseout =
            document.getElementById("convasContextMenu").onmouseover =
            document.getElementById("convasContextMenu").onmouseout =
            document.getElementById("canvasContainer").onmouseover =
            document.getElementById("canvasContainer").onmouseout = cursorBlockHideShow;
        function cursorBlockHideShow(event) {
            console.log(event.type)
            if (event.type == 'mouseover') {
                document.getElementById("cursor").style.opacity = 1;
            } else if (event.type == 'mouseout') {
                document.getElementById("cursor").style.opacity = 0;
            }
        }
    }, RedBorder: function (e, type) { // красная рамка при Hover
        if (type == "over") {
            if (e.target.type == 'rect' || e.target.type == 'circle' || e.target.type == 'triangle' || e.target.type == 'group') {
                e.target.set({ strokeWidth: 5, stroke: 'red', width: e.target.width - 5, height: e.target.height - 5 });
            }
        } else if (type == "out") {
            try {
                if (e.target.type == 'rect' || e.target.type == 'circle' || e.target.type == 'triangle' || e.target.type == 'group') {
                    e.target.set({ strokeWidth: 0, width: e.target.width + 5, height: e.target.height + 5 });
                }
            } catch (err) { }
        }
        canvas.renderAll();
    }
}
window.onload = function () {
    position.Start();
};








// canvas.on('before:selection:cleared', function(){
//     $('#log').append('before:selection:cleared!!!!<br />');   
// });





// 	fabric.Canvas.prototype._setCornerCursor = function (corner, target) {
//             var style = this.upperCanvasEl.style;
//             if (corner === 'tr'){
//                 console.log("aaaa");
//             }
//             // if (corner === 'tr' || corner === 'tl' || corner === 'br' || corner === 'bl') {
//             //     style.cursor = this.defaultCursor;
//             //     console.log("aaaa");
//             // }
//             //  else if (corner === 'mt' || corner === 'mb' ||  corner === 'ml' || corner === 'mr' ){
//             //     style.cursor = 'pointer';
//             //     console.log("sss");
//             // }           
//             // else {
//             //     style.cursor = this.defaultCursor;
//             //     return false;
//     // }
// }


// JSON.stringify(canvas);
// canvas.loadFromJSON(json, canvas.renderAll())






//  document.body.style.cursor = "url(arrow.png)";
// canvas.defaultCursor = 'url(arrow.png), e-resize';

// // canvas.defaultCursor  = "url('arrow.png'), auto";
// // canvas.freeDrawingCursor = "url('arrow.png'), auto";
// canvas.moveCursor = "url('arrow.png'), auto";
// canvas.hoverCursor = "url('arrow.png'), auto";
// canvas.rotationCursor   = "url('arrow.png'), auto";
// canvas.moveCursor = "url('arrow.png'), auto";
// canvas.moveCursor = "url('arrow.png'), auto";
// canvas.moveCursor = "url('arrow.png'), auto";
// canvas.moveCursor = "url('arrow.png'), auto";
// canvas.moveCursor = "url('arrow.png'), auto";
// canvas.moveCursor = "url('arrow.png'), auto";

//  canvas.hoverCursor = "url('arrow.png'), auto";

// canvas.moveCursor= "url('arrow.png'), auto";

// hoverCursor= "url('arrow.png'), auto";

//     /**
//      * Default cursor value used when moving an object on canvas
//      * @type String
//      * @default
//      */
//     canvas.moveCursor= "url('arrow.png'), auto";

//     /**
//      * Default cursor value used for the entire canvas
//      * @type String
//      * @default
//      */
//     canvas.defaultCursor= "url('arrow.png'), auto";

//     /**
//      * Cursor value used during free drawing
//      * @type String
//      * @default
//      */
//     canvas.freeDrawingCursor= "url('arrow.png'), auto";
//     /**
//      * Cursor value used for rotation point
//      * @type String
//      * @default
//      */
//     canvas.rotationCursor= "url('arrow.png'), auto";