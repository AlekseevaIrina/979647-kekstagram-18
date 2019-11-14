'use strict';

(function () {
  var SHOWN_PICTURES = 25;

  var createUserComments = function (pictures) {
    var userComments = [];
    for (var i = 0; i < pictures.length; i++) {
      userComments.push({
        avatar: pictures[i].avatar,
        message: pictures[i].message,
        name: pictures[i].name
      });
    }
    return userComments;
  };

  window.data = {
    createPictures: function (allPictures) {
      var pictures = [];
      for (var i = 0; i < SHOWN_PICTURES; i++) {
        pictures.push({
          url: allPictures[i].url,
          description: ' ',
          likes: allPictures[i].likes,
          comments: createUserComments(allPictures[i].comments)
        });
      }
      return pictures;
    },
    getCommentsFragment: function (comments) {
      var fragment = document.createDocumentFragment();
      var commentTemplate = document.querySelector('#social__comment').content.querySelector('.social__comment');
      var commentsVisible = 5;

      for (var i = 0; i < comments.length && i <= commentsVisible - 1; i++) {
        var commentElement = commentTemplate.cloneNode(true);
        commentElement.querySelector('.social__picture').src = comments[i].avatar;
        commentElement.querySelector('.social__picture').alt = comments[i].name;
        commentElement.querySelector('.social__text').textContent = comments[i].message;
        fragment.appendChild(commentElement);
      }

      return fragment;
    }
  };

})();
