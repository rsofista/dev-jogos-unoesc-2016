var mainApp = angular.module("mainApp", []);

mainApp.controller('arenaController', function($scope) {
	$scope.indiceDificuldade = 0;

	$scope.arena = {};

	$scope.qtdLinhas = 10;
	$scope.qtdCelulas = 10;
	$scope.tempoTotalDeJogo = 180;
	$scope.quantidadeDeTesouros = 10;
	$scope.level = 1;
	$scope.totalTesourosEncontrados = 0;	

	$scope.marcar = function(celula) {
		celula.marcado = true;

		if(celula.conteudo == 'X'){
			$scope.totalTesourosEncontrados++;
			celula.conteudo = ':D';
		}

		if($scope.quantidadeDeTesouros == $scope.totalTesourosEncontrados){
			levelUp();
		}
	};


	function createArena() {
		$scope.arena.linhas = [];

		geraLinhasECelulas();
		populaArenaComTesouros();
		populaValores();
	}

	function geraLinhasECelulas() {

		for(var i = 0; i < $scope.qtdLinhas; i++) {
			var linha = {};
			$scope.arena.linhas[i] = {};
			$scope.arena.linhas[i].celulas = [];
			
			for(var j = 0; j < $scope.qtdCelulas; j++) {
				var celula = {};
				celula.marcado = false;
				celula.valor = 0;
				$scope.arena.linhas[i].celulas.push(celula);

			}
			
			$scope.arena.linhas.push(linha);
		}
		
	}

	function populaArenaComTesouros() {

		var posicoes = randomUniqueArray($scope.quantidadeDeTesouros, 10);

		for (var i = posicoes.length - 1; i >= 0; i--) {
			var lin = posicoes[i][0];
			var col = posicoes[i][1];

			$scope.arena.linhas[lin].celulas[col].conteudo = 'X';
			$scope.arena.linhas[lin].celulas[col].tesouro = true;
		}
	}

	function populaValores() {
		for (var lin = 0; lin < $scope.qtdLinhas; ++lin) {
			for (var col = 0; col < $scope.qtdCelulas; ++col) {
				if ($scope.arena.linhas[lin].celulas[col].tesouro === true) {
					if (lin < $scope.qtdLinhas-1) {
						$scope.arena.linhas[lin+1].celulas[col].valor++;

						if (col > 0) {
							$scope.arena.linhas[lin+1].celulas[col-1].valor++;
						}

						if (col < $scope.qtdCelulas-1) {
							$scope.arena.linhas[lin+1].celulas[col+1].valor++;
						}
					}

					if (lin > 0) {
						$scope.arena.linhas[lin-1].celulas[col].valor++;

						if (col > 0) {
							$scope.arena.linhas[lin-1].celulas[col-1].valor++;
						}

						if (col < $scope.qtdCelulas-1) {
							$scope.arena.linhas[lin-1].celulas[col+1].valor++;
						}
					}

					if (col > 0) {
						$scope.arena.linhas[lin].celulas[col-1].valor++;
					}

					if (col < $scope.qtdCelulas-1) {
						$scope.arena.linhas[lin].celulas[col+1].valor++;
					}
				}
			}
		}
	}

	function randomUniqueArray(qtdElementos, numeroMaximo) {
		var resultado = [];

		while (resultado.length < qtdElementos) {
			var indiceX = parseInt(Math.random() * 1000) % numeroMaximo;
			var indiceY = parseInt(Math.random() * 1000) % numeroMaximo;
			var i = resultado.length - 1;

			for (; i >= 0; i--) {
				if ((indiceX == resultado[i][0]) && (indiceY == resultado[i][1])) {
					break;
				}
			}
			if (i == -1) {
				resultado.push([indiceX, indiceY]);
			}
		}

		return resultado;
	}

	function levelUp() {

		$scope.level++;

		resetLevel();
		atualizaDificultade();

		createArena();
	}

	function atualizaDificultade() {

		if($scope.level <= 3){
			$scope.tempoTotalDeJogo = 180;
		}else if($scope.level  <= 6){
			$scope.tempoTotalDeJogo = 320;
		}else{
			$scope.tempoTotalDeJogo = 400;	
		}

		$scope.quantidadeDeTesouros--;
	}

	function resetLevel(){
		$scope.totalTesourosEncontrados = 0;
	}

	createArena();
});
