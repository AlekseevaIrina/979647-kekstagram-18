'use strict';

(function () {
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

  window.api.load(onSuccess, window.api.onServerRequestError);

})();
