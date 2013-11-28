'use strict';

/* Services */
angular.module('bookd.services', [])
  .factory('util', ['$window', function utilServiceFactory($window) {
    function random(min, max) { // inclusive
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function popup(url, title, options) {
      var wnd_settings = {
        width: Math.floor($window.outerWidth * 0.8),
        height: Math.floor($window.outerHeight * 0.5)
      };
      if (wnd_settings.height < 350)
        wnd_settings.height = 350;
      if (wnd_settings.width < 800)
        wnd_settings.width = 800;
      wnd_settings.left = $window.screenX + ($window.outerWidth - wnd_settings.width) / 2;
      wnd_settings.top = $window.screenY + ($window.outerHeight - wnd_settings.height) / 8;
      var wnd_options = "width=" + wnd_settings.width + ",height=" + wnd_settings.height;
      wnd_options += "scrollbars=1,status=1,resizable=1";
      wnd_options += ",left=" + wnd_settings.left + ",top=" + wnd_settings.top;

      $window.open(url, title, options || wnd_options);
    }

    function toTitleCase(str) {
      str.charAt(0).toUpperCase() + Str.substr(1);
    }

    return {
      random: random,
      popup: popup,
      toTitleCase: toTitleCase
    };
  }])
  // Service for Pearson Penguin Classics API
  .factory('penguinClassics', ['$http', '$q', 'util', function penguinServiceFactory($http, $q, util) {
    function getId(data) {
      return data.articles[0].id;
    }

    function randomArticle() {
      var deferred = $q.defer();
      var COUNT = 198;
      var BASE = 'https://api.pearson.com/penguin/classics/v1/articles?limit=1&offset=';
      $http.get(BASE + util.random(0, COUNT - 1))
           .success(function listSuccess(data) { getArticle(getId(data), deferred); });
      return deferred.promise;
    }

    function getArticle(id, deferred) {
      var show_url = 'https://api.pearson.com/penguin/classics/v1/articles/'+ id +'?content-fmt=html';
      $http.get(show_url)
           .success(function getSuccessResponse(data) { deferred.resolve(parseArticle(data)); });
    }

    function parseArticle(data) {
      var article = data.article;
      return {
        title: article.book.title,
        content: article.content
      };
    }

    return {
      randomArticle: randomArticle
    };
  }])
  .factory('credentials', ['$window', 'util', function credentialServiceFactory($window, util) {

    function popup(provider) {
      util.popup('/signin/' + provider, 'Authorize Bookd');
    }

    return {
      popup: popup
    };
  }])
  .factory('share', [
    '$http',
    '$window',
    '$q',
    'util',
    function shareServiceFactory($http, $window, $q, util) {
      function post(data) {
        var deferred = $q.defer();
        $http.post('/api/share', data)
             .success(function(data) { deferred.resolve(data); });
        return deferred.promise;
      }

      function storeMedia(data) {
        if ($window.opener) {
          $window.opener.localStorage.image = data;
        }
        else {
          $window.localStorage.image = data;
        }
      }

      function getMedia() {
        if ($window.opener) {
          return $window.opener.localStorage.image;
        }
        else {
          return $window.localStorage.image;
        }
      }

      function storeMessage(msg) {
        if ($window.opener) {
          $window.opener.localStorage.message = msg;
        }
        else {
          $window.localStorage.message = msg;
        }
      }

      function getMessage() {
        if ($window.opener) {
          return $window.opener.localStorage.message;
        }
        else {
          return $window.localStorage.message;
        }
      }

      return {
        post: post,
        storeMedia: storeMedia,
        getMedia: getMedia,
        storeMessage: storeMessage,
        getMessage: getMessage
      };
    }
  ]);