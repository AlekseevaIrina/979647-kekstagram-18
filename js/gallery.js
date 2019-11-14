'use strict';

(function () {

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  //  обработчик успешной загрузки фотографий с сервера
  var onSuccess = function (allPictures) {

    var pictures = window.data.createPictures(allPictures);
    var fragment = document.createDocumentFragment();
    var picturesList = document.querySelector('.pictures');

    pictures.forEach(function (picture) {
      fragment.appendChild(window.renderPicture(picture));
    });

    picturesList.appendChild(fragment);

  };

  //  обработчик ошибки при загрузке фотографий с сервера
  var onError = function (errorMessage) {
    var errorItem = errorTemplate.cloneNode(true);

    errorItem.querySelector('.error__title').textContent = errorMessage;
    document.querySelector('main').insertAdjacentElement('afterbegin', errorItem);
  };

  window.load(onSuccess, onError);

})();
