var WITH_AUDIO = false;
var WITH_PUBLISH = false;


function sendPostRequest(key, value) {


    var http = new XMLHttpRequest();
    var url = "postmethod";
    var params = String(key)+"="+String(value); // format "lorem=ipsum&name=binny"

    console.log(params);

    http.open("POST", url, true);
    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // optional callback
    // http.onreadystatechange = function() {//Call a function when the state changes.
    //     if(http.readyState == 4 && http.status == 200) {
    //         console.log(http.responseText);
    //     }
    // }
    http.send(params);
}


function custom_callback() {

    document.getElementById('speed').onclick = speedCallback;
    function speedCallback() {
        console.log(document.getElementById('speed').value)

        var value = document.getElementById('speed').value;
        if (value == 1) {executive.setUpdatesPerSecond(60);}
        if (value == 2) {executive.setUpdatesPerSecond(45);}
        if (value == 3) {executive.setUpdatesPerSecond(30);}
        if (value == 4) {executive.setUpdatesPerSecond(15);}
    }

    document.getElementById('button_audio').onclick = button_audioCallback;
    function button_audioCallback() {
        WITH_AUDIO = this.control.checked;
        }

    document.getElementById('button_publish').onclick = button_publishCallback;
    function button_publishCallback() {
        WITH_PUBLISH = this.control.checked;
        }
};

