(function(){
    'use strict';
    angular.module('pokemon.services').factory('Pokemon',function($resource){
      return $resource('http://pokeapi.co/api/v2/pokemon/', {},{});
    });

})();
