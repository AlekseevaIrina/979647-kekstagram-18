'use strict';

(function () {
  var SHOWN_COMMENTS = 5;

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  var socialComments = bigPicture.querySelector('.social__comments');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

  socialComments.textContent = '';

  window.preview = {
    closeBigPicture: function () {
      bigPicture.classList.add('hidden');
      document.removeEventListener('keydown', window.util.onDocumentEscPress);
      socialComments.textContent = '';
    },
    showBigPicture: function (picture) {
      bigPictureImg.src = picture.url;

      var numberOfComments = picture.comments.length;
      var commentsVisible = 5;

      bigPicture.querySelector('.likes-count').textContent = picture.likes;
      bigPicture.querySelector('.comments-count').textContent = numberOfComments;
      bigPicture.querySelector('.social__caption').textContent = picture.description;

      socialComments.appendChild(window.data.getCommentsFragment(picture.comments.slice(0, commentsVisible)));

      if (numberOfComments > commentsVisible) {
        commentsLoader.addEventListener('click', function () {
          socialComments.appendChild(window.data.getCommentsFragment(picture.comments.slice(commentsVisible, commentsVisible + SHOWN_COMMENTS)));
          commentsVisible += SHOWN_COMMENTS;
          if (numberOfComments < commentsVisible) {
            commentsLoader.classList.add('visually-hidden');
          }
        });

        commentsLoader.classList.remove('visually-hidden');
      }

      bigPicture.classList.remove('hidden');

      bigPictureCancel.addEventListener('click', function () {
        window.preview.closeBigPicture();
      });

      document.addEventListener('keydown', window.util.onDocumentEscPress);
    }
  };

})();
