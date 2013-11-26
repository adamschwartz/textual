(function() {
  var lastFocusedField, makeArray;

  makeArray = function(arrayLikeThing) {
    return Array.prototype.slice.call(arrayLikeThing);
  };

  lastFocusedField = void 0;

  document.querySelector('.three-dee-toggle').addEventListener('mouseover', function() {
    return lastFocusedField = document.querySelector('.textual-field.textual-field-focused input') || document.querySelector('.textual-field:first-child input');
  });

  document.querySelector('.three-dee-toggle').addEventListener('click', function() {
    if (document.body.classList.contains('three-dee-primed')) {
      return;
    }
    if (this.classList.contains('three-dee-toggled')) {
      this.classList.remove('three-dee-toggled');
      document.body.classList.add('three-dee-primed');
      document.body.classList.remove('three-dee');
      setTimeout(function() {
        return document.body.classList.remove('three-dee-primed');
      }, 2000);
    } else {
      this.classList.add('three-dee-toggled');
      document.body.classList.add('three-dee-primed');
      setTimeout(function() {
        document.body.classList.add('three-dee');
        return document.body.classList.remove('three-dee-primed');
      }, 100);
    }
    return lastFocusedField != null ? lastFocusedField.focus() : void 0;
  });

  makeArray(document.querySelectorAll('input')).forEach(function(input) {
    return input.addEventListener('blur', function(event) {
      if (document.body.classList.contains('three-dee-primed') || document.body.classList.contains('three-dee')) {
        event.preventDefault();
        this.focus();
        return false;
      }
    });
  });

  setTimeout(function() {
    return document.body.classList.add('page-loaded');
  }, 100);

}).call(this);
