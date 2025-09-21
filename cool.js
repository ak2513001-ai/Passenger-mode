// ==UserScript==
// @name         GeoFS Passenger Camera
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a passenger camera mode with start/stop controls in GeoFS
// @author       You
// @match        *://*.geo-fs.com/*
// @match        *://*.geofs.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Avoid double injection
    if (window.passengerUi) return;
    window.passengerUi = true;

    // Create UI container
    let container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "100px";
    container.style.right = "30px";
    container.style.background = "rgba(35,40,51,0.9)";
    container.style.color = "#fff";
    container.style.padding = "10px 15px";
    container.style.borderRadius = "8px";
    container.style.zIndex = 99999;
    container.style.fontFamily = "Arial,sans-serif";
    container.innerHTML = `
        <button id="startPassenger">Start Passenger Cam</button>
        <button id="stopPassenger" style="margin-left:10px">Stop Passenger Cam</button>
        <div style="margin-top:8px;color:#aaa;font-size:12px;">Test passenger camera mode</div>
    `;
    document.body.appendChild(container);

    let camId = null;

    // Camera loop
    function camLoop() {
        if (geofs && geofs.api && geofs.api.viewer && geofs.aircraft && geofs.aircraft.instance && geofs.aircraft.instance.position) {
            let pos = geofs.aircraft.instance.position;
            let hdg = geofs.aircraft.instance.heading || 0;

            // offset calculation
            let x = -15 * Math.cos((hdg - 90) * Math.PI / 180);
            let y = -15 * Math.sin((hdg - 90) * Math.PI / 180);
            let z = 3;

            // convert offset to coordinates
            let lon = pos.longitude + (x / (111320 * Math.cos(pos.latitude * Math.PI / 180)));
            let lat = pos.latitude + (y / 110540);
            let alt = pos.altitude + z;

            geofs.api.viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
                orientation: {
                    heading: Cesium.Math.toRadians(hdg - 90),
                    pitch: Cesium.Math.toRadians(-5),
                    roll: 0
                }
            });
        }
        camId = requestAnimationFrame(camLoop);
    }

    // Start button
    document.getElementById("startPassenger").onclick = function() {
        if (camId) cancelAnimationFrame(camId);
        camLoop();
    };

    // Stop button
    document.getElementById("stopPassenger").onclick = function() {
        if (camId) cancelAnimationFrame(camId);
        camId = null;
    };
})();}
document.getElementById("startPassenger").onclick=function(){
    if(camId) cancelAnimationFrame(camId);
    camLoop();
};
document.getElementById("stopPassenger").onclick=function(){
    if(camId) cancelAnimationFrame(camId);
    camId=null;
};
})();
