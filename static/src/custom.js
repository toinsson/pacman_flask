var WITH_AUDIO = false;
var WITH_PUBLISH = true;
var WITH_LEVEL1 = true;

var speedvalue = 1;
var speedvaluemapping = {0:120, 1:60, 2:40, 3:20, 4:15};

function speedvaluefunc(val) {
    return (80 - 20 * val)
}


function sendPostRequestUrl(url, key, value) {
    var http = new XMLHttpRequest();
    var params = String(key)+"="+String(value); // format "lorem=ipsum&name=binny"
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(params);
}


function sendPostRequest(key, value) {
    var http = new XMLHttpRequest();
    var url = "postmethod";
    var params = String(key)+"="+String(value); // format "lorem=ipsum&name=binny"
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

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
            if (speedvalue != flaskvalue) {
                speedvalue = flaskvalue;
                executive.setUpdatesPerSecond(speedvaluefunc(speedvalue))
            }
        }
    }
    http.send(null);
}


// check for upate on speedvalue from flask
setTimeout(function updateSpeedValue() {
    getSpeedValue();
    setTimeout(updateSpeedValue, 1000);
}, 1000);


function custom_callback() {

    document.getElementById('speed').onclick = speedCallback;
    function speedCallback() {

        // manual change that has to be reflected: update the state in Flask
        speedvalue = document.getElementById('speed').value;
        sendPostRequestUrl('speedvalue', 'speedvalue', speedvalue);
        executive.setUpdatesPerSecond(speedvaluemapping[speedvalue]);
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

