# DONE: группировка перемычек и полотен
@canvas = new (fabric.Canvas)('myConvas',
  height: if canvasContainer.offsetWidth / 2 > canvasContainer.offsetHeight / 2 then 500 else canvasContainer.offsetWidth / 2
  width: canvasContainer.offsetWidth
  selectionColor: 'rgba(245, 215, 155, 0.5)')
@position =
  firstClickPositionX: 0
  firstClickPositionY: 0
  lastClickPositionX: 0
  lastClickPositionY: 0
  tempX: 0
  tempY: 0
  cursorOnElElemetObj: 0
  cursorOnElElemetWidth: 0
  cursorOnElElemetHeight: 0
  isCursorOnEl: false
  isEventOn: false
  isStartDrawingWithMouse: false
  isSelectionMode: false
  i: 0
  drawingType: 'circle'
  GetAndSetAreaStream: 0
  DrawingWithMouseLineTop: 0
  DrawingWithMouseLineBottom: 0
  DrawingWithMouseLineRigth: 0
  DrawingWithMouseLineLeft: 0
  Start: ->
    if !position.isEventOn
      position.Events()

    document.oncontextmenu = (e) ->
      position.ShowCanvasMenu e
      # меню: показать
      false

    position.Cursor()
    # position.GridDrawing(); // проприсовка сетки
    position.Contur 0, 'DrawingConturGrid'
    # контур
    return
  Events: ->
    position.isEventOn = true
    canvas.on 'object:selected', position.EventObjectSelected
    canvas.on 'object:modified', position.EventObjectModified
    canvas.on 'object:added', position.EventObjectAdded
    canvas.on 'object:removed', position.EventObjectAdded
    canvas.on 'object:moving', position.EventObjectMoving
    canvas.on 'mouse:move', (o) ->
      position.tempX = o.pageX
      position.tempY = o.pageY
      if o.target
        position.cursorOnElElemetObj = o.target
        position.isCursorOnEl = true
        position.cursorOnElElemetHeight = o.target.height
        position.cursorOnElElemetWidth = o.target.cacheWidth
      else
        position.isCursorOnEl = false
      position.Contur o, 'rightBottomContur'
      # контур
      return
    canvas.on 'mouse:down', (o) ->
      position.firstClickPositionX = o.e.layerX
      position.firstClickPositionY = o.e.layerY
      position.StartDrawingWithMouse o
      canvas.bringToFront canvas.getActiveObject()
      # z index активного объекта
      return
    canvas.on 'mouse:up', (o) ->
      position.lastClickPositionX = o.e.layerX
      position.lastClickPositionY = o.e.layerY
      position.StopDrawingWithMouse o
      return

    selectOn.onclick = ->
      position.isSelectionMode = true
      return

    selectOf.onclick = ->
      position.isSelectionMode = false
      return

    group.onclick = ->
      position.Group()
      return

    ungroup.onclick = ->
      position.Ungroup()
      return

    remove.onclick = ->
      position.RemoveSelect()
      return

    setTypeRect.onclick = ->
      position.drawingType = 'rect'
      return

    setTypeCircle.onclick = ->
      position.drawingType = 'circle'
      return


    setTypeTriangle.onclick = ->
      position.drawingType = 'triangle'
      return

    # УСТАНОВКА ТИПА ПЕРЕМЫЧКА
    setTypeJumperRect.onclick = ->
      position.drawingType = 'jumperRect'
    setTypeJumperCircle.onclick = ->
      position.drawingType = 'jumperCircle'
    setTypeJumperTriangle.onclick = ->
      position.drawingType = 'jumperTriangle'
    # УСТАНОВКА ТИПА ПЕРЕМЫЧКА

    heightElInput.oninput = ->
      canvas.getActiveObject().setHeight parseInt(heightElInput.value)
      canvas.getActiveObject().scaleY = 1
      canvas.renderAll()
      return

    widthElInput.oninput = ->
      canvas.getActiveObject().setWidth parseInt(widthElInput.value)
      canvas.getActiveObject().scaleX = 1
      canvas.renderAll()
      return

    document.onclick = ->
      position.HideCanvasMenu()
      # меню: скрыть
      return

    window.onresize = (event) ->
# изменение размера
      canvas.setHeight if canvasContainer.offsetWidth / 2 > canvasContainer.offsetHeight / 2 then 500 else canvasContainer.offsetWidth / 2
      canvas.setWidth canvasContainer.offsetWidth
      return

    canvas.on 'mouse:over', (e) ->
      position.RedBorder e, 'over'
      # красная рамка при Hover
      return
    canvas.on 'mouse:out', (e) ->
      position.RedBorder e, 'out'
      # красная рамка при Hover
      return
    return
  EventObjectMoving: ->
# Событие перемещение
    canvas.forEachObject (targ) ->
      position.BlocksMagnet targ
      return
    # примагничивание блоков
    canvas.renderAll()
    # position.GetAndSetArea(); // Полощаль
    return
  EventObjectRemoved: ->
# Событие удаление
    position.ShowInfo()
    # отображение информации
    position.GetAndSetArea()
    # Полощаль
    return
  EventObjectModified: (e) ->
# Событие изменение
    position.SetDataToCanvasMenu e
    # меню: установка занчений
    position.ShowInfo()
    # отображение информации
    position.GetAndSetArea()
    # Полощаль
    return
  EventObjectSelected: (e) ->
# Событие выбор
    position.SetDataToCanvasMenu e
    # меню: установка занчений
    return
  EventObjectAdded: (e) ->
# Событие добавление
    position.SetDataToCanvasMenu e
    position.ShowInfo()
    # отображение информации
    position.GetAndSetArea()
    # Полощаль
    return
  ShowCanvasMenu: (e) ->
# меню: показать
    if !position.isCursorOnEl
      convasContextMenu.style.display = 'block'
      convasContextMenu.style.top = e.clientY + 'px'
      convasContextMenu.style.left = e.clientX + 'px'
      convasElContextMenu.style.display = 'none'
    else
      convasElContextMenu.style.display = 'block'
      convasElContextMenu.style.top = e.clientY + 'px'
      convasElContextMenu.style.left = e.clientX + 'px'
      convasContextMenu.style.display = 'none'
    return
  ShowInfo: ->
# информация про все элементы
    canvas.getObjects().map (o) ->
      if o.get('type') != 'line'
        id = o.get('id')
        type = o.get('type')
      # console.log(id, type);
      return
    return
  HideCanvasMenu: ->
# меню: скрыть
    convasElContextMenu.style.display = 'none'
    convasContextMenu.style.display = 'none'
    return
  SetDataToCanvasMenu: (evt) ->
# меню: установка занчений
    activeObject = canvas.getActiveObject()
    if activeObject != undefined
      document.getElementById('heightElInput').value = parseInt(evt.target.getHeight() - 1)
      document.getElementById('widthElInput').value = parseInt(evt.target.getWidth() - 1)
    return
  StartDrawingWithMouse: (o) ->
# создание полотна
    if !position.isCursorOnEl and !position.isSelectionMode
      position.isStartDrawingWithMouse = true
      position.Contur o, 'Add'
      # контур
      canvas.remove position.DrawingWithMouseLineLeft
    return
  StopDrawingWithMouse: (o) ->
    el = 0
    if position.isStartDrawingWithMouse
      position.isStartDrawingWithMouse = false
      position.Contur o, 'delContur'
      if position.drawingType == 'rect'
        el = new (fabric.Rect)(
          left: if position.firstClickPositionX < position.lastClickPositionX then position.firstClickPositionX else position.lastClickPositionX
          top: if position.firstClickPositionY < position.lastClickPositionY then position.firstClickPositionY else position.lastClickPositionY
          fill: '#eccdae'
          width: if Math.abs(position.firstClickPositionX - (position.lastClickPositionX)) > 100 then Math.abs(position.firstClickPositionX - (position.lastClickPositionX)) else 100
          height: if Math.abs(position.firstClickPositionY - (position.lastClickPositionY)) > 100 then Math.abs(position.firstClickPositionY - (position.lastClickPositionY)) else 100)
      else if position.drawingType == 'circle'
        el = new (fabric.Circle)(
          radius: if Math.abs(if position.firstClickPositionX < position.lastClickPositionX then position.firstClickPositionX - (position.lastClickPositionX) else position.lastClickPositionX - (position.firstClickPositionX)) / 2 < 100 then 100 else Math.abs(if position.firstClickPositionX < position.lastClickPositionX then position.firstClickPositionX - (position.lastClickPositionX) else position.lastClickPositionX - (position.firstClickPositionX)) / 2
          fill: '#eccdae'
          left: if position.firstClickPositionX < position.lastClickPositionX then position.firstClickPositionX else position.lastClickPositionX
          top: if position.firstClickPositionY < position.lastClickPositionY then position.firstClickPositionY else position.lastClickPositionY)
      else if position.drawingType == 'triangle'
        el = new (fabric.Triangle)(
          left: if position.firstClickPositionX < position.lastClickPositionX then position.firstClickPositionX else position.lastClickPositionX
          top: if position.firstClickPositionY < position.lastClickPositionY then position.firstClickPositionY else position.lastClickPositionY
          fill: '#eccdae'
          width: if Math.abs(position.firstClickPositionX - (position.lastClickPositionX)) > 100 then Math.abs(position.firstClickPositionX - (position.lastClickPositionX)) else 100
          height: if Math.abs(position.firstClickPositionY - (position.lastClickPositionY)) > 100 then Math.abs(position.firstClickPositionY - (position.lastClickPositionY)) else 100)
# перемычки
      else if position.drawingType == 'jumperRect'
        el = new (fabric.Rect)(
          name: 'jumper'
          left: if position.firstClickPositionX < position.lastClickPositionX then position.firstClickPositionX else position.lastClickPositionX
          top: if position.firstClickPositionY < position.lastClickPositionY then position.firstClickPositionY else position.lastClickPositionY
          fill: '#fec180'
          width: if Math.abs(position.firstClickPositionX - (position.lastClickPositionX)) > 100 then Math.abs(position.firstClickPositionX - (position.lastClickPositionX)) else 100
          height: if Math.abs(position.firstClickPositionY - (position.lastClickPositionY)) > 100 then Math.abs(position.firstClickPositionY - (position.lastClickPositionY)) else 100)
      else if position.drawingType == 'jumperCircle'
        el = new (fabric.Circle)(
          name: 'jumper'
          radius: if Math.abs(if position.firstClickPositionX < position.lastClickPositionX then position.firstClickPositionX - (position.lastClickPositionX) else position.lastClickPositionX - (position.firstClickPositionX)) / 2 < 100 then 100 else Math.abs(if position.firstClickPositionX < position.lastClickPositionX then position.firstClickPositionX - (position.lastClickPositionX) else position.lastClickPositionX - (position.firstClickPositionX)) / 2
          fill: '#fec180'
          left: if position.firstClickPositionX < position.lastClickPositionX then position.firstClickPositionX else position.lastClickPositionX
          top: if position.firstClickPositionY < position.lastClickPositionY then position.firstClickPositionY else position.lastClickPositionY)
      else if position.drawingType == 'jumperTriangle'
        el = new (fabric.Triangle)(
          name: 'jumper'
          fill: '#fec180'
          left: if position.firstClickPositionX < position.lastClickPositionX then position.firstClickPositionX else position.lastClickPositionX
          top: if position.firstClickPositionY < position.lastClickPositionY then position.firstClickPositionY else position.lastClickPositionY
          width: if Math.abs(position.firstClickPositionX - (position.lastClickPositionX)) > 100 then Math.abs(position.firstClickPositionX - (position.lastClickPositionX)) else 100
          height: if Math.abs(position.firstClickPositionY - (position.lastClickPositionY)) > 100 then Math.abs(position.firstClickPositionY - (position.lastClickPositionY)) else 100)
      # перемычки
      canvas.add el

  RemoveSelect: ->
# удалить выбранный эелмент
    activeObject = canvas.getActiveObject()
    activeGroup = canvas.getActiveGroup()
    if activeObject
      aaa = activeObject.getBoundingRect()
      if confirm('Are you sure?')
        canvas.remove activeObject
    else if activeGroup
      if confirm('Are you sure?')
        objectsInGroup = activeGroup.getObjects()
        canvas.discardActiveGroup()
        objectsInGroup.forEach (object) ->
          canvas.remove object
          return

# ГРУППИРОВКА
  Group: ->
# группы: создать
    activegroup = canvas.getActiveGroup()
    try
      objectsInGroup = activegroup.getObjects()
      activegroup.clone (newgroup) ->
        canvas.discardActiveGroup()
        objectsInGroup.forEach (object) ->
          canvas.remove object
        canvas.add newgroup
    catch error
      position.sayForAUser("I can\'t group the one element")
# ГРУППИРОВКА

# РАЗГРУППИРОВКА
  Ungroup: ->
# группы: удалить
    try
      activeObject = canvas.getActiveObject()
      if activeObject.type == 'group'
        items = activeObject._objects
        activeObject._restoreObjectsState()
        canvas.remove activeObject
        i = 0
        while i < items.length
          canvas.add items[i]
          canvas.item(canvas.size() - 1).hasControls = true
          i++
        canvas.renderAll()
    catch error
      position.sayForAUser('I can\'t ungroup the one element or the item is not selected!')
# РАЗГРУППИРОВКА

# ПРИМАГНИЧИВАНИЕ БЛОКОВ
  BlocksMagnet: (targ) ->
    activeObject = canvas.getActiveObject()
    # если выбран не один блок - выключить
    if(activeObject != null)
      if targ == activeObject
        return
      targLeft = targ.getLeft()
      targWidth = targ.getWidth()
      targTop = targ.getTop()
      targHeight = targ.getHeight()
      activeLeft = activeObject.getLeft()
      activeWidth = activeObject.getWidth()
      activeTop = activeObject.getTop()
      activeHeight = activeObject.getHeight()
      # если не перемычка
      if activeObject.get('name') != 'jumper'
        if Math.abs(targLeft + targWidth - activeLeft) <= 10 and activeTop + activeHeight > targTop and activeTop < targTop + targHeight
          activeObject.left = targLeft + targWidth
        else if Math.abs(activeLeft + activeWidth - targLeft) <= 10 and activeTop + activeHeight > targTop and activeTop < targTop + targHeight
          activeObject.left = targLeft - activeWidth
        else if Math.abs(activeTop + activeHeight - targTop) <= 10 and activeLeft + activeWidth > targLeft and activeLeft < targLeft + targWidth
          activeObject.top = targTop - activeHeight
        else if Math.abs(activeTop - (targTop + targHeight)) <= 10 and activeLeft + activeWidth > targLeft and activeLeft < targLeft + targWidth
          activeObject.top = targTop + targHeight
# если перемычка
      else
        if Math.abs(targLeft - activeLeft) <= 30 and Math.abs(targTop - activeTop) <= 30
          activeObject.left = targLeft
          activeObject.top = targTop
        else if Math.abs(targLeft + targWidth - (activeLeft + activeWidth)) <= 30 and Math.abs(targTop - activeTop) <= 30
          activeObject.left = targLeft + targWidth - activeWidth
          activeObject.top = targTop
        else if Math.abs(targLeft + targWidth - (activeLeft + activeWidth)) <= 30 and Math.abs(targTop + targHeight - (activeTop + activeHeight)) <= 30
          activeObject.left = targLeft + targWidth - activeWidth
          activeObject.top = targHeight + targTop - activeHeight
        else if Math.abs(targLeft - activeLeft) <= 30 and Math.abs(targTop + targHeight - (activeTop + activeHeight)) <= 30
          activeObject.left = targLeft
          activeObject.top = targHeight + targTop - activeHeight
# ПРИМАГНИЧИВАНИЕ БЛОКОВ

  GridDrawing: ->
# проприсовка сетки
# var grid = 20;
# for (var i = 0; i < (window.innerWidth / grid); i++) {
#     canvas.add(new fabric.Line([i * grid, 0, i * grid, window.innerWidth], {
#         stroke: '#ccc',
#         selectable: false,
#     }));
#     canvas.add(new fabric.Line([0, i * grid, window.innerWidth, i * grid], {
#         stroke: '#ccc',
#         selectable: false,
#     }))
# }
#    return

# ПЛОЩАДЬ
  GetAndSetArea: ->
    minLeft = 0
    maxLeft = 0
    minTop = 0
    maxTop = 0
    angle = 0
    count = 0
    StartAgain = ->
      if position.GetAndSetAreaStream == 1
        if minLeft < maxLeft
          j = minTop
          while j < maxTop
            c = canvas.getContext('2d')
            p = c.getImageData(minLeft, j, 1, 1).data
            if p[0] != 0
#              console.log(1)
              count = count + 1
            j++
          setTimeout (->
            minLeft++
            StartAgain()
          ), 0
        else
          document.getElementById('areaInfoFild').textContent = count
          position.GetAndSetAreaStream--
      else if position.GetAndSetAreaStream > 1
        position.GetAndSetAreaStream = 0
        setTimeout (->
          position.GetAndSetArea()
        ), 10
    document.getElementById('areaInfoFild').textContent = 'Идет подсчет'
    # получение минимальных размеров облости просчета
    canvas.forEachObject (obj) ->
      if obj.type != 'line'
        if obj.angle != 0
          angle = obj.angle
        if minLeft == 0
          minLeft = obj.left
        else if minLeft > obj.left
          minLeft = obj.left
        if maxLeft == 0
          maxLeft = obj.left + obj.width
        else if maxLeft < obj.left + obj.width
          maxLeft = obj.left + obj.width
        if minTop == 0
          minTop = obj.top
        else if minTop > obj.top
          minTop = obj.top
        if maxTop == 0
          maxTop = obj.top + obj.height
        else if maxTop < obj.top + obj.height
          maxTop = obj.left + obj.width
    # если есть поворот любой фигур нужно считать всю диаграмму
    if angle != 0
      minLeft = 0
      maxLeft = parseInt(myConvas.style.width)
      maxTop = parseInt(myConvas.style.height)
      minTop = 0
    position.GetAndSetAreaStream++
    time = performance.now()
    count = 0
    StartAgain()
# ПЛОЩАДЬ

# КОНТУР
  Contur: (o, command) ->
    delContur = ->
      for obj of canvasObjects
        if canvasObjects[obj].class == 'contur' or canvasObjects[obj].class == 'contur-right' or canvasObjects[obj].class == 'contur-bottom'
          canvas.remove canvasObjects[obj]
          delContur()
    if command == 'Add'
      myConvasHeight = parseInt(myConvas.style.height)
      myConvasWidth = parseInt(myConvas.style.width)
      position.DrawingWithMouseLineTop = canvas.add(new (fabric.Line)([0, 0, 0, myConvasWidth],
        class: 'contur'
        strokeDashArray: [5, 5]
        left: myConvasWidth
        top: o.e.layerY
        stroke: '#b35c00'
        selectable: false
        angle: 90))
      position.DrawingWithMouseLineLeft = canvas.add(new (fabric.Line)([0, 0, 0, myConvasHeight],
        class: 'contur'
        strokeDashArray: [5, 5]
        left: o.e.layerX
        top: 0
        stroke: '#b35c00'
        selectable: false))
      position.DrawingWithMouseLineLeft = canvas.add(new (fabric.Line)([0, 0, 0, myConvasHeight],
        class: 'contur-right'
        strokeDashArray: [5, 5]
        left: 0
        top: 0
        stroke: '#b35c00'
        selectable: false))
      position.DrawingWithMouseLineLeft = canvas.add(new (fabric.Line)([0, 0, 0, myConvasWidth],
        class: 'contur-bottom'
        strokeDashArray: [5, 5]
        left: 0
        top: 0
        stroke: '#b35c00'
        angle: 90
        selectable: false))
      canvas.renderAll()
    else if command == 'rightBottomContur'
      canvasObjects = canvas.getObjects()
      for obj of canvasObjects
        if canvasObjects[obj].class == 'contur-right'
          canvasObjects[obj].set left: o.e.layerX
        if canvasObjects[obj].class == 'contur-bottom'
          canvasObjects[obj].set left: canvasContainer.offsetWidth
          canvasObjects[obj].set top: o.e.layerY
      canvas.renderAll()
    else if command == 'delContur'
      canvasObjects = canvas.getObjects()
      ObjectsArray = new Array
      delContur()
    else if command == 'DrawingConturGrid'
      myConvasHeight = parseInt(myConvas.style.height)
      myConvasWidth = parseInt(myConvas.style.width)
      canvas.add new (fabric.Line)([0, 0, 0, myConvasWidth],
        strokeDashArray: [5, 5]
        left: 62
        top: 0
        stroke: '#b35c00'
        selectable: false)
      canvas.add new (fabric.Line)([0, 0, 0, myConvasWidth],
        strokeDashArray: [5, 5]
        left: myConvasWidth - 62
        top: 0
        stroke: '#b35c00'
        selectable: false)
      canvas.add new (fabric.Line)([0, 0, 0, myConvasWidth],
        strokeDashArray: [5, 5]
        left: myConvasWidth
        top: 62
        stroke: '#b35c00'
        selectable: false
        angle: 90)
      canvas.add new (fabric.Line)([0, 0, 0, myConvasWidth],
        strokeDashArray: [5, 5]
        left: myConvasWidth
        top: canvasContainer.offsetHeight - 62
        stroke: '#b35c00'
        selectable: false
        angle: 90)
      canvas.renderAll()
    return
# КОНТУР

# КУРСОР
  Cursor: ->
    handler = (event) ->
      document.getElementById('cursor').style.top = event.pageY + 'px'
      document.getElementById('cursor').style.left = event.pageX + 'px'
      return
    cursorBlockHideShow = (event) ->
      if event.type == 'mouseover'
        document.getElementById('cursor').style.opacity = 1
      else if event.type == 'mouseout'
        document.getElementById('cursor').style.opacity = 0
    document.onmousemove = handler
    document.getElementById('convasElContextMenu').onmouseover = document.getElementById('convasElContextMenu').onmouseout = document.getElementById('convasContextMenu').onmouseover = document.getElementById('convasContextMenu').onmouseout = document.getElementById('canvasContainer').onmouseover = document.getElementById('canvasContainer').onmouseout = cursorBlockHideShow
    return
# КУРСОР

# КРАСНАЯ РАМКА
  RedBorder: (e, type) ->
    if type == 'over'
      if e.target.type == 'rect' or e.target.type == 'circle' or e.target.type == 'triangle' or e.target.type == 'group'
        e.target.set
          strokeWidth: 5
          stroke: 'red'
          width: e.target.width - 5
          height: e.target.height - 5
    else if type == 'out'
      try
        if e.target.type == 'rect' or e.target.type == 'circle' or e.target.type == 'triangle' or e.target.type == 'group'
          e.target.set
            strokeWidth: 0
            width: e.target.width + 5
            height: e.target.height + 5
      catch err
    canvas.renderAll()
# КРАСНАЯ РАМКА

# СООБЩЕНИЕ
  sayForAUser: (text) ->
    x = document.getElementById('snackbar')
    x.innerHTML = text
    x.className = 'show'
    setTimeout (->
      x.className = x.className.replace('show', '')
    ), 3000
# СООБЩЕНИЕ

window.onload = ->
  position.Start()


  canvas.on 'object:modified', (options) ->
# ПРИМАГНИЧИВАНИЕ ПЕРЕМЫЧЕК
# перебор всех объектов
    canvas.forEachObject (targ) ->
# получение активного объекта
      activeObject = canvas.getActiveObject()
      if(activeObject != null)
        if targ != activeObject and activeObject.angle == 0 and targ.angle == 0 and activeObject.get('name') == 'jumper' and targ.get('type') != 'line'
# получение данных для вычислений
          targLeft = targ.getLeft()
          targWidth = targ.getWidth()
          targTop = targ.getTop()
          targHeight = targ.getHeight()
          activeLeft = activeObject.getLeft()
          activeWidth = activeObject.getWidth()
          activeTop = activeObject.getTop()
          activeHeight = activeObject.getHeight()
          # получения колличества перемычек
          jumperCount = 0
          canvas.forEachObject (targ) ->
            if targ.get('name') == 'jumper'
              jumperCount++
          # есль перемычка одна
          if jumperCount == 1
            if Math.abs(targLeft - activeLeft) <= 10 and Math.abs(targTop - activeTop) <= 10
              activeObject.left = targLeft
              activeObject.width = targWidth - 5
              activeObject.top = targTop
              activeObject.height = targHeight
            else if Math.abs(targLeft - activeLeft) <= 10 and Math.abs(targTop + targHeight - (activeTop + activeHeight)) <= 10
              activeObject.left = targLeft
              activeObject.width = targWidth - 5
              activeObject.top = targTop + targHeight - activeHeight
              activeObject.height = targHeight





# canvas.on('before:selection:cleared', function(){
#     $('#log').append('before:selection:cleared!!!!<br />');
# });
# 	fabric.Canvas.prototype._setCornerCursor = function (corner, target) {
#             var style = this.upperCanvasEl.style;
#             if (corner === 'tr'){
#                 console.log("aaaa");
#             }
#             // if (corner === 'tr' || corner === 'tl' || corner === 'br' || corner === 'bl') {
#             //     style.cursor = this.defaultCursor;
#             //     console.log("aaaa");
#             // }
#             //  else if (corner === 'mt' || corner === 'mb' ||  corner === 'ml' || corner === 'mr' ){
#             //     style.cursor = 'pointer';
#             //     console.log("sss");
#             // }
#             // else {
#             //     style.cursor = this.defaultCursor;
#             //     return false;
#     // }
# }
# JSON.stringify(canvas);
# canvas.loadFromJSON(json, canvas.renderAll())
#  document.body.style.cursor = "url(arrow.png)";
# canvas.defaultCursor = 'url(arrow.png), e-resize';
# // canvas.defaultCursor  = "url('arrow.png'), auto";
# // canvas.freeDrawingCursor = "url('arrow.png'), auto";
# canvas.moveCursor = "url('arrow.png'), auto";
# canvas.hoverCursor = "url('arrow.png'), auto";
# canvas.rotationCursor   = "url('arrow.png'), auto";
# canvas.moveCursor = "url('arrow.png'), auto";
# canvas.moveCursor = "url('arrow.png'), auto";
# canvas.moveCursor = "url('arrow.png'), auto";
# canvas.moveCursor = "url('arrow.png'), auto";
# canvas.moveCursor = "url('arrow.png'), auto";
# canvas.moveCursor = "url('arrow.png'), auto";
#  canvas.hoverCursor = "url('arrow.png'), auto";
# canvas.moveCursor= "url('arrow.png'), auto";
# hoverCursor= "url('arrow.png'), auto";
#     /**
#      * Default cursor value used when moving an object on canvas
#      * @type String
#      * @default
#      */
#     canvas.moveCursor= "url('arrow.png'), auto";
#     /**
#      * Default cursor value used for the entire canvas
#      * @type String
#      * @default
#      */
#     canvas.defaultCursor= "url('arrow.png'), auto";
#     /**
#      * Cursor value used during free drawing
#      * @type String
#      * @default
#      */
#     canvas.freeDrawingCursor= "url('arrow.png'), auto";
#     /**
#      * Cursor value used for rotation point
#      * @type String
#      * @default
#      */
#     canvas.rotationCursor= "url('arrow.png'), auto";

# ---
# generated by js2coffee 2.2.0











