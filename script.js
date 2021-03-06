// Generated by CoffeeScript 1.6.3
(function() {
    this.canvas = new fabric.Canvas('myConvas', {
    height: canvasContainer.offsetWidth / 2 > canvasContainer.offsetHeight / 2 ? 500 : canvasContainer.offsetWidth / 2,
    width: canvasContainer.offsetWidth,
    selectionColor: 'rgba(245, 215, 155, 0.5)'
  });

    this.position = {
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
    drawingType: 'circle',
    GetAndSetAreaStream: 0,
    DrawingWithMouseLineTop: 0,
    DrawingWithMouseLineBottom: 0,
    DrawingWithMouseLineRigth: 0,
    DrawingWithMouseLineLeft: 0,
    Start: function() {
      if (!position.isEventOn) {
        position.Events();
      }
      document.oncontextmenu = function(e) {
        position.ShowCanvasMenu(e);
        return false;
      };
      position.Cursor();
      position.Contur(0, 'DrawingConturGrid');
    },
    Events: function() {
      position.isEventOn = true;
      canvas.on('object:selected', position.EventObjectSelected);
      canvas.on('object:modified', position.EventObjectModified);
      canvas.on('object:added', position.EventObjectAdded);
      canvas.on('object:removed', position.EventObjectAdded);
      canvas.on('object:moving', position.EventObjectMoving);
      canvas.on('mouse:move', function(o) {
        position.tempX = o.pageX;
        position.tempY = o.pageY;
        if (o.target) {
          position.cursorOnElElemetObj = o.target;
          position.isCursorOnEl = true;
          position.cursorOnElElemetHeight = o.target.height;
          position.cursorOnElElemetWidth = o.target.cacheWidth;
        } else {
          position.isCursorOnEl = false;
        }
        position.Contur(o, 'rightBottomContur');
      });
      canvas.on('mouse:down', function(o) {
        position.firstClickPositionX = o.e.layerX;
        position.firstClickPositionY = o.e.layerY;
        position.StartDrawingWithMouse(o);
        canvas.bringToFront(canvas.getActiveObject());
      });
      canvas.on('mouse:up', function(o) {
        position.lastClickPositionX = o.e.layerX;
        position.lastClickPositionY = o.e.layerY;
        position.StopDrawingWithMouse(o);
      });
      selectOn.onclick = function() {
        position.isSelectionMode = true;
      };
      selectOf.onclick = function() {
        position.isSelectionMode = false;
      };
      group.onclick = function() {
        position.Group();
      };
      ungroup.onclick = function() {
        position.Ungroup();
      };
      remove.onclick = function() {
        position.RemoveSelect();
      };
      setTypeRect.onclick = function() {
        position.drawingType = 'rect';
      };
      setTypeCircle.onclick = function() {
        position.drawingType = 'circle';
      };
      setTypeTriangle.onclick = function() {
        position.drawingType = 'triangle';
      };
        setTypeJumperRect.onclick = function () {
            return position.drawingType = 'jumperRect';
        };
        setTypeJumperCircle.onclick = function () {
            return position.drawingType = 'jumperCircle';
        };
        setTypeJumperTriangle.onclick = function () {
            return position.drawingType = 'jumperTriangle';
      };
      heightElInput.oninput = function() {
        canvas.getActiveObject().setHeight(parseInt(heightElInput.value));
        canvas.getActiveObject().scaleY = 1;
        canvas.renderAll();
      };
      widthElInput.oninput = function() {
        canvas.getActiveObject().setWidth(parseInt(widthElInput.value));
        canvas.getActiveObject().scaleX = 1;
        canvas.renderAll();
      };
      document.onclick = function() {
        position.HideCanvasMenu();
      };
      window.onresize = function(event) {
        canvas.setHeight(canvasContainer.offsetWidth / 2 > canvasContainer.offsetHeight / 2 ? 500 : canvasContainer.offsetWidth / 2);
        canvas.setWidth(canvasContainer.offsetWidth);
      };
      canvas.on('mouse:over', function(e) {
        position.RedBorder(e, 'over');
      });
      canvas.on('mouse:out', function(e) {
        position.RedBorder(e, 'out');
      });
    },
    EventObjectMoving: function() {
      canvas.forEachObject(function(targ) {
        position.BlocksMagnet(targ);
      });
      canvas.renderAll();
    },
    EventObjectRemoved: function() {
      position.ShowInfo();
      position.GetAndSetArea();
    },
    EventObjectModified: function(e) {
      position.SetDataToCanvasMenu(e);
      position.ShowInfo();
      position.GetAndSetArea();
    },
    EventObjectSelected: function(e) {
      position.SetDataToCanvasMenu(e);
    },
    EventObjectAdded: function(e) {
      position.SetDataToCanvasMenu(e);
      position.ShowInfo();
      position.GetAndSetArea();
    },
    ShowCanvasMenu: function(e) {
      if (!position.isCursorOnEl) {
        convasContextMenu.style.display = 'block';
        convasContextMenu.style.top = e.clientY + 'px';
        convasContextMenu.style.left = e.clientX + 'px';
        convasElContextMenu.style.display = 'none';
      } else {
        convasElContextMenu.style.display = 'block';
        convasElContextMenu.style.top = e.clientY + 'px';
        convasElContextMenu.style.left = e.clientX + 'px';
        convasContextMenu.style.display = 'none';
      }
    },
    ShowInfo: function() {
      canvas.getObjects().map(function(o) {
        var id, type;
        if (o.get('type') !== 'line') {
          id = o.get('id');
          type = o.get('type');
        }
      });
    },
    HideCanvasMenu: function() {
      convasElContextMenu.style.display = 'none';
      convasContextMenu.style.display = 'none';
    },
    SetDataToCanvasMenu: function(evt) {
      var activeObject;
      activeObject = canvas.getActiveObject();
      if (activeObject !== void 0) {
        document.getElementById('heightElInput').value = parseInt(evt.target.getHeight() - 1);
        document.getElementById('widthElInput').value = parseInt(evt.target.getWidth() - 1);
      }
    },
    StartDrawingWithMouse: function(o) {
      if (!position.isCursorOnEl && !position.isSelectionMode) {
        position.isStartDrawingWithMouse = true;
        position.Contur(o, 'Add');
        canvas.remove(position.DrawingWithMouseLineLeft);
      }
    },
    StopDrawingWithMouse: function(o) {
      var el;
      el = 0;
      if (position.isStartDrawingWithMouse) {
        position.isStartDrawingWithMouse = false;
        position.Contur(o, 'delContur');
        if (position.drawingType === 'rect') {
          el = new fabric.Rect({
            left: position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX : position.lastClickPositionX,
            top: position.firstClickPositionY < position.lastClickPositionY ? position.firstClickPositionY : position.lastClickPositionY,
            fill: '#eccdae',
            width: Math.abs(position.firstClickPositionX - position.lastClickPositionX) > 100 ? Math.abs(position.firstClickPositionX - position.lastClickPositionX) : 100,
            height: Math.abs(position.firstClickPositionY - position.lastClickPositionY) > 100 ? Math.abs(position.firstClickPositionY - position.lastClickPositionY) : 100
          });
        } else if (position.drawingType === 'circle') {
            el = new fabric.Circle({
                radius: Math.abs(position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX - position.lastClickPositionX : position.lastClickPositionX - position.firstClickPositionX) / 2 < 100 ? 100 : Math.abs(position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX - position.lastClickPositionX : position.lastClickPositionX - position.firstClickPositionX) / 2,
                fill: '#eccdae',
                left: position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX : position.lastClickPositionX,
                top: position.firstClickPositionY < position.lastClickPositionY ? position.firstClickPositionY : position.lastClickPositionY
            });
        } else if (position.drawingType === 'triangle') {
            el = new fabric.Triangle({
                left: position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX : position.lastClickPositionX,
                top: position.firstClickPositionY < position.lastClickPositionY ? position.firstClickPositionY : position.lastClickPositionY,
                fill: '#eccdae',
                width: Math.abs(position.firstClickPositionX - position.lastClickPositionX) > 100 ? Math.abs(position.firstClickPositionX - position.lastClickPositionX) : 100,
                height: Math.abs(position.firstClickPositionY - position.lastClickPositionY) > 100 ? Math.abs(position.firstClickPositionY - position.lastClickPositionY) : 100
            });
        } else if (position.drawingType === 'jumperRect') {
          el = new fabric.Rect({
            name: 'jumper',
            left: position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX : position.lastClickPositionX,
            top: position.firstClickPositionY < position.lastClickPositionY ? position.firstClickPositionY : position.lastClickPositionY,
            fill: '#fec180',
            width: Math.abs(position.firstClickPositionX - position.lastClickPositionX) > 100 ? Math.abs(position.firstClickPositionX - position.lastClickPositionX) : 100,
            height: Math.abs(position.firstClickPositionY - position.lastClickPositionY) > 100 ? Math.abs(position.firstClickPositionY - position.lastClickPositionY) : 100
          });
        } else if (position.drawingType === 'jumperCircle') {
          el = new fabric.Circle({
              name: 'jumper',
            radius: Math.abs(position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX - position.lastClickPositionX : position.lastClickPositionX - position.firstClickPositionX) / 2 < 100 ? 100 : Math.abs(position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX - position.lastClickPositionX : position.lastClickPositionX - position.firstClickPositionX) / 2,
              fill: '#fec180',
            left: position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX : position.lastClickPositionX,
            top: position.firstClickPositionY < position.lastClickPositionY ? position.firstClickPositionY : position.lastClickPositionY
          });
        } else if (position.drawingType === 'jumperTriangle') {
          el = new fabric.Triangle({
              name: 'jumper',
              fill: '#fec180',
            left: position.firstClickPositionX < position.lastClickPositionX ? position.firstClickPositionX : position.lastClickPositionX,
            top: position.firstClickPositionY < position.lastClickPositionY ? position.firstClickPositionY : position.lastClickPositionY,
            width: Math.abs(position.firstClickPositionX - position.lastClickPositionX) > 100 ? Math.abs(position.firstClickPositionX - position.lastClickPositionX) : 100,
            height: Math.abs(position.firstClickPositionY - position.lastClickPositionY) > 100 ? Math.abs(position.firstClickPositionY - position.lastClickPositionY) : 100
          });
        }
        return canvas.add(el);
      }
    },
    RemoveSelect: function() {
      var aaa, activeGroup, activeObject, objectsInGroup;
      activeObject = canvas.getActiveObject();
      activeGroup = canvas.getActiveGroup();
      if (activeObject) {
        aaa = activeObject.getBoundingRect();
        if (confirm('Are you sure?')) {
          return canvas.remove(activeObject);
        }
      } else if (activeGroup) {
        if (confirm('Are you sure?')) {
          objectsInGroup = activeGroup.getObjects();
          canvas.discardActiveGroup();
          return objectsInGroup.forEach(function(object) {
            canvas.remove(object);
          });
        }
      }
    },
    Group: function() {
      var activegroup, error, objectsInGroup;
      activegroup = canvas.getActiveGroup();
      try {
        objectsInGroup = activegroup.getObjects();
        return activegroup.clone(function(newgroup) {
          canvas.discardActiveGroup();
          objectsInGroup.forEach(function(object) {
            return canvas.remove(object);
          });
          return canvas.add(newgroup);
        });
      } catch (_error) {
        error = _error;
          return position.sayForAUser("I can\'t group the one element");
      }
    },
    Ungroup: function() {
      var activeObject, error, i, items;
      try {
        activeObject = canvas.getActiveObject();
        if (activeObject.type === 'group') {
          items = activeObject._objects;
          activeObject._restoreObjectsState();
          canvas.remove(activeObject);
          i = 0;
          while (i < items.length) {
            canvas.add(items[i]);
            canvas.item(canvas.size() - 1).hasControls = true;
            i++;
          }
          return canvas.renderAll();
        }
      } catch (_error) {
        error = _error;
          return position.sayForAUser('I can\'t ungroup the one element or the item is not selected!');
      }
    },
    BlocksMagnet: function(targ) {
      var activeHeight, activeLeft, activeObject, activeTop, activeWidth, targHeight, targLeft, targTop, targWidth;
      activeObject = canvas.getActiveObject();
      if (activeObject !== null) {
        if (targ === activeObject) {
          return;
        }
        targLeft = targ.getLeft();
        targWidth = targ.getWidth();
        targTop = targ.getTop();
        targHeight = targ.getHeight();
        activeLeft = activeObject.getLeft();
        activeWidth = activeObject.getWidth();
        activeTop = activeObject.getTop();
        activeHeight = activeObject.getHeight();
        if (activeObject.get('name') !== 'jumper') {
          if (Math.abs(targLeft + targWidth - activeLeft) <= 10 && activeTop + activeHeight > targTop && activeTop < targTop + targHeight) {
            return activeObject.left = targLeft + targWidth;
          } else if (Math.abs(activeLeft + activeWidth - targLeft) <= 10 && activeTop + activeHeight > targTop && activeTop < targTop + targHeight) {
            return activeObject.left = targLeft - activeWidth;
          } else if (Math.abs(activeTop + activeHeight - targTop) <= 10 && activeLeft + activeWidth > targLeft && activeLeft < targLeft + targWidth) {
            return activeObject.top = targTop - activeHeight;
          } else if (Math.abs(activeTop - (targTop + targHeight)) <= 10 && activeLeft + activeWidth > targLeft && activeLeft < targLeft + targWidth) {
            return activeObject.top = targTop + targHeight;
          }
        } else {
          if (Math.abs(targLeft - activeLeft) <= 30 && Math.abs(targTop - activeTop) <= 30) {
            activeObject.left = targLeft;
            return activeObject.top = targTop;
          } else if (Math.abs(targLeft + targWidth - (activeLeft + activeWidth)) <= 30 && Math.abs(targTop - activeTop) <= 30) {
            activeObject.left = targLeft + targWidth - activeWidth;
            return activeObject.top = targTop;
          } else if (Math.abs(targLeft + targWidth - (activeLeft + activeWidth)) <= 30 && Math.abs(targTop + targHeight - (activeTop + activeHeight)) <= 30) {
            activeObject.left = targLeft + targWidth - activeWidth;
            return activeObject.top = targHeight + targTop - activeHeight;
          } else if (Math.abs(targLeft - activeLeft) <= 30 && Math.abs(targTop + targHeight - (activeTop + activeHeight)) <= 30) {
            activeObject.left = targLeft;
            return activeObject.top = targHeight + targTop - activeHeight;
          }
        }
      }
    },
    GridDrawing: function() {},
    GetAndSetArea: function() {
      var StartAgain, angle, count, maxLeft, maxTop, minLeft, minTop, time;
      minLeft = 0;
      maxLeft = 0;
      minTop = 0;
      maxTop = 0;
      angle = 0;
        count = 0;
      StartAgain = function() {
          var c, j, p;
        if (position.GetAndSetAreaStream === 1) {
          if (minLeft < maxLeft) {
            j = minTop;
            while (j < maxTop) {
              c = canvas.getContext('2d');
              p = c.getImageData(minLeft, j, 1, 1).data;
                if (p[0] !== 0) {
                count = count + 1;
              }
              j++;
            }
              return setTimeout((function () {
              minLeft++;
                  return StartAgain();
            }), 0);
          } else {
            document.getElementById('areaInfoFild').textContent = count;
              return position.GetAndSetAreaStream--;
          }
        } else if (position.GetAndSetAreaStream > 1) {
          position.GetAndSetAreaStream = 0;
            return setTimeout((function () {
                return position.GetAndSetArea();
          }), 10);
        }
      };
      document.getElementById('areaInfoFild').textContent = 'Идет подсчет';
      canvas.forEachObject(function(obj) {
        if (obj.type !== 'line') {
          if (obj.angle !== 0) {
            angle = obj.angle;
          }
          if (minLeft === 0) {
            minLeft = obj.left;
          } else if (minLeft > obj.left) {
            minLeft = obj.left;
          }
          if (maxLeft === 0) {
            maxLeft = obj.left + obj.width;
          } else if (maxLeft < obj.left + obj.width) {
            maxLeft = obj.left + obj.width;
          }
          if (minTop === 0) {
            minTop = obj.top;
          } else if (minTop > obj.top) {
            minTop = obj.top;
          }
          if (maxTop === 0) {
              return maxTop = obj.top + obj.height;
          } else if (maxTop < obj.top + obj.height) {
              return maxTop = obj.left + obj.width;
          }
        }
      });
      if (angle !== 0) {
        minLeft = 0;
        maxLeft = parseInt(myConvas.style.width);
        maxTop = parseInt(myConvas.style.height);
        minTop = 0;
      }
      position.GetAndSetAreaStream++;
      time = performance.now();
      count = 0;
        return StartAgain();
    },
    Contur: function(o, command) {
      var ObjectsArray, canvasObjects, delContur, myConvasHeight, myConvasWidth, obj;
      delContur = function() {
          var obj, _results;
          _results = [];
        for (obj in canvasObjects) {
          if (canvasObjects[obj]["class"] === 'contur' || canvasObjects[obj]["class"] === 'contur-right' || canvasObjects[obj]["class"] === 'contur-bottom') {
            canvas.remove(canvasObjects[obj]);
              _results.push(delContur());
          } else {
              _results.push(void 0);
          }
        }
          return _results;
      };
      if (command === 'Add') {
        myConvasHeight = parseInt(myConvas.style.height);
        myConvasWidth = parseInt(myConvas.style.width);
        position.DrawingWithMouseLineTop = canvas.add(new fabric.Line([0, 0, 0, myConvasWidth], {
          "class": 'contur',
          strokeDashArray: [5, 5],
          left: myConvasWidth,
          top: o.e.layerY,
          stroke: '#b35c00',
          selectable: false,
          angle: 90
        }));
        position.DrawingWithMouseLineLeft = canvas.add(new fabric.Line([0, 0, 0, myConvasHeight], {
          "class": 'contur',
          strokeDashArray: [5, 5],
          left: o.e.layerX,
          top: 0,
          stroke: '#b35c00',
          selectable: false
        }));
        position.DrawingWithMouseLineLeft = canvas.add(new fabric.Line([0, 0, 0, myConvasHeight], {
          "class": 'contur-right',
          strokeDashArray: [5, 5],
          left: 0,
          top: 0,
          stroke: '#b35c00',
          selectable: false
        }));
        position.DrawingWithMouseLineLeft = canvas.add(new fabric.Line([0, 0, 0, myConvasWidth], {
          "class": 'contur-bottom',
          strokeDashArray: [5, 5],
          left: 0,
          top: 0,
          stroke: '#b35c00',
          angle: 90,
          selectable: false
        }));
        canvas.renderAll();
      } else if (command === 'rightBottomContur') {
        canvasObjects = canvas.getObjects();
        for (obj in canvasObjects) {
          if (canvasObjects[obj]["class"] === 'contur-right') {
            canvasObjects[obj].set({
              left: o.e.layerX
            });
          }
          if (canvasObjects[obj]["class"] === 'contur-bottom') {
            canvasObjects[obj].set({
              left: canvasContainer.offsetWidth
            });
            canvasObjects[obj].set({
              top: o.e.layerY
            });
          }
        }
        canvas.renderAll();
      } else if (command === 'delContur') {
        canvasObjects = canvas.getObjects();
          ObjectsArray = [];
        delContur();
      } else if (command === 'DrawingConturGrid') {
        myConvasHeight = parseInt(myConvas.style.height);
        myConvasWidth = parseInt(myConvas.style.width);
          canvas.add(new fabric.Line([0, 0, 0, myConvasWidth], {
          strokeDashArray: [5, 5],
          left: 62,
          top: 0,
          stroke: '#b35c00',
          selectable: false
        }));
          canvas.add(new fabric.Line([0, 0, 0, myConvasWidth], {
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
    },
    Cursor: function() {
      var cursorBlockHideShow, handler;
      handler = function(event) {
        document.getElementById('cursor').style.top = event.pageY + 'px';
        document.getElementById('cursor').style.left = event.pageX + 'px';
      };
      cursorBlockHideShow = function(event) {
        if (event.type === 'mouseover') {
            return document.getElementById('cursor').style.opacity = 1;
        } else if (event.type === 'mouseout') {
            return document.getElementById('cursor').style.opacity = 0;
        }
      };
      document.onmousemove = handler;
      document.getElementById('convasElContextMenu').onmouseover = document.getElementById('convasElContextMenu').onmouseout = document.getElementById('convasContextMenu').onmouseover = document.getElementById('convasContextMenu').onmouseout = document.getElementById('canvasContainer').onmouseover = document.getElementById('canvasContainer').onmouseout = cursorBlockHideShow;
    },
    RedBorder: function(e, type) {
      var err;
      if (type === 'over') {
        if (e.target.type === 'rect' || e.target.type === 'circle' || e.target.type === 'triangle' || e.target.type === 'group') {
          e.target.set({
            strokeWidth: 5,
            stroke: 'red',
            width: e.target.width - 5,
            height: e.target.height - 5
          });
        }
      } else if (type === 'out') {
        try {
          if (e.target.type === 'rect' || e.target.type === 'circle' || e.target.type === 'triangle' || e.target.type === 'group') {
            e.target.set({
              strokeWidth: 0,
              width: e.target.width + 5,
              height: e.target.height + 5
            });
          }
        } catch (_error) {
          err = _error;
        }
      }
        return canvas.renderAll();
    },
        sayForAUser: function (text) {
            var x;
            x = document.getElementById('snackbar');
            x.innerHTML = text;
            x.className = 'show';
            return setTimeout((function () {
                return x.className = x.className.replace('show', '');
            }), 3000);
    }
  };

  window.onload = function() {
    position.Start();
      return canvas.on('object:modified', function (options) {
          return canvas.forEachObject(function (targ) {
              var activeHeight, activeLeft, activeObject, activeTop, activeWidth, jumperCount, targHeight, targLeft, targTop, targWidth;
              activeObject = canvas.getActiveObject();
              if (activeObject !== null) {
                  if (targ !== activeObject && activeObject.angle === 0 && targ.angle === 0 && activeObject.get('name') === 'jumper' && targ.get('type') !== 'line') {
                      targLeft = targ.getLeft();
                      targWidth = targ.getWidth();
                      targTop = targ.getTop();
                      targHeight = targ.getHeight();
                      activeLeft = activeObject.getLeft();
                      activeWidth = activeObject.getWidth();
                      activeTop = activeObject.getTop();
                      activeHeight = activeObject.getHeight();
                      jumperCount = 0;
                      canvas.forEachObject(function (targ) {
                          if (targ.get('name') === 'jumper') {
                              return jumperCount++;
                          }
                      });
                      if (jumperCount === 1) {
                          if (Math.abs(targLeft - activeLeft) <= 10 && Math.abs(targTop - activeTop) <= 10) {
                              activeObject.left = targLeft;
                              activeObject.width = targWidth - 5;
                              activeObject.top = targTop;
                              return activeObject.height = targHeight;
                          } else if (Math.abs(targLeft - activeLeft) <= 10 && Math.abs(targTop + targHeight - (activeTop + activeHeight)) <= 10) {
                              activeObject.left = targLeft;
                              activeObject.width = targWidth - 5;
                              activeObject.top = targTop + targHeight - activeHeight;
                              return activeObject.height = targHeight;
                          }
                      }
                  }
              }
          });
      });
  };

}).call(this);
