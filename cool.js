javascript:(function() {
    // Check if already running
    if(window.geofsPlayerTrackerUI){
        alert("GeoFS Player Tracker already running!");
        return;
    }
    window.geofsPlayerTrackerUI = true;

    // Create UI container
    let container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "80px";
    container.style.right = "20px";
    container.style.background = "rgba(30,30,40,0.9)";
    container.style.color = "#fff";
    container.style.zIndex = 99999;
    container.style.padding = "10px";
    container.style.borderRadius = "8px";
    container.style.fontFamily = "Arial,sans-serif";
    container.innerHTML = "<b>GeoFS Multiplayer Tracker</b><br /><select id='playerSelect'><option>None</option></select> <button id='snapCam'>Snap & Track</button> <button id='untrackCam'>Untrack</button> <br /><small style='color:gray'>Select a player to track camera.<br>Addon by AI</small>";
    document.body.appendChild(container);

    // Update player list
    function updatePlayerList(){
        let select = document.getElementById('playerSelect');
        if(!select) return;
        select.innerHTML = "<option>None</option>";
        if(geofs && geofs.multiplayer && geofs.multiplayer.visibleUsers){
            Object.values(geofs.multiplayer.visibleUsers).forEach(function(user){
                let opt = document.createElement('option');
                opt.value = user.id;
                opt.textContent = user.callsign + " [" + user.id + "]";
                select.appendChild(opt);
            });
        }
    }
    updatePlayerList();
    setInterval(updatePlayerList, 3000);

    // Camera tracker loop
    let trackerId = null;
    function trackPlayerLoop(){
        if(!window.geofsPlayerTrackerUIPlayerId) return;
        let user = geofs.multiplayer.visibleUsers[window.geofsPlayerTrackerUIPlayerId];
        if(user && user.aircraft && user.aircraft.position){
            let pos = user.aircraft.position;
            let cam = geofs.api.viewer.camera;
            cam.setView({
                destination: Cesium.Cartesian3.fromDegrees(pos.longitude, pos.latitude, pos.altitude + 30),
                orientation: {
                    heading: Cesium.Math.toRadians(user.aircraft.heading-90), // Look behind; tweak if needed
                    pitch: Cesium.Math.toRadians(-15),
                    roll: 0
                }
            });
        }
        trackerId = requestAnimationFrame(trackPlayerLoop);
    }

    // Attach to buttons
    document.getElementById('snapCam').onclick = function(){
        let select = document.getElementById('playerSelect');
        let val = select.value;
        window.geofsPlayerTrackerUIPlayerId = val !== "None" ? val : null;
        if(trackerId) cancelAnimationFrame(trackerId);
        if(window.geofsPlayerTrackerUIPlayerId){
            trackPlayerLoop();
        }
    };
    document.getElementById('untrackCam').onclick = function(){
        window.geofsPlayerTrackerUIPlayerId = null;
        if(trackerId) cancelAnimationFrame(trackerId);
    };

    // Remove UI on Esc
    document.addEventListener('keydown',function(e){
        if(e.key === "Escape" && window.geofsPlayerTrackerUI){
            container.remove(); 
            window.geofsPlayerTrackerUI = false;
            window.geofsPlayerTrackerUIPlayerId = null;
            if(trackerId) cancelAnimationFrame(trackerId);
        }
    });
})();
                                                           
