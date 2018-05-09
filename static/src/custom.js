var WITH_AUDIO = false;
var WITH_PUBLISH = true;
var WITH_LEVEL1 = true;

var speedvalue = 60;
// var speedvaluemapping = {0:80, 1:60, 2:40, 3:20, 4:15};
// function speedvaluefunc(val) {
//     return (80 - 20 * val)
// }


function getFrameAndTime(){
    var ret = "&frames="+String(pacman.frames)+"&gtime="+String(executive.getGameTime());
    return ret;
}


function sendPostRequestUrl(url, key, value) {
    var http = new XMLHttpRequest();
    var params = String(key)+"="+String(value); // format "lorem=ipsum&name=binny"
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(params);
}


function sendPostRequest(context) {

    var http = new XMLHttpRequest();
    http.open("POST", "postmethod", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    var params;

    // format "lorem=ipsum&name=binny" + frame and time for the game
    if (context.value == undefined) {
        params = "key="+String(context.key);
    }
    else {
        params = "key="+String(context.key)+"&value="+String(context.value)+getFrameAndTime();
    }

    // optional callback
    // http.onreadystatechange = function() {//Call a function when the state changes.
    //     if(http.readyState == 4 && http.status == 200) {
    //         console.log(http.responseText);
    //     }
    // }

    http.send(params);
}


function getSpeedValue() {
    var http = new XMLHttpRequest();
    var url = "speedvalue";
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            var flaskvalue = parseFloat(http.responseText);

            // only change in play state ?
            // if (state == playState) {
            if (speedvalue != flaskvalue) {
                speedvalue = flaskvalue;
                executive.setUpdatesPerSecond(speedvalue);
            }
            document.getElementById("speed_fps").innerHTML = speedvalue;
        }
    }
    http.send(null);
}

var TIMEOUT = 1000;
// check for upate on speedvalue from flask
setTimeout(function updateSpeedValue() {
    getSpeedValue();
    setTimeout(updateSpeedValue, TIMEOUT);
}, TIMEOUT);



function custom_callback() {

    document.getElementById('speed').onclick = speedCallback;
    function speedCallback() {

        // manual change that has to be reflected: update the state in Flask
        speedvalue = document.getElementById('speed').value;
        sendPostRequestUrl('speedvalue', 'speedvalue', speedvalue);
        executive.setUpdatesPerSecond(speedvalue);
    }

    document.getElementById('button_audio').onclick = button_audioCallback;
    function button_audioCallback() {
        WITH_AUDIO = this.control.checked;
        }

    document.getElementById('button_publish').onclick = button_publishCallback;
    function button_publishCallback() {
        WITH_PUBLISH = this.control.checked;
        }

    document.getElementById('button_level1').onclick = button_level1Callback;
    function button_level1Callback() {
        WITH_LEVEL1 = this.control.checked;
        }

};

