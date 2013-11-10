'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .value('version', '0.1')
  // Service for Pearson Penguin Classics API
  .factory('pcArticle', ['$http', function($http) {
    var COUNT = 198;
    var list_url = 'https://api.pearson.com/penguin/classics/v1/articles?limit=1&offset='+ random(0, COUNT);

    return {
      chooseArticle: chooseArticle,
      getArticle: getArticle,
      canvasText: canvasText
    };

    function chooseArticle(successCallback) {
      $http.get(list_url).success(successCallback);
    }

    function getArticle(id, successCallback) {
      var show_url = 'https://api.pearson.com/penguin/classics/v1/articles/'+ id +'?content-fmt=html';
      $http.get(show_url).success(successCallback);
    }

    function canvasText(text) {
      var nestedText = text
        .replace(/<\/?article[^>]*>|<a>.+?<\/a>|<\/?div[^>]*>/ig, '')
        .replace(/<span class="smallcaps">(.*)<\/span>/ig, function(match, p1) {
          return p1.toUpperCase();
        })
        .replace(/<(h\d)[^>]*>/ig, '<class="$1">')
        .replace(/<\/h\d>/ig, '</class><br />')
        .replace(/<\/?p[^>]*>/ig, '<br />')
        .replace(/<blockquote[^>]*>\s*(<br \/>)*<em>/ig, '<br /><em>')
        .replace(/<\/em>(<br \/>)*\s*<\/blockquote>/ig, '</em>')
        .replace(/<blockquote[^>]*>\s*(<br \/>)*/ig, '<br /><class="blockquote">')
        .replace(/(<br \/>)*\s*<\/blockquote>/ig, '</class><br />')
        .replace(/<em>/ig, '<class="em">')
        .replace(/<\/em>|<\/blockquote>/ig, '</class>')
        .replace(/<\/?span[^>]*>|<\/?table[^>]*>|<\/?tr[^>]*>|<\/?td[^>]*>|<img[^>]*>/ig, '')
        .replace(/&#x(\w+);/ig, function(match, p1) {
          return String.fromCharCode(parseInt(p1, 16));
        });

      return removeNestedClasses(nestedText);
    }

    function removeNestedClasses(text) {
      if (!text.match(/<class="([^"]+)">[^<]*(<br \/>|<class)+/i)) return text;
      var lessNested = text.replace(/<class="([^"]+)">([^<]*)(<br \/>+)/ig, '<class="$1">$2</class>$3<class="$1">')
                           .replace(/<class="([^"]+)">([^<]*)<class="em">([^<]*)<\/class>/ig, '<class="$1">$2$3');
      return removeNestedClasses(lessNested);
    }
  }]);

var random = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};