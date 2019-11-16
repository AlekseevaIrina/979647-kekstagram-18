'use strict';

(function () {
  var API_URL = 'https://js.dump.academy/kekstagram/';
  var HTTP_REQUEST_OK = 200;
  var WAITING_TIMEOUT = 5000;
  var METHOD_GET = 'GET';
  var METHOD_POST = 'POST';

  var request = function (url, method, data, onSuccess, onError) {
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

    xhr.open(method, url);
    xhr.send(data);
  };

  //  работа с окном ошибки отправки данных на сервер
  var errorTemplateElement = document.querySelector('#error').content.querySelector('.error');
  var errorItem = errorTemplateElement.cloneNode(true);
  errorItem.style.display = 'none';
  document.querySelector('main').insertAdjacentElement('afterbegin', errorItem);

  var errorButtonsElements = errorItem.querySelectorAll('.error__button');

  var onErrorMessageClose = function () {
    errorItem.style.display = 'none';
    document.removeEventListener('keydown', onErrorMessageEscPress);
  };

  var onErrorMessageEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      onErrorMessageClose();
    }
  };

  errorButtonsElements.forEach(function (elem) {
    elem.addEventListener('click', onErrorMessageClose);
  });

  errorItem.addEventListener('click', onErrorMessageClose);

  window.api = {
    load: function (onSuccess, onError) {
      request(API_URL + 'data', METHOD_GET, null, onSuccess, onError);
    },

    send: function (data, onSuccess, onError) {
      request(API_URL, METHOD_POST, data, onSuccess, onError);
    },

    onServerRequestError: function (errorMessage) {
      errorItem.querySelector('.error__title').textContent = errorMessage;
      errorItem.style.display = 'flex';

      document.addEventListener('keydown', onErrorMessageEscPress);
    }
  };
})();
