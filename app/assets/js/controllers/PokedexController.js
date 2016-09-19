(function(){
    'use strict';
    angular.module('pokemon.controllers').controller('PokedexController',function(Pokemon){
      this.criaturas = Pokemon.get({
        'limit':151
      });
      this.numeroPokemon=1;
    });
})();
