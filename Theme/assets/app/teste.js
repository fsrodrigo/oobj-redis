var btnAjaxElement = document.getElementById('btnAjax');
var responseElement = document.getElementById('response');

var httpRequest = new XMLHttpRequest();

btnAjaxElement.addEventListener('click', function(e) {
    prepararEDispararRequisicao();
});

function prepararEDispararRequisicao() {
    console.log('disparando requisicao HTTP via Ajax');

    httpRequest.onreadystatechange = callback;

    // preparando o request: metodo HTTP, URL e assincrono (true) / sincorno (false)
    httpRequest.open('GET', 'http://localhost:3000/rendimento?s=' + x.value + '&j=' + y.value, true);

    // disparando o request (o null representa o payload do request)
    httpRequest.send(null);
}
function callback(r) {
    // aqui vai o codigo que atualiza a interface grafica
    if (httpRequest.readyState === 4) {
        console.log('foi e vortou com HTTP status', httpRequest.status);

        if (httpRequest.status === 200) {
            console.log('deu certo caraio');
            var usuarios = httpRequest.responseText;
            
            response.innerHTML = 'O resultado do request foi:<br>' + usuarios;
        } else {
            console.log('deu ruim, caraio');
        }
    }
}



var httpRequest = new XMLHttpRequest();

function prepararEDispararRequisicao() {
    console.log('disparando requisicao HTTP via Ajax');

    httpRequest.onreadystatechange = callback;

    // preparando o request: metodo HTTP, URL e assincrono (true) / sincorno (false)
    httpRequest.open('POST', '../app/classe-json.php?url=1', true);

    // disparando o request (o null representa o payload do request)
    httpRequest.send(null);
}
function callback(r) {
    // aqui vai o codigo que atualiza a interface grafica
    if (httpRequest.readyState === 4) {
        //console.log('foi e vortou com HTTP status', httpRequest.status);

        if (httpRequest.status === 200) {
            //console.log('deu certo caraio');
            var retorno = httpRequest.response;
            //retorno = JSON.parse(retorno);

            console.log(retorno);
            //var string = retorno.toString();
            //document.getElementById("teste").innerHTML = retorno;
            //printarObjeto(retorno);

        } else {
            console.log('deu ruim, caraio');
        }
    }
}
