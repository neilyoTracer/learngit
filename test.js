
require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Home",
    "esri/layers/TileLayer",
    "esri/layers/MapImageLayer",
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/geometry/geometryEngine",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/rest/route",
    "esri/rest/support/RouteParameters",
    "esri/rest/support/FeatureSet"
], function (Map, MapView, Home, TileLayer, MapImageLayer, Graphic, Point, geometryEngine, GraphicsLayer, FeatureLayer, route, RouteParameters, FeatureSet) {
    var map = new Map();
    var view = new MapView({
        container: "viewDiv",
        map: map
    });
    var homeBtn = new Home({
        view: view
    });
    view.ui.add('srDiv', "top-left");
    var layer = null,
        layerUrl = "https://gis-server-tom.gis-app-intranet.itpt.its.com/agsserver/rest/services/Basemap2/Basemap/MapServer",
        layer = new TileLayer(layerUrl, null);
    map.layers.add(layer);

    var layerIR = null,
        layerUrlIR = "https://gis-server-tom.gis-app-intranet.itpt.its.com/agsserver/rest/services/Application2/IR/MapServer/0";
    layerIR = new FeatureLayer(layerUrlIR, null);
    map.layers.add(layerIR);

    routeUrl = "https://gis-server-tom.gis-app-intranet.itpt.its.com/agsserver/rest/services/Routing2/FindRoute/NAServer/Route";
    // The stops and route result will be stored in this layer
    const routeLayer = new GraphicsLayer();
    map.layers.add(routeLayer);

    linklayerUrl = "https://gis-server-tom.gis-app-intranet.itpt.its.com/agsserver/rest/services/Routing2/FindRoute/MapServer/6";
    const linkLayer = new FeatureLayer(linklayerUrl, null);

    // Setup the route parameters
    const routeParams = new RouteParameters({
        stops: new FeatureSet(),
        pointBarriers: new FeatureSet(),
        /*pointBarriers: new FeatureSet({
          features: view.graphics.toArray()
          }),*/
        findBestSequence: true,
        preserveFirstStop: true,
        preserveLastStop: true,
        ignoreInvalidLocations: true,
        useHierarchy: true,
        returnRoutes: true,
        //returnTraversedEdges:true,
        outputLines: "true-shape",
        outSpatialReference: {
            // autocasts as new SpatialReference()
            wkid: 3414
        }
    });

    // Define the symbology used to display the stops
    const stopSymbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        style: "cross",
        size: 15,
        outline: {
            // autocasts as new SimpleLineSymbol()
            width: 4
        }
    };
    // Define the symbology used to display the route
    const routeSymbol = {
        type: "simple-line", // autocasts as SimpleLineSymbol()
        color: [0, 0, 255, 0.5],
        width: 5
    };
    // Adds a graphic when the user clicks the map. If 2 or more points exist, route is solved.
    view.on("click", addStop);

    function addStop(event) {
        // Add a point at the location of the map click
        const stop = new Graphic({
            geometry: event.mapPoint,
            symbol: stopSymbol
        });
        routeLayer.add(stop);

        routeParams.stops.features.push(stop);
        if (routeParams.stops.features.length >= 2) {
            //Add pointBarriers
            whereClause = "IR_TYPE_CODE =10";
            const irQuery = {
                where: whereClause,  // Set by select element
                outFields: ["*"], // Attributes to return
                returnGeometry: true,
                returnQueryGeometry: true
            };
            console.log("Start Query Roadclosure......");
            layerIR.queryFeatures(irQuery).then((featureSet) => {
                console.log("Got RoadClosure count: " + featureSet.features.length);
                //console.log(featureSet.features[0]);
                if (featureSet.features.length > 0) {
                    featureSet.features.forEach(function (obj) {
                        routeParams.pointBarriers.features.push({ geometry: obj.geometry });
                    });
                    if (routeParams.pointBarriers.features.length > 0) {
                        console.log("Got RoadClosureGeometry length= " + routeParams.pointBarriers.features.length);
                    }
                    else {
                        console.log("pointBarriers count is 0");
                    }
                }
                //start to generate route
                route.solve(routeUrl, routeParams).then((data) => {
                    showRoute(data);
                }).catch((error) => {
                    console.error("Solve ErrorDetails: " + error.details.messages[0]);
                });

            }).catch((error) => {
                console.log(error.error);

            });

        }

    }
    // Adds the solved route to the map as a graphic
    function showRoute(data) {
        //console.log(data.routeResults[0]);
        const routeResult = data.routeResults[0].route;
        routeResult.symbol = routeSymbol;
        routeLayer.add(routeResult);

        //whereClause="OBJECTID in (34, 35, 36, 37)"   // //for search LK_ID_NUM
        const linkQuery = {
            //where: whereClause,  // Set by select element
            spatialRelationship: "contains", //"intersects", // Relationship operation to apply
            geometry: data.routeResults[0].route.geometry, // Restricted to visible extent of the map
            outFields: ["*"], // Attributes to return
            returnGeometry: true,
            returnQueryGeometry: true
        };

        console.log("Start Query......");
        var resultLinks = [];
        var routeLinks = [];
        linkLayer.queryFeatures(linkQuery).then((featureSet) => {
            console.log("Feature count: " + featureSet.features.length);
            for (var i = 0; i < featureSet.features.length; i++) {
                feature = featureSet.features[i];
                var lkid = feature.attributes['LK_ID_NUM'];
                console.log("lk_id_num=" + lkid);
                resultLinks.push(lkid);

            }
            console.log("resultLinks.length=" + resultLinks.length);

            var originPt, destPt;
            var path = data.routeResults[0].route.geometry.paths;
            console.log("paths length:" + path.length);
            var len = path[0].length;
            console.log("path[0] length:" + len);
            console.log(path[0]);

            originPt = path[0][0];
            console.log("From Point:");
            console.log(originPt);
            destPt = path[0][len - 1];
            console.log("End Point:");
            console.log(destPt);
            fromGeo = new Point(originPt, data.routeResults[0].route.geometry.spatialReference);
            toGeo = new Point(destPt, data.routeResults[0].route.geometry.spatialReference);

            //-----------Start to query start link id -----------------------------------------

            const slkQuery = {
                spatialRelationship: "within", //"contains intersects", // Relationship operation to apply
                geometry: fromGeo, // Restricted to visible extent of the map
                outFields: ["*"], // Attributes to return
                returnGeometry: true,
                returnQueryGeometry: true
            };
            linkLayer.queryFeatures(slkQuery).then((result) => {
                if (result.features == null) {
                    console.log("result.features is null");
                    return null;
                }
                else {
                    console.log("got start Feature count: " + result.features.length);
                    var feature = result.features[0];
                    var startLid = feature.attributes['LK_ID_NUM'];
                    console.log("From lk_id_num=" + startLid);
                    var slk_fnode = feature.attributes['NODE_FR_ID_NUM'];
                    console.log("From fnode_id=" + slk_fnode);
                    var slk_tnode = feature.attributes['NODE_TO_ID_NUM'];
                    console.log("From tnode_id=" + slk_tnode);
                    routeLinks.push({ seqno: 1, linkid: startLid });

                    if (resultLinks.indexOf(startLid) != -1) {
                        console.log("StartLink included");
                    }
                    else {
                        featureSet.features.unshift(feature);
                        resultLinks.push(startLid);
                        console.log("StartLink not included, new featureSet.features.length=" + featureSet.features.length);
                        console.log("StartLink not included, new resultLinks.length=" + resultLinks.length);
                    }
                    //-----------Start to query end link id----------------------------------------------------		
                    const elkQuery = {
                        spatialRelationship: "within", //"contains intersects", // Relationship operation to apply
                        geometry: toGeo, // Restricted to visible extent of the map
                        outFields: ["*"], // Attributes to return
                        returnGeometry: true,
                        returnQueryGeometry: true
                    };
                    linkLayer.queryFeatures(elkQuery).then((result) => {
                        if (result.features == null) {
                            console.log("result.features is null");
                            return null;
                        }
                        else {
                            console.log("got end Feature count: " + result.features.length);
                            var feature = result.features[0];
                            var endLid = feature.attributes['LK_ID_NUM'];
                            console.log("End lk_id_num=" + endLid);
                            var elk_fnode = feature.attributes['NODE_FR_ID_NUM'];
                            console.log("End fnode_id=" + elk_fnode);
                            var elk_tnode = feature.attributes['NODE_TO_ID_NUM'];
                            console.log("End tnode_id=" + elk_tnode);
                            if (resultLinks.indexOf(endLid) != -1) {
                                console.log("EndLink included");
                            }
                            else {
                                featureSet.features.push(feature);
                                resultLinks.push(endLid);
                                console.log("EndLink not included, new featureSet.features.length=" + featureSet.features.length);
                            }
                            console.log("Start to get linkid by sequence...");
                            var seq = 1;
                            var tnode = slk_tnode;
                            const routeAtrr = [].concat(featureSet.features);
                            console.log("routeAtrr.length=" + routeAtrr.length);
                            const len = (routeAtrr.length - 1);  // start from second link
                            for (var i = 0; i < len; i++) {
                                var seq = seq + 1;
                                console.log(" i=" + i);
                                console.log(" seq=" + seq);
                                console.log(" used tnode=" + tnode);
                                var gotAttr = findSqnoBylinkid(tnode, routeAtrr);
                                if (gotAttr != null && gotAttr.length > 0) {
                                    //console.log("got gotAttr=" + gotAttr.length);
                                    var nextlid = gotAttr[0].linkid;
                                    console.log("got nextlid=" + nextlid);
                                    tnode = gotAttr[0].nextTnode;
                                    console.log("got nextTnode=" + tnode);
                                    routeLinks.push({ seqno: seq, linkid: nextlid });
                                }

                            }
                            console.log("Finished Ordering, routeLinks.length=" + routeLinks.length);
                            console.log(routeLinks);

                        }
                    });

                }
            });

        }).catch((error) => {
            console.log(error.error);

        });
    }

    function findSqnoBylinkid(tnodeid, result) {
        console.log("In findSqnoBylinkid, Feature count: " + result.length);
        var gotAttr = [];
        if (result.length > 0) {
            for (i = 0, len = result.length; i < len; i++) {
                let l = result[i];
                let fnode = l.attributes['NODE_FR_ID_NUM'];
                //console.log("next fnode=" + fnode);
                if (fnode == tnodeid) {
                    let lkid = l.attributes["LK_ID_NUM"];
                    //console.log("got nextlid=" + lkid);	
                    let nextTnodeid = l.attributes['NODE_TO_ID_NUM'];
                    //console.log("got nextTnodeid=" + nextTnodeid);	

                    gotAttr.push({ linkid: lkid, nextTnode: nextTnodeid });
                    console.log("gotAttr.length=" + gotAttr.length);

                    return gotAttr;
                }
                else {
                    console.log("continue...");
                }
            }
            return null;
        }
        else {
            return null;
        }
    }

});