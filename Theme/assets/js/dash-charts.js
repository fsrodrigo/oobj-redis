/*** First Chart in Dashboard page ***/
var valorRecebe = 50;
var valorResposta = 50;
function obterDadosGraficoMensagens(valorResposta, valorRecebe) {
	valorRecebe = valorRecebe;
	valorResposta = valorResposta;
	$(document).ready(function () {
		info = new Highcharts.Chart({
			chart: {
				renderTo: 'load',
				margin: [0, 0, 0, 0],
				backgroundColor: null,
				plotBackgroundColor: 'none',

			},

			title: {
				text: null
			},

			tooltip: {
				formatter: function () {
					return this.point.name + ': ' + this.y + ' %';

				}
			},
			series: [
				{
					borderWidth: 2,
					borderColor: '#F1F3EB',
					shadow: false,
					type: 'pie',
					name: 'Income',
					innerSize: '65%',
					data: [
						{ name: 'Recebimento', y: valorRecebe, color: '#b2c831' },
						{ name: 'Resposta', y: valorResposta, color: '#1014a7' }
					],
					dataLabels: {
						enabled: false,
						color: '#000000',
						connectorColor: '#000000'
					}
				}]
		});

	});
}
