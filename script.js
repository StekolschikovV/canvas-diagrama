var canvas = new fabric.Canvas('myConvas', {
    height: window.innerHeight,
    width: window.innerWidth,
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
    Start: function () {
        if (!position.isEventOn)
            position.Events();
        document.oncontextmenu = function (e) {
            position.ShowCanvasMenu(e); // меню: показать
            return false;
        }
        position.GridDrawing(); // проприсовка сетки
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
        })
        canvas.on('mouse:down', function (o) {
            position.firstClickPositionX = o.e.layerX
            position.firstClickPositionY = o.e.layerY;
            position.StartDrawingWithMouse();
        })
        canvas.on('mouse:up', function (o) {
            position.lastClickPositionX = o.e.layerX
            position.lastClickPositionY = o.e.layerY;
            position.StopDrawingWithMouse();
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
        heightElInput.oninput = function () {
            canvas.getActiveObject().setHeight(parseInt(heightElInput.value) - 1);
            canvas.getActiveObject().scaleY = 1
            canvas.renderAll();
        };
        widthElInput.oninput = function () {
            canvas.getActiveObject().setWidth(parseInt(widthElInput.value) - 1);
            canvas.getActiveObject().scaleX = 1
            canvas.renderAll();
        };
        document.onclick = function () {
            position.HideCanvasMenu(); // меню: скрыть
        };
    },
    EventObjectMoving: function () { // Событие перемещение
        canvas.forEachObject(function (targ) { position.BlocksMagnet(targ); }); // примагничивание блоков
    }, EventObjectRemoved: function () { // Событие удаление
        position.ShowInfo(); // отображение информации
    }, EventObjectModified: function (e) {  // Событие изменение
        position.SetDataToCanvasMenu(e); // меню: установка занчений
        position.ShowInfo(); // отображение информации
    }, EventObjectSelected: function (e) {  // Событие выбор
        position.SetDataToCanvasMenu(e); // меню: установка занчений
    }, EventObjectAdded: function (e) { // Событие добавление
        position.SetDataToCanvasMenu(e);
        position.ShowInfo(); // отображение информации
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
    },
    ShowInfo: function () { // информация про все элементы
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
    },SetDataToCanvasMenu: function (evt) { // меню: установка занчений
        var activeObject = canvas.getActiveObject();
        if (activeObject != undefined){
            document.getElementById("heightElInput").value = parseInt(evt.target.getHeight());
            document.getElementById("widthElInput").value = parseInt(evt.target.getWidth());
        }
}, StartDrawingWithMouse: function () { // создание полотна
    if (!position.isCursorOnEl && !position.isSelectionMode) {
        position.isStartDrawingWithMouse = true;
    }
}, StopDrawingWithMouse: function () {
    if (position.isStartDrawingWithMouse) {
        position.isStartDrawingWithMouse = false;
        if (position.drawingType == "rect") {
            var rect = new fabric.Rect({
                left: position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX : position.lastClickPositionX,
                top: position.firstClickPositionY < position.lastClickPositionY ? position.firstClickPositionY : position.lastClickPositionY,
                fill: '#eccdae',
                width: Math.abs(position.firstClickPositionX - position.lastClickPositionX) > 100 ? Math.abs(position.firstClickPositionX - position.lastClickPositionX) : 100,
                height: Math.abs(position.firstClickPositionY - position.lastClickPositionY) > 100 ? Math.abs(position.firstClickPositionY - position.lastClickPositionY) : 100,
            });
            canvas.add(rect);
        } else if (position.drawingType == "circle") {
            var circle = new fabric.Circle({
                radius: Math.abs(position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX - position.lastClickPositionX : position.lastClickPositionX - position.firstClickPositionX) / 2 < 100 ? 100 : Math.abs(position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX - position.lastClickPositionX : position.lastClickPositionX - position.firstClickPositionX) / 2 ,
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
    var objectsInGroup = activegroup.getObjects();
    activegroup.clone(function (newgroup) {
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function (object) {
            canvas.remove(object);
        });
        canvas.add(newgroup);
    });
}, Ungroup: function () { // группы: удалить
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
}, BlocksMagnet: function (targ) { // примагничивание блоков
    activeObject = canvas.getActiveObject();
    if (targ === activeObject || activeObject.angle != 0 || targ.angle != 0) return;
    if ( // активное лево и таргет право
        Math.abs(targ.left + targ.width - activeObject.left) <= 10 &&
        (activeObject.top + activeObject.height) > targ.top &&
        activeObject.top < (targ.top + targ.height)
    ) {
        activeObject.left = targ.left + targ.width
    } else if ( // активное право и таргет лево
        Math.abs(activeObject.left + activeObject.width - targ.left) <= 10 &&
        (activeObject.top + activeObject.height) > targ.top &&
        activeObject.top < (targ.top + targ.height)
    ) {
        activeObject.left = targ.left - activeObject.width
    } else if ( // активное низ и таргет верх
        Math.abs((activeObject.top + activeObject.height) - targ.top) <= 10 &&
        activeObject.left + activeObject.width > targ.left &&
        activeObject.left < targ.left + targ.width
    ) {
        activeObject.top = targ.top - activeObject.height;
    } else if ( // активное верх и таргет низ
        Math.abs((activeObject.top) - (targ.top + targ.height)) <= 10 &&
        activeObject.left + activeObject.width > targ.left &&
        activeObject.left < targ.left + targ.width
    ) {
        activeObject.top = targ.top + targ.height
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
}
}
window.onload = function () {
    position.Start();
};




document.onmousemove = handler;
function handler(event) {
    document.getElementById("cursor").style.top = event.pageY + "px";
    document.getElementById("cursor").style.left = event.pageX + "px";
}
// JSON.stringify(canvas);
// canvas.loadFromJSON(json, canvas.renderAll())














 document.body.style.cursor = "url(arrow.png)";
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