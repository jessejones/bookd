'use strict';

/* Services */
angular.module('bookd.services', [])
  .factory('util', ['$window', function utilServiceFactory($window) {
    function random(min, max) { // inclusive
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function toTitleCase(str) {
      str.charAt(0).toUpperCase() + Str.substr(1);
    }

    return {
      random: random,
      toTitleCase: toTitleCase
    };
  }])
  // Service for Pearson Penguin Classics API
  .factory('penguinClassics', ['$http', '$q', 'util', function penguinServiceFactory($http, $q, util) {
    var apiKey = '&apikey=XaFoCr1dzBfhqnEqAalcU7Wdhr6eNcZ2';

    function getId(data) {
      return data.articles[0].id;
    }

    function randomArticle() {
      var deferred = $q.defer();
      var COUNT = 198;
      var BASE = 'https://api.pearson.com/penguin/classics/v1/articles?limit=1&offset=';
      $http.get(BASE + util.random(0, COUNT - 1) + apiKey)
           .success(function listSuccess(data) { getArticle(getId(data), deferred); });
      return deferred.promise;
    }

    function getArticle(id, deferred) {
      var show_url = 'https://api.pearson.com/penguin/classics/v1/articles/'+ id +'?content-fmt=html';
      $http.get(show_url + apiKey)
           .success(function getSuccessResponse(data) {
             getBook(data, deferred);
             // deferred.resolve(parseArticle(data));
          });
    }

    function getBook(data, deferred) {
      var book_url = 'https://api.pearson.com/penguin/classics/v1/books/' + data.article.book.id;
      $http.get(book_url + '?' + apiKey)
           .success(function (bookData) {
             data.article.book.isbn = bookData.book.isbn;
             data.article.book.author = bookData.book.authors[0]['full_name'];
             deferred.resolve(parseArticle(data));
           });
    }

    function parseArticle(data) {
      var article = data.article;
      return {
        title: article.book.title,
        author: article.book.author,
        content: article.content,
        isbn: article.book.isbn
      };
    }

    return {
      randomArticle: randomArticle
    };
  }]);