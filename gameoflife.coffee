class GameOfLife extends KDView
  
  GRIDCOLOR = "#eee"
  CELLCOLOR = "rgba(4, 156, 83,.8)"
  CELLSIZE  = 8
  LIFETIME  = 10000
  WAIT      = 10

  getMap:->

    [w, h] = [@w/CELLSIZE|0, @h/CELLSIZE|0]
    m = []
    for i in [0..h]
      m.push []
      for j in [0..w]
        m[i].push 0 
    return m    

  buildScene:->
  
    {context} = this
    {w, h} = @getBounds()

    context.beginPath()
    context.strokeStyle = GRIDCOLOR
    
    # Draw the grid
    for i in [0..Math.max(w, h)] by CELLSIZE
      context.moveTo 0, i
      context.lineTo w, i
      context.moveTo i, 0
      context.lineTo i, h

    context.lineWidth = 1
    context.stroke()
  
  addDot:(x,y,keep)->

    if keep
      @dotmap[y][x] = 1
      @updateLog()
      
    @context.fillStyle = CELLCOLOR    
    @context.fillRect x*CELLSIZE, y*CELLSIZE, CELLSIZE, CELLSIZE

  rmDot:(x,y,keep)->
    
    if keep
      @dotmap[y][x] = 0
      @updateLog()    
      
    @context.fillStyle = if keep then "white" else "#A7F4BE"
    @context.fillRect x*CELLSIZE, y*CELLSIZE, CELLSIZE, CELLSIZE

  updateLog:->
    log = @getOption 'logto'
    @_alive = 0
    for line in @dotmap
      @_alive += @total line
    log.updatePartial "Generation: #{@_totalgeneration}, Live cell: #{@_alive}"

  createDot:(event, removeIfExists)->

    {offsetX, offsetY} = event
    x = offsetX / CELLSIZE | 0
    y = offsetY / CELLSIZE | 0

    if @dotmap[y][x]
    then if removeIfExists then @rmDot x, y, yes
    else @addDot x, y, yes

  createCanvas:->

    @canvas?.destroy()
  
    @addSubView @canvas = new KDCustomHTMLView
      tagName    : "canvas"
      bind       : "mousemove mouseleave"
      attributes : @getSceneSize()
    @context = @canvas.getElement().getContext "2d"
          
    @canvas.on "mousemove", (event)=>
      return  if @_running
      @_moved = yes
      @createDot event  if @_mousedown
        
    @canvas.on "mousedown", => @_mousedown = yes
    @canvas.on "mouseleave", => @_mousedown = no

    @canvas.on "mouseup", (event)=>
      @_mousedown = no
      @createDot event, yes  unless @_running

    @buildScene()
    
  cleanup:->
    @canvas.setAttributes @getSceneSize()

  getSceneSize:->
    bounds = width: @getWidth(), height: @getHeight()
    [@w, @h] = [bounds.width, bounds.height]
    bounds

  reset:->

    @_alive = 0
    @_generation = 0
    @_totalgeneration = 0

    @getSceneSize()
    @dotmap = @getMap()

    @createCanvas()
    @updateLog()

  total:(arr)-> 
    total = 0; i=arr.length
    total += arr[i]  while(i--)
    return total
    
  slice:(x,y)-> @dotmap[y]?[Math.max(0, x-1)..x+1] or []
  stop:-> @_generation = LIFETIME
  
  generate:(reset=no)->
    
    @_generation = 0  if reset

    if @_generation >= LIFETIME
      @_running = no
      return console.info "Life is over after #{@_generation} generation."
    
    @_generation++
    @_totalgeneration++

    @_running = yes

    _map = @getMap()
    
    for line, y in @dotmap
      for dot, x in line
        
        upLevel   = @total @slice x, y-1
        sameLevel = @total(@slice x, y ) - dot
        downLevel = @total @slice x, y+1
        total     = @total [upLevel, sameLevel, downLevel]
        
        if dot 
          if (total < 2 or total > 3)
            @rmDot x, y
            _map[y][x] = 0
          else
            @addDot x, y
            _map[y][x] = 1
                    
        else if total is 3
          @addDot x, y
          _map[y][x] = 1
    
    @updateLog()
    @dotmap = _map
    KD.utils.wait WAIT, => @generate()