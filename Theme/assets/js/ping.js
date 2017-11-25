function http_ping(url) {

    var NB_ITERATIONS = 2; // number of loop iterations
    var MAX_ITERATIONS = 2; // beware: the number of simultaneous XMLHttpRequest is limited by the browser!
    var TIME_PERIOD = 1000; // 1000 ms between each ping
    var i = 0;
    var over_flag = 0;
    var time_cumul = 0;
    var REQUEST_TIMEOUT = 5000;
    var TIMEOUT_ERROR = 0;

   // document.getElementById('result').innerHTML = "HTTP ping for " + fqdn + "</br>";

    var ping_loop = setInterval(function () {


        // let's change non-existent URL each time to avoid possible side effect with web proxy-cache software on the line
        //url = "http://redis.oobj-dfe.com.br/memoriaDisponivel";
        //url = "http://10.255.255.1"

        if (i < MAX_ITERATIONS) {

            var ping = new XMLHttpRequest();

            i++;
            ping.seq = i;
            over_flag++;

            ping.date1 = Date.now();

            ping.timeout = REQUEST_TIMEOUT; // it could happen that the request takes a very long time

            ping.onreadystatechange = function () { // the request has returned something, let's log it (starting after the first one)

                if (ping.readyState == 4 && TIMEOUT_ERROR == 0) {

                    over_flag--;

                    if (ping.seq > 1) {
                        delta_time = Date.now() - ping.date1;
                        time_cumul += delta_time;
                        document.getElementById('latencia').innerHTML = delta_time + " ms.";
                        document.getElementById('upDown').innerHTML = "Up";
                        document.getElementById('imgUpDown').src = "assets/img/up.png";
                        document.getElementById('divUpDown').style.backgroundColor = "#383737";
                    }
                }
            }


            ping.ontimeout = function () {
                TIMEOUT_ERROR = 1;
            }

            ping.open("GET", url, true);
            ping.send();

        }

        if ((i > NB_ITERATIONS) && (over_flag < 1)) { // all requests are passed and have returned

            clearInterval(ping_loop);
            var avg_time = Math.round(time_cumul / (i - 1));
            document.getElementById('latencia').innerHTML += "</br> Average ping latency on " + (i - 1) + " iterations: " + avg_time + "ms </br>";

        }

        if (TIMEOUT_ERROR == 1) { // timeout: data cannot be accurate

            clearInterval(ping_loop);
            document.getElementById('latencia').innerHTML = "00ms.";
            document.getElementById('upDown').innerHTML = "Down";
            document.getElementById('imgUpDown').src = "assets/img/down.png";
            document.getElementById('divUpDown').style.backgroundColor = "#e00e0e";
            //divUpDown
            
            return;

        }

    }, TIME_PERIOD);
}