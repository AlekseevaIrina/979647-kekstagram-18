'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var imgFilters = document.querySelector('.img-filters');
  var popularButton = imgFilters.querySelector('#filter-popular');
  var randomButton = imgFilters.querySelector('#filter-random');
  var discussedButton = imgFilters.querySelector('#filter-discussed');

  var picturesCopy = [];

  window.updatePictures = function (allPictures) {

    removePictures();

    var pictures = window.data.createPictures(allPictures);
    var fragment = document.createDocumentFragment();
    var picturesList = document.querySelector('.pictures');

    pictures.forEach(function (picture) {
      fragment.appendChild(window.renderPicture(picture));
    });

    picturesList.appendChild(fragment);
  };

  //  удаление уже отрисованных фотографий
  var removePictures = function () {
    var pictures = document.querySelectorAll('.picture');

    pictures.forEach(function (picture) {
      picture.remove();
    });
  };

  //  обработчик успешной загрузки фотографий с сервера
  var onSuccess = function (pictures) {

    picturesCopy = JSON.parse(JSON.stringify(pictures));

    window.updatePictures(pictures);

    imgFilters.classList.remove('img-filters--inactive');

    popularButton.addEventListener('click', window.util.debounce(function () {
      window.filters.onPopularButtonClick(picturesCopy, popularButton);
    }, DEBOUNCE_INTERVAL));

    randomButton.addEventListener('click', window.util.debounce(function () {
      window.filters.onRandomButtonClick(pictures, randomButton);
    }, DEBOUNCE_INTERVAL));

    discussedButton.addEventListener('click', window.util.debounce(function () {
      window.filters.onDiscussedButtonClick(pictures, discussedButton);
    }, DEBOUNCE_INTERVAL));
  };

  window.api.load(onSuccess, window.api.onServerRequestError);

})();
