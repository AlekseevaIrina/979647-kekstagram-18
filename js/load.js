'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram/data';
  var HTTP_REQUEST_OK = 200;
  var WAITING_TIMEOUT = 5000;

  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_REQUEST_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = WAITING_TIMEOUT;

    xhr.open('GET', URL);
    xhr.send();
  };
})();
