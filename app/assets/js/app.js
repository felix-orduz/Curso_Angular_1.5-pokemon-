(function() {
  'use strict';
  angular.module('pokemon.services', ['ngResource']);
  angular.module('pokemon.controllers', ['pokemon.services']);
  angular.module('pokemon', ['pokemon.controllers', 'ui.bootstrap', 'ui.router']);
})();
