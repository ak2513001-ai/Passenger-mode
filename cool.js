// ==UserScript==
// @name         GeoFS Passenger Cam
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Passenger camera mode for GeoFS with debug log panel
// @author       You
// @match        https://www.geo-fs.com/*oggy
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (window.passengerUi) return;
    window.passengerUi = true;

    // --- Control Panel ---
    let ctrl = document.createElement("div");
    ctrl.style.position = "fixed";
    ctrl.style.top = "100px";
    ctrl.style.right = "30px";
    ctrl.style.background = "rgba(35,40,51,0.9)";
    ctrl.style.color = "#fff";
    ctrl.style.padding = "10px 15px";
    ctrl.style.borderRadius = "8px";
    ctrl.style.zIndex = 99999;
    ctrl.style.fontFamily = "Arial,sans-serif";
    ctrl.innerHTML = `
        <button id="startPassenger">Start Passenger Cam</button>
        <button id="stopPassenger" style="margin-left:10px">Stop Passenger Cam</button>
        <div style="margin-top:8px;color:#aaa;font-size:12px;">Passenger cam debug mode</div>
    `;
    document.body.appendChild(ctrl);

    // --- Log Panel ---
    let logPanel = document.createElement("div");
    logPanel.style.position = "fixed";
    logPanel.style.bottom = "20px";
    logPanel.style.right = "20px";
    logPanel.style.width = "300px";
    logPanel.style.height = "150px";
    logPanel.style.background = "rgba(0,0,0,0.8)";
    logPanel.style.color = "#0f0";
    logPanel.style.fontFamily = "monospace";
    logPanel.style.fontSize = "12px";
    logPanel.style.padding = "5px";
    logPanel.style.overflowY = "auto";
    logPanel.style.borderRadius = "5px";
    logPanel.style.zIndex = 100000;
    document.body.appendChild(logPanel);

    function log(msg) {
        let p = document.createElement("div");
        p.textContent = msg;
        logPanel.appendChild(p);
        logPanel.scrollTop = logPanel.scrollHeight;
    }

    let camId = null;

    function camLoop() {
        if (geofs && geofs.api && geofs.api.viewer && geofs.aircraft?.instance?.position) {
            let pos = geofs.aircraft.instance.position;
            let hdg = geofs.aircraft.instance.heading || 0;

            // Offset from plane (behind/right)
            let x = -50 * Math.cos((hdg - 90) * Math.PI / 180);
            let y = -50 * Math.sin((hdg - 90) * Math.PI / 180);
            let z = 15;

            let lon = pos.longitude + (x / (111320 * Math.cos(pos.latitude * Math.PI / 180)));
            let lat = pos.latitude + (y / 110540);
            let alt = pos.altitude + z;

            geofs.api.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
                orientation: {
                    heading: Cesium.Math.toRadians(hdg - 90),
                    pitch: Cesium.Math.toRadians(-15),
                    roll: 0
                },
                duration: 0
            });

            log(`PassengerCam: lon=${lon.toFixed(5)} lat=${lat.toFixed(5)} alt=${alt.toFixed(1)} hdg=${hdg.toFixed(1)}`);
        }
        camId = requestAnimationFrame(camLoop);
    }

    // Wait for aircraft
    function waitForAircraft(callback) {
        let interval = setInterval(function() {
            if (geofs && geofs.aircraft?.instance?.position) {
                clearInterval(interval);
                callback();
            }
        }, 500);
    }

    document.getElementById("startPassenger").onclick = function() {
        waitForAircraft(function() {
            if (camId) cancelAnimationFrame(camId);
            camLoop();
            log("Passenger Cam started. Make sure you are in Free Camera mode (press C).");
        });
    };

    document.getElementById("stopPassenger").onclick = function() {
        if (camId) cancelAnimationFrame(camId);
        camId = null;
        log("Passenger Cam stopped.");
    };

})();    let camId = null;

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
