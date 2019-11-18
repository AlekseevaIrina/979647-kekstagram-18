'use strict';

(function () {
  var RANDOM_ARRAY_LENGTH = 10;
  var CLASS_ACTIVE_BUTTON = 'img-filters__button--active';

  var changeCurrentButton = function (activeButton) {
    var currentActiveButton = document.querySelector('.' + CLASS_ACTIVE_BUTTON);
    currentActiveButton.classList.toggle(CLASS_ACTIVE_BUTTON);

    activeButton.classList.add(CLASS_ACTIVE_BUTTON);
  };

  var getPopularPictures = function (pictures, button) {
    window.updatePictures(pictures);
    changeCurrentButton(button);
  };

  var getRandomPictures = function (pictures, button) {
    var copiesOfPictures = JSON.parse(JSON.stringify(pictures));
    var picturesRandom = [];

    for (var i = 0; i < RANDOM_ARRAY_LENGTH; i++) {
      var index = window.util.getRandomInt(0, copiesOfPictures.length - 1);
      picturesRandom.push(copiesOfPictures.splice(index, 1)[0]);
    }

    window.updatePictures(picturesRandom);
    changeCurrentButton(button);
  };

  var getDiscussedPictures = function (pictures, button) {
    var picturesDiscussed = pictures.sort(function (prevPicture, nextPicture) {
      return nextPicture.comments.length - prevPicture.comments.length;
    });

    window.updatePictures(picturesDiscussed);
    changeCurrentButton(button);
  };

  window.filters = {
    showPopularPictures: getPopularPictures,

    showRandomPictures: getRandomPictures,

    showDiscussedPictures: getDiscussedPictures
  };
})();
