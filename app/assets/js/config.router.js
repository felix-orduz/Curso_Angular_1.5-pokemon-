 (function() {
   'use strict';
   angular.module('pokemon').config(
     function($stateProvider, $urlRouterProvider) {
       $urlRouterProvider.otherwise('/pokemon/pokedex');
       $stateProvider.state('pokemon', {
         url: '/pokemon',
         templateUrl: 'templates/app.html',
         abstract: true
       }).state('pokemon.pokedex', {
        controller:'PokedexController',
        controllerAs:'ctrl',
         url: '/pokedex',
         templateUrl: 'templates/pokedex.html'
       });
     });
 })();
