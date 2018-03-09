   // takes in a json object, and initialize the network.
   function createGraph(nodes, edges) {
       var data = {
           nodes: new vis.DataSet(nodes),
           edges: new vis.DataSet(edges)
       };

       var options = {
           height: '100%',
           width: '100%',
           locale: 'jp',
           nodes: {
               scaling: {
                   min: 1,
                   max: 50,
                   label: {
                       enabled: true,
                       min: 10,
                       max: 30,
                       maxVisible: 30,
                       drawThreshold: 5
                   },
               },
           },
           edges: {
               physics: true,
               smooth: {
                   enabled: true,
                   type: 'dynamic'
               },
               scaling: {
                   min: 1,
                   max: 5,
                   label: {
                       enabled: true,
                       min: 5,
                       max: 15,
                       maxVisible: 30,
                       drawThreshold: 5
                   },
               },
           },
           layout: {
               improvedLayout: false,
               hierarchical: {
                   enabled: false,
                   levelSeparation: 60,
                   nodeSpacing: 150,
                   treeSpacing: 50,
                   blockShifting: true,
                   edgeMinimization: true,
                   parentCentralization: true,
                   direction: 'UD', // UD, DU, LR, RL
                   sortMethod: 'hubsize' // hubsize, directed
               },
           },
           physics: {
               enabled: true,
               barnesHut: {
                   gravitationalConstant: -2000,
                   centralGravity: 0.3,
                   springLength: 95,
                   springConstant: 0.04,
                   damping: 0.09,
                   avoidOverlap: 0
               },
               forceAtlas2Based: {
                   gravitationalConstant: -50,
                   centralGravity: 0.01,
                   springConstant: 0.08,
                   springLength: 100,
                   damping: 0.4,
                   avoidOverlap: 0
               },
               repulsion: {
                   centralGravity: 0.2,
                   springLength: 200,
                   springConstant: 0.05,
                   nodeDistance: 100,
                   damping: 0.09
               },
               hierarchicalRepulsion: {
                   centralGravity: 0.0,
                   springLength: 100,
                   springConstant: 0.01,
                   nodeDistance: 120,
                   damping: 0.09
               },
               maxVelocity: 50,
               minVelocity: 0.1,
               solver: 'barnesHut',
               stabilization: {
                   enabled: true,
                   iterations: 1000,
                   updateInterval: 100,
                   onlyDynamicEdges: false,
                   fit: true
               },
               timestep: 0.5,
               adaptiveTimestep: true
           }

       };

       // create a network
       var container = document.getElementById('graph');

       // initialize your network!
       var network = new vis.Network(container, data, options);
       network.addEventListener('afterDrawing', function() {
           $("#loadingCard").css("visibility", "hidden");
       });
   }

   // Dict that determines node styles from node types.
   var NodeType2Style = {
       '-1': 'text',
       '0': 'circle',
       '1': 'hexagon',
       '2': 'circle',
       '3': 'ellipse',
       '4': 'ellipse',
       '5': 'hexagon',
       '6': 'ellipse'
   };

   // Dict that determines node background colors from node types.
   var NodeType2BGColor = {
       '-1': '#e5ffaa',
       '0': '#e5ffaa',
       '1': '#e5ffaa',
       '2': '#aa00aa',
       '3': '#e5ffaa',
       '4': '#e5ffaa',
       '5': '#e5ffaa',
       '6': '#e5ffaa'
   };

   // Dict that determines node highlight colors from node types.
   var NodeType2HLColor = {
       '-1': '#ff9647',
       '0': '#ff9647',
       '1': '#ff9647',
       '2': '#ff9647',
       '3': '#ff9647',
       '4': '#ff9647',
       '5': '#ff9647',
       '6': '#ff9647'
   };

   // Dict that determines node hover colors from node types.
   var NodeType2HVColor = {
       '-1': '#b4f3ff',
       '0': '#b4f3ff',
       '1': '#b4f3ff',
       '2': '#b4f3ff',
       '3': '#b4f3ff',
       '4': '#b4f3ff',
       '5': '#b4f3ff',
       '6': '#b4f3ff'
   };

   // Dict that determines node font colors from node types.
   var NodeType2FontColor = {
       '-1': '#000000',
       '0': '#000000',
       '1': '#000000',
       '2': '#ffffff',
       '3': '#000000',
       '4': '#000000',
       '5': '#000000',
       '6': '#000000'
   };

   // Dict that determines edge style from edge types.
   var EdgeType2Style = {
       "none": false,
       "sub": false,
       "autosub": false,
       "obj": true,
       "aux": false,
       "cause": false,
       "coref": false,
       "synonym": false
   };

   // Dict that determines edge style from edge types.
   var EdgeType2Color = {
       "none": "#aaaaaa",
       "sub": "#000000",
       "autosub": "#aabbcc",
       "obj": "#000000",
       "aux": "#550000",
       "cause": "#00aaff",
       "coref": "#00ff00",
       "synonym": "#ffff00"
   };

   // Function that stylizes graph.
   function stylizeGraph(inp) {
       let nodes = [];
       let edges = [];
       for (let i = 0; i < inp['nodes'].length; i++) {
           nodes.push({
               'id': inp['nodes'][i]['id'],
               'label': inp['nodes'][i]['label'],
               'value': parseFloat(inp['nodes'][i]['count']),
               'title': inp['nodes'][i]['count'],
               'shape': NodeType2Style[inp['nodes'][i]['type']],
               'color': {
                   'background': NodeType2BGColor[inp['nodes'][i]['type']],
                   'highlight': NodeType2HLColor[inp['nodes'][i]['type']],
                   'hover': NodeType2HVColor[inp['nodes'][i]['type']]
               },
               'font': {
                   'color': NodeType2FontColor[inp['nodes'][i]['type']]
               }
           });
       };
       for (let i = 0; i < inp['links'].length; i++) {
           edges.push({
               'from': inp['links'][i]['source'],
               'to': inp['links'][i]['target'],
               'label': inp['links'][i]['label'],
               'arrows': 'to',
               'value': parseFloat(inp['links'][i]['weight']),
               'title': inp['links'][i]['weight'],
               'dashes': EdgeType2Style[inp['links'][i]['type']],
               'color': EdgeType2Color[inp['links'][i]['type']]
           });
       };
       return [nodes, edges]
   };

   // Function that sends user operations to the server.
   function sendAction(inp, gtype, mode, lang, reset) {
       var data = {
           "inp": inp,
           "gtype": gtype,
           "mode": mode,
           "lang": lang,
           "reset": reset
       };
       $.ajax({
           url: "http://superkerokero.ddns.net:8000",
           type: "POST",
           data: JSON.stringify(data),
           contentType: 'application/json',
           dataType: "json",
           processData: false,
           success: function(data) {
               let g = stylizeGraph(data);
               createGraph(g[0], g[1]);
               $("#loadingCard").css("visibility", "visible");
           },
           error: function(data) {
               console.log(data);
           }
       });
   };

   // Default settings & button callbacks.
   var gtype = "k"
   $("#gtypeCtrl-ksg").click(function() {
       gtype = "k";
       $("#gtypeCtrl").html("KSG");
   });
   $("#gtypeCtrl-dsg").click(function() {
       gtype = "d";
       $("#gtypeCtrl").html("DSG");
   });
   var mode = "text"
   $("#modeCtrl-text").click(function() {
       mode = "text";
       $("#modeCtrl").html("Text");
   });
   $("#modeCtrl-url").click(function() {
       mode = "url";
       $("#modeCtrl").html("Url");
   });
   var lang = "ja"
   $("#langCtrl-ja").click(function() {
       lang = "ja";
       $("#langCtrl").html("Japanese");
   });

   // Toggle config panel visibility.
   var configVisStatus = false;
   $("#setBtn").click(function() {
       if (configVisStatus) {
           $("#resetBtn").css("visibility", "hidden");
           $("#gtypeCtrl").css("visibility", "hidden");
           $("#modeCtrl").css("visibility", "hidden");
           $("#langCtrl").css("visibility", "hidden");
           configVisStatus = false;
       } else {
           $("#resetBtn").css("visibility", "visible");
           $("#gtypeCtrl").css("visibility", "visible");
           $("#modeCtrl").css("visibility", "visible");
           $("#langCtrl").css("visibility", "visible");
           configVisStatus = true;
       };
   });

   // Add button callback.
   $('#addBtn').on('click', function(event) {
       let inp = $('#inputBox').val();
       $("#loadingCard").css("visibility", "visible");
       sendAction(inp, gtype, mode, lang, false);
   });

   // Reset button callback.
   $('#resetBtn').on('click', function(event) {
       let inp = $('#inputBox').val();
       sendAction(inp, gtype, mode, lang, true);
   });