
var mainApp = angular.module("mainApp", []);

mainApp.controller('arenaController', function($scope) {
	$scope.indiceDificuldade = 0;

	$scope.arena = {};

	$scope.marcar = function(celula) {
		celula.marcado = true;
	};


	function createArena() {
		$scope.arena.linhas = [];
		qtdLinhas = 10;
		qtdCelulas = 10;

		geraLinhasECelulas(qtdLinhas, qtdCelulas);
		populaArenaComTesouros();
	}

	function geraLinhasECelulas(qtdLinhas, qtdCelulas) {

		for(var i = 0; i < qtdLinhas; i++) {
			var linha = {};
			$scope.arena.linhas[i] = {};
			$scope.arena.linhas[i].celulas = [];
			
			for(var j = 0; j < qtdCelulas; j++) {
				var celula = {};
				celula.marcado = false;
				$scope.arena.linhas[i].celulas.push(celula);

			}
			
			$scope.arena.linhas.push(linha);
		}
		
	}

	function populaArenaComTesouros() {
		var posicoes = randomUniqueArray(10);

		for (var i = posicoes.length - 1; i >= 0; i--) {
			var lin = posicoes[i][0];
			var col = posicoes[i][1];

			$scope.arena.linhas[lin].celulas[col].conteudo = 'X';
		}
	}

	function randomUniqueArray(max) {
		var resultado = [];

		while (resultado.length < 10) {
			var numeroAleatorio = [(parseInt(Math.random() * 1000) % max), (parseInt(Math.random() * 1000) % max)];

			if (resultado.indexOf(numeroAleatorio) < 0) {
				resultado.push(numeroAleatorio);
			}
		}

		return resultado;
	}

	createArena();

});
