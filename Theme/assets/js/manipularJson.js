//Função responsável por ficar realizando automáticamente a chamada da função MAIN.
var recursiva;
function iniciaRecursividade() {
    recursiva = window.setInterval(function () {
        initRead();
    }, 5000);
}

// Document is ready
//Inicia com o DOM
$(function () {
    iniciaRecursividade();
});

//Função que é chamada após a criação do DOM
// Resposável por chamar a função Main
function initRead() {
    iniciarExecucao("1", "1");
    iniciarExecucao("2", "2");
}

//Função que executa o Ajax e popula o DataTable
//Passar como parametro filaDados: 1 para Recebe, 2 para emissão e 3 para memória
//Passar como parametro idTabela: o id da tabela que será carregada
//Realiza chamada da Função do Ajax que popula o gráfico da memória do Redis.
function iniciarExecucao(filaDados, idTabela) {
    $.ajax({
        method: "post",
        dataType: "json",
        url: "assets/app/classe-json.php?url=" + filaDados,
        success: function (data) {
            carregarDados(data, idTabela);
        }
    })
}

//Função que interpreta o JSON que vem do AJAX PHP.
//Cria as linhas das tabelas.
//Realiza a chamada nas funções de destruíção e limpeza das tabelas e DT's.
//Realiza a chamada nas funções que alimenta os charts de quantidade de mensagens.
//Realiza a chamada na função que carrega o data table.
//Particularidade: sempre antes de carregar a tabela e chamar o dataTable, o DT é destruído e a tabela limpa.
function carregarDados(arrJson, idTabela) {
    changeTable = $("#dt" + idTabela).dataTable();
    changeTable.fnDestroy();
    limparTabela(idTabela);
    var str = '';
    $.each(arrJson, function (key, val) {
        if (key != "99999999999999" && val < 3500) {
            str += '<tr class="odd gradeC"><td>' + key + '</td><td>' + val + '</td></tr>';
        } else if (key != "99999999999999" && val > 3500) {
            str += '<tr class="odd gradeX"><td>' + key + '</td><td>' + val + '</td></tr>';
        } else if (key == "99999999999999") {
            popularQuantidadeMensagem(idTabela, val);
            popularRankMensagem(idTabela, val);
        }
    });
    $("#dt" + idTabela).append(str);
    carregarDT(idTabela);
}

//Limpa a tabela, excluí todas as linhas.
function limparTabela(tableClear) {
    while (document.getElementById('dt' + tableClear).rows.length > 1) {
        document.getElementById('dt' + tableClear).deleteRow(1);
    }
}

//Popula a informação de quantidade total de mensagens por fila.
function popularQuantidadeMensagem(fila, mensagens) {
    if (fila == 1) {
        var idDcocument = "quantidadeRecebe";
    } else if (fila == 2) {
        var idDcocument = "quantidadeResposta";
    }
    document.getElementById(idDcocument).innerHTML = mensagens;
}

//Realiza o update no rank de menor e maior volume de mensagens por fila.
//Chama a função que popula o gráfico de mensagens.
function popularRankMensagem(fila, mensagens) {
    if (fila == 1) {
        var idDcocumentMaior = "recebeMaiorMensagem";
        var idDcocumentMenor = "recebeMenorMensagem";
    } else if (fila == 2) {
        var idDcocumentMaior = "respostaMaiorMensagem";
        var idDcocumentMenor = "respostaMenorMensagem";
    }
    var menorMensagem = document.getElementById(idDcocumentMenor).innerHTML;
    var maiorMensagem = document.getElementById(idDcocumentMaior).innerHTML;
    if (mensagens > maiorMensagem) {
        document.getElementById(idDcocumentMaior).innerHTML = mensagens;
    }
    if (mensagens < menorMensagem) {
        document.getElementById(idDcocumentMenor).innerHTML = mensagens;
    }
    popularGraficoDeMensagens();
}
//Realiza o update no gráfico de mensagens e no total geral de mensagens.
function popularGraficoDeMensagens() {
    quantidadeResposta = parseInt(document.getElementById("quantidadeResposta").innerHTML);
    quantidadeRecebe = parseInt(document.getElementById("quantidadeRecebe").innerHTML);
    mensagens = quantidadeRecebe + quantidadeResposta;
    document.getElementById("totalMensagem").innerHTML = mensagens;
    percent1 = parseFloat(((quantidadeRecebe * 100) / mensagens).toFixed(2))
    percent2 = parseFloat((100 - percent1).toFixed(2));
    fgm = new obterDadosGraficoMensagens(percent2, percent1);
}

//Realiza a chamada da Função Dt. Cria todo a indexação e paginação do DT.
//Realiza a chamada para parar o reload dos dados em tempo real caso exista uma pesquisa em andamento.
//Carrega a função monitorar.
function carregarDT(idTabela) {
    $(document).ready(function () {
        tableDestroy = $("#dt" + idTabela).dataTable({
            destroy: true,
            "aaSorting": [[1, "desc"]],
            "sScrollY": "200px",
            "bPaginate": false
        });
        monitorar();
        fp = new http_ping("http://redis.oobj-dfe.com.br");
    });
}

//Função que monitora se exite uma pesquisa em andamento para que os dados não seja atualizados durante tal.
//Caso exista uma função...
//console.log('input', this.value);
function monitorar() {
    var inputs = $("div.dataTables_filter input");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function () {
            if ('input', this.value != '') {
                clearInterval(recursiva);
            }
            if ('input', this.value == '') {
                iniciaRecursividade();
            }
        });
    }
}
