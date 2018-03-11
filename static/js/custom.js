function custom() {
    var data = {
        nodes: new vis.DataSet(),
        edges: new vis.DataSet()
    };

    var texts = [];
    var help = true;

    // takes in a json object, and initialize the network.
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
                    min: 5,
                    max: 15,
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
            improvedLayout: true,
            hierarchical: {
                enabled: false,
                levelSeparation: 120,
                nodeSpacing: 150,
                treeSpacing: 120,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: 'RL', // UD, DU, LR, RL
                sortMethod: 'directed' // hubsize, directed
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

    // Update graph using new graph data.
    function updateGraph(nodes, edges) {
        data['nodes'].update(nodes);
        data['edges'].update(edges);
    };

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
        '-1': '#c1c1c1',
        '0': '#e5ffaa',
        '1': '#003c75',
        '2': '#aa00aa',
        '3': '#c1c1c1',
        '4': '#c1c1c1',
        '5': '#00968e',
        '6': '#c1c1c1'
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
        '1': '#ffffff',
        '2': '#ffffff',
        '3': '#000000',
        '4': '#000000',
        '5': '#ffffff',
        '6': '#000000'
    };

    // Dict that determines edge style from edge types.
    var EdgeType2Style = {
        "none": false,
        "sub": false,
        "autosub": false,
        "obj": true,
        "aux": true,
        "cause": false,
        "coref": false,
        "synonym": false
    };

    // Dict that determines edge style from edge types.
    var EdgeType2Color = {
        "none": "#909296",
        "sub": "#000000",
        "autosub": "#ff7f30",
        "obj": "#000000",
        "aux": "#f682ff",
        "cause": "#e20416",
        "coref": "#d4f738",
        "synonym": "#fff200"
    };

    // Function that stylizes graph.
    function stylizeGraph(inp) {
        // Update stored texts in the scope(var texts is scope global variable).
        let nodes = [];
        let edges = [];
        try {
            for (let i = 0; i < inp['texts'].length; i++) {
                if (inp['texts'][i] != "") {
                    texts.push(inp['texts'][i]);
                };
            };
        } catch (err) {
            console.log("Reset graph!");
        }

        for (let i = 0; i < inp['nodes'].length; i++) {
            let tsource = "";
            for (let j = 0; j < inp['nodes'][i]['pos'].length; j++) {
                tsource += "<font color='blue'>No." + inp['nodes'][i]['pos'][j] + ": </font>" + texts[inp['nodes'][i]['pos'][j]].replace(inp['nodes'][i]['surface'][j], "<strong><font color='red'>" + inp['nodes'][i]['surface'][j] + "</font></strong>") + "<BR>";
            };
            nodes.push({
                'id': inp['nodes'][i]['id'],
                'label': inp['nodes'][i]['label'],
                'value': parseFloat(inp['nodes'][i]['count']),
                'mass': parseFloat(inp['nodes'][i]['count']),
                'title': tsource,
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
                'id': inp['links'][i]['source'] + '--' + inp['links'][i]['target'],
                'from': inp['links'][i]['source'],
                'to': inp['links'][i]['target'],
                'label': inp['links'][i]['label'],
                'arrows': 'to',
                'value': parseFloat(inp['links'][i]['weight']),
                'title': inp['links'][i]['type'],
                'dashes': EdgeType2Style[inp['links'][i]['type']],
                'color': EdgeType2Color[inp['links'][i]['type']]
            });
        };
        return [nodes, edges];
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
            url: server_addr,
            type: "POST",
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: "json",
            processData: false,
            success: function(data) {
                let g = stylizeGraph(data);
                updateGraph(g[0], g[1]);
                if (!reset) {
                    $("#loadingCard").css("visibility", "visible");
                };
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
    $("#layoutCtrl-force").click(function() {
        options['layout']['hierarchical']['enabled'] = false;
        $("#layoutCtrl").html("Force-directed");
        $("#loadingCard").css("visibility", "visible");
        $("#hierarchicalConfig").css("visibility", "hidden");
        var network = new vis.Network(container, data, options);
        network.addEventListener('afterDrawing', function() {
            $("#loadingCard").css("visibility", "hidden");
        });
    });
    $("#layoutCtrl-hierarchical").click(function() {
        options['layout']['hierarchical']['enabled'] = true;
        $("#layoutCtrl").html("Hierarchical");
        $("#loadingCard").css("visibility", "visible");
        $("#hierarchicalConfig").css("visibility", "visible");
        var network = new vis.Network(container, data, options);
        network.addEventListener('afterDrawing', function() {
            $("#loadingCard").css("visibility", "hidden");
        });
    });
    $("#layoutDirectionCtrl-UD").click(function() {
        options['layout']['hierarchical']['direction'] = "UD";
        $("#layoutDirectionCtrl").html("UD");
        $("#loadingCard").css("visibility", "visible");
        var network = new vis.Network(container, data, options);
        network.addEventListener('afterDrawing', function() {
            $("#loadingCard").css("visibility", "hidden");
        });
    });
    $("#layoutDirectionCtrl-DU").click(function() {
        options['layout']['hierarchical']['direction'] = "DU";
        $("#layoutDirectionCtrl").html("DU");
        $("#loadingCard").css("visibility", "visible");
        var network = new vis.Network(container, data, options);
        network.addEventListener('afterDrawing', function() {
            $("#loadingCard").css("visibility", "hidden");
        });
    });
    $("#layoutDirectionCtrl-LR").click(function() {
        options['layout']['hierarchical']['direction'] = "LR";
        $("#layoutDirectionCtrl").html("LR");
        $("#loadingCard").css("visibility", "visible");
        var network = new vis.Network(container, data, options);
        network.addEventListener('afterDrawing', function() {
            $("#loadingCard").css("visibility", "hidden");
        });
    });
    $("#layoutDirectionCtrl-RL").click(function() {
        options['layout']['hierarchical']['direction'] = "RL";
        $("#layoutDirectionCtrl").html("RL");
        $("#loadingCard").css("visibility", "visible");
        var network = new vis.Network(container, data, options);
        network.addEventListener('afterDrawing', function() {
            $("#loadingCard").css("visibility", "hidden");
        });
    });
    $("#layoutSortCtrl-hubsize").click(function() {
        options['layout']['hierarchical']['sortMethod'] = "hubsize";
        $("#layoutSortCtrl").html("HubSize");
        $("#loadingCard").css("visibility", "visible");
        var network = new vis.Network(container, data, options);
        network.addEventListener('afterDrawing', function() {
            $("#loadingCard").css("visibility", "hidden");
        });
    });
    $("#layoutSortCtrl-directed").click(function() {
        options['layout']['hierarchical']['sortMethod'] = "directed";
        $("#layoutSortCtrl").html("Directed");
        $("#loadingCard").css("visibility", "visible");
        var network = new vis.Network(container, data, options);
        network.addEventListener('afterDrawing', function() {
            $("#loadingCard").css("visibility", "hidden");
        });
    });

    // Toggle config panel visibility.
    var configVisStatus = false;
    $("#setBtn").click(function() {
        if (configVisStatus) {
            $("#resetBtn").css("visibility", "hidden");
            $("#gtypeCtrl").css("visibility", "hidden");
            $("#modeCtrl").css("visibility", "hidden");
            $("#langCtrl").css("visibility", "hidden");
            $("#layoutCtrl").css("visibility", "hidden");
            configVisStatus = false;
        } else {
            $("#resetBtn").css("visibility", "visible");
            $("#gtypeCtrl").css("visibility", "visible");
            $("#modeCtrl").css("visibility", "visible");
            $("#langCtrl").css("visibility", "visible");
            $("#layoutCtrl").css("visibility", "visible");
            configVisStatus = true;
        };
    });

    // Reset function.
    function reset() {
        let inp = $('#inputBox').val();
        texts = [];
        data = {
            nodes: new vis.DataSet(),
            edges: new vis.DataSet()
        };
        network = new vis.Network(container, data, options);
        network.addEventListener('afterDrawing', function() {
            $("#loadingCard").css("visibility", "hidden");
        });
        sendAction(inp, gtype, mode, lang, true);
    };

    // Add button callback.
    $('#addBtn').on('click', function(event) {
        let inp = $('#inputBox').val();
        $("#loadingCard").css("visibility", "visible");
        sendAction(inp, gtype, mode, lang, false);
    });

    // Reset button callback.
    $('#resetBtn').on('click', function(event) {
        reset();
    });

    // Toggle help button callback.
    $('#helpBtn').on('click', function(event) {
        if (help) {
            $('[data-toggle="popover"]').popover('disable').popover("hide");
            help = false;
        } else {
            $('[data-toggle="popover"]').popover('enable').popover("hide");
            help = true;
        }
    });

    reset();
};

custom();
$('[data-toggle="popover"]').popover();