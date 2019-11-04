'use strict';

(function () {

  var pictures = window.createPictures();
  var fragment = document.createDocumentFragment();
  var picturesList = document.querySelector('.pictures');

  pictures.forEach(function (picture) {
    fragment.appendChild(window.renderPicture(picture));
  });

  picturesList.appendChild(fragment);

})();
