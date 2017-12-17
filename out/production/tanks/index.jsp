
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Realtime chess</title>
  </head>
  <body>


  <canvas id="canvas" style="display:none;" >

  </canvas>


  <script>
      var map = "map.json"
      <%--<%=request.getParameter("map") == null ? "map.json" : request.getParameter("map")%>--%>
  </script>
  <script src="/engine/GameSettings.js"></script>
  <script src="/engine/MapManager.js"></script>
  <script src="/engine/RouteManager.js"></script>
  <script src="/engine/AIManager.js"></script>
  <script src="/engine/SpriteManager.js"></script>
  <script src="/engine/EventsManager.js"></script>
  <script src="/engine/PhysicManager.js"></script>
  <script src="/engine/SoundManager.js"></script>
  <script src="/engine/GameManager.js"></script>
  <script src="/engine/Units.js"></script>
  <script src="/engine.js"></script>


  <script>
    function lunch() {
        gameManager.play('/json/' + map);
        document.getElementById('canvas').style.display='block';
        document.getElementById('menu').style.display='none';
    }
  </script>

  <div id="menu" style="width: 500px; height: 500px; background: #5f9929; display: block">
    <a href="#" onclick="lunch()"><h1>Start game</h1></a>
  </div>

  <script>
      if(map=="map2.json"){
          lunch();
      }
  </script>

  </body>
</html>
