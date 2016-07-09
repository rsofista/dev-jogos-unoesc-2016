var mainApp = angular.module("mainApp", []);

mainApp.controller('arenaController', function($scope) {
	$scope.indiceDificuldade = 0;

	$scope.arena = {};

	//Audios
	$scope.audioEntrada    = 'Audio/Entrada.mp3';
	$scope.audioGameOver   = 'Audio/GameOver.mp3';
	$scope.audioMudaFase   = 'Audio/MudaFase.mp3';
	$scope.audioNewRecord  = 'Audio/NewRecord.mp3';
	$scope.audioPCTesouro  = 'Audio/PCTesouro.mp3';
	$scope.audioPSTesouro  = 'Audio/PSTesouro.mp3';
	$scope.audioTimerFinal = 'Audio/TimerFinal.mp3';
	$scope.audioVitoria    = 'Audio/Vitoria.mp3';

	//Globas
	$scope.qtdLevels       = 1;  	   

	function start() {

		//Primeiro level
		$scope.qtdLinhas 				= 10;
		$scope.qtdCelulas 				= 10;
		$scope.tempoTotalDeJogo 		= 180;
		$scope.quantidadeDeTesouros 	= 10;
		$scope.level 					= 1;
		$scope.totalTesourosEncontrados = 0;
		$scope.totalDePontos 			= 0;	
		$scope.fimDeJogo				= false;

		//playAudio($scope.audioEntrada);
		createArena();

		//Reiniciliza timmer
		clearInterval($scope.idTimmer);
		$scope.idTimmer = setInterval(atualizaTempo, 1000);
	}

	$scope.marcar = function(celula) {

		if (!$scope.fimDeJogo) {
			
			//EH UM TESOURO
			if (celula.tesouro && !celula.marcado) {
				$scope.totalTesourosEncontrados++;
				celula.conteudo = ':D';
				celula.classCss = 'celula-tesouro';
				console.log('Pontuou ' + pontua());
				playAudio($scope.audioPCTesouro);
			}
			else if (!celula.marcado) {
				//Perde pontos quando nao acha tesouro
				$scope.tempoTotalDeJogo-=2;	
				playAudio($scope.audioPSTesouro);

				if (celula.valor > 0) {
					celula.conteudo = celula.valor;
					celula.classCss = 'celula-valor';
				}
				else {
					celula.classCss = 'celula-vazia';	
				}

				console.log('Perdeu ' + $scope.tempoTotalDeJogo + ' tempo!!');
			}

			celula.marcado = true;

			if ($scope.quantidadeDeTesouros == $scope.totalTesourosEncontrados) {
				levelUp();
				$scope.totalDePontos += $scope.tempoTotalDeJogo; 
			}
		}
	};

	function pontua() {

		var pontuou = 0;

		if ($scope.level == 1) {
			pontuou = 20;
			$scope.totalDePontos += 20;	

		}
		if ($scope.level == 2) {
			pontuou = 25;
			$scope.totalDePontos += 25;	

		}
		if ($scope.level == 3) {
			pontuou = 30;
			$scope.totalDePontos += 30;	

		}
		if ($scope.level == 4 || $scope.level == 5 || $scope.level == 6) {
			pontuou = 35;
			$scope.totalDePontos += 35;	

		}
		if ($scope.level == 7 || $scope.level == 8 || $scope.level == 9) {
			pontuou = 50;
			$scope.totalDePontos += 50;	

		}
		if ($scope.level == 10) {
			pontuou = 100;
			$scope.totalDePontos += 100;	

		}

		return pontuou;
	}

	function atualizaTempo() {
		$scope.$apply(function () {

			clearInterval($scope.idTimmer);

			//Se nao acabou jogo
			if (!$scope.fimDeJogo) {
				$scope.tempoTotalDeJogo--;
				console.log('Tempo restante: ' + $scope.tempoTotalDeJogo);

				//Acabou tempo??
				if ($scope.tempoTotalDeJogo <= 0) {

					$scope.fimDeJogo = true;
					playAudio($scope.audioGameOver);
					
				}
			}
	    });
	}

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
		var posicoes = randomUniqueArray($scope.quantidadeDeTesouros, $scope.qtdLinhas);

		for (var i = posicoes.length - 1; i >= 0; i--) {
			var lin = posicoes[i][0];
			var col = posicoes[i][1];

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
		//Ultimo level?
		if ($scope.level != $scope.qtdLevels) {
			$scope.level++;
			playAudio($scope.audioMudaFase);
			resetLevel();
			atualizaDificultade();
			createArena();
		}else{
			$scope.fimDeJogo = true;
			playAudio($scope.audioVitoria);
		}
		
	}

	function atualizaDificultade() {

		if ($scope.level <= 3) {
			$scope.tempoTotalDeJogo = 180;
		}else if ($scope.level  <= 6) {
			$scope.tempoTotalDeJogo = 150;
		}else{
			$scope.tempoTotalDeJogo = 120;	
		}

		$scope.quantidadeDeTesouros--;
	}

	function resetLevel() {
		$scope.totalTesourosEncontrados = 0;
	}

	function playAudio(audio){
		console.log(audio);
		var audio = new Audio(audio);
		audio.play();
	}

	$scope.novoJogo = function() {
       start();
    }; 

	start();

});
