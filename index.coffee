class GameoflifeMainView extends KDView

  constructor:(options = {}, data)->
    options.cssClass = 'gameoflife main-view'
    super options, data

  viewAppended:->
  
    new KDModalView
      title : "Game of Life"
      content : """
        <p>The Game of Life, also known simply as Life, is a cellular automaton 
        devised by the British mathematician John Horton Conway in 1970.</p>

        <p>The "game" is a zero-player game, meaning that its evolution is 
        determined by its initial state, requiring no further input. One 
        interacts with the Game of Life by creating an initial configuration
        and observing how it evolves.</p>

        <p>You can seed the game by clicking on the map and use the control
        buttons at the bottom left.</p>
      """
      buttons      :
        "Got it"   :
          callback : -> @getDelegate().destroy()
  
    @addSubView header = new KDHeaderView
      title : "Game of Life"
      type : "medium"
      
    header.addSubView log = new KDView
      cssClass : 'log'
      
    @addSubView grid = new GameOfLife
      cssClass : 'grid'
      logto : log
    
    @addSubView buttons = new KDView
      cssClass : 'button-area'
      
    buttons.addSubView new KDButtonView
      title : "Run"
      cssClass: "solid green"
      callback : ->
        if grid._running
          @setTitle 'Run'
          grid.stop()
        else
          @setTitle 'Stop'
          grid.generate yes
          
    buttons.addSubView new KDButtonView
      title : "Clear"
      cssClass: "solid red"
      callback : -> grid.reset()
      
    KD.utils.defer -> grid.reset()

    
class GameoflifeController extends AppController

  constructor:(options = {}, data)->
    options.view    = new GameoflifeMainView
    options.appInfo =
      name : "Gameoflife"
      type : "application"

    super options, data


do ->

  # In live mode you can add your App view to window's appView
  if appView?

    view = new GameoflifeMainView
    appView.addSubView view

  else

    KD.registerAppClass GameoflifeController,
      name     : "Gameoflife"
      routes   :
        "/:name?/Gameoflife" : null
        "/:name?/gokmen/Apps/Gameoflife" : null
      dockPath : "/gokmen/Apps/Gameoflife"
      behavior : "application"