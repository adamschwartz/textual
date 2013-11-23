(function() {
  var addPageLoadedClass, escapeCharacter, escapeCharacters, focusFirstInput, formatters, init, log, makeArray, passwordString, setFieldClassesOnFocus, setupMimicInputDisplays;

  makeArray = function(arrayLikeThing) {
    return Array.prototype.slice.call(arrayLikeThing);
  };

  log = function() {
    return console.log.apply(console, makeArray(arguments));
  };

  passwordString = function(value) {
    return new Array(value.length + 1).join('•');
  };

  escapeCharacter = function(char) {
    var code;
    code = char.charCodeAt(0);
    if (code === 32) {
      return '&nbsp;';
    }
    return "&#" + (char.charCodeAt(0)) + ";";
  };

  escapeCharacters = function(str) {
    var escaped;
    escaped = '';
    str.split('').forEach(function(char) {
      return escaped += escapeCharacter(char);
    });
    return escaped;
  };

  formatters = {
    name: {
      validator: function(input) {
        var html, words;
        html = '';
        words = input.value.split(' ');
        words.forEach(function(word, i) {
          var className, validatorLabel;
          if (word.length === 0 && i !== 0) {
            return html += escapeCharacters(word + ' ');
          }
          validatorLabel = 'Middle';
          if (i === 0) {
            validatorLabel = 'First';
          }
          if (i === words.length - 1) {
            validatorLabel = 'Last';
          }
          if (words.length === 1) {
            validatorLabel = 'Name';
          }
          className = word.match(/^[a-zA-Z'-]+$/) ? 'valid' : 'invalid';
          return html += "<span class=\"selection " + className + "\" data-validator-label=\"" + validatorLabel + "\" data-value-length=\"" + input.value.length + "\">" + (escapeCharacters(word)) + "</span>&nbsp;";
        });
        console.log(html);
        return html;
      }
    },
    url: {
      validator: function(input) {
        var className, extraAttributes;
        className = input.validity.valid ? 'valid' : 'invalid';
        extraAttributes = '';
        if (input.value.length === 0) {
          extraAttributes = " data-validator-label=\"URL\" data-value-length=\"" + input.value.length + "\" ";
        }
        console.log(escapeCharacters(input.value));
        return "<span class=\"selection " + className + "\" " + extraAttributes + ">" + (escapeCharacters(input.value)) + "</span>";
      }
    },
    password: {
      validator: function(input) {
        var strength, strengthData;
        strength = Math.min(10, input.value.length) / .1;
        strengthData = 'ok';
        if (strength > 80) {
          strengthData = 'strong';
        }
        if (strength < 50) {
          strengthData = 'weak';
        }
        return "<span class=\"selection\" data-strength=\"" + strengthData + "\">" + (passwordString(input.value)) + "</span> ";
      }
    }
  };

  addPageLoadedClass = function() {
    return document.body.classList.add('page-loaded');
  };

  setFieldClassesOnFocus = function() {
    return makeArray(document.querySelectorAll('.field')).forEach(function(field) {
      var input;
      input = field.querySelector('input');
      if (!input) {
        return;
      }
      input.addEventListener('focus', function(event) {
        return field.classList.add('field-focused');
      });
      return input.addEventListener('blur', function(event) {
        return field.classList.remove('field-focused');
      });
    });
  };

  setupMimicInputDisplays = function() {
    return makeArray(document.querySelectorAll('.field')).forEach(function(field) {
      var input, inputDisplay, inputValidator, selectionEnd, selectionStart, selectionUpdated, updateSelection, updateValidator;
      input = field.querySelector('input');
      inputValidator = field.querySelector('.input-validator');
      inputDisplay = field.querySelector('.input-display');
      selectionStart = selectionEnd = -1;
      updateValidator = function() {
        inputValidator.innerHTML = formatters[input.getAttribute('name')].validator(input);
        return updateSelection();
      };
      updateSelection = function() {
        var update;
        update = false;
        if (input.selectionStart !== selectionStart || input.selectionEnd !== selectionEnd) {
          selectionStart = input.selectionStart;
          selectionEnd = input.selectionEnd;
          return selectionUpdated();
        }
      };
      selectionUpdated = function() {
        var end, html, letters, start, value;
        start = selectionStart;
        end = selectionEnd;
        if (input.getAttribute('type') === 'password') {
          value = passwordString(input.value);
        } else {
          value = input.value;
        }
        if (input.value === '') {
          inputDisplay.classList.add('placeholder');
          value = input.getAttribute('placeholder');
          start = 0;
          end = 0;
        } else {
          inputDisplay.classList.remove('placeholder');
        }
        letters = value.split('');
        letters.forEach(function(letter, i) {
          return letters[i] = escapeCharacter(letter);
        });
        if (start === end) {
          letters.splice(start, 0, '<span class="cursor"></span>');
        } else {
          letters.splice(start, 0, '<span class="selection">');
          letters.splice(end + 1, 0, '</span>');
        }
        html = letters.join('');
        return inputDisplay.innerHTML = html;
      };
      updateSelection();
      updateValidator();
      input.addEventListener('input', updateValidator);
      input.addEventListener('change', updateSelection);
      input.addEventListener('mouseup', updateSelection);
      input.addEventListener('click', updateSelection);
      input.addEventListener('mousedown', updateSelection);
      input.addEventListener('mousemove', updateSelection);
      input.addEventListener('keydown', updateSelection);
      input.addEventListener('keypress', updateSelection);
      return input.addEventListener('keyup', updateSelection);
    });
  };

  focusFirstInput = function() {
    return document.querySelector('.field:first-child input').focus();
  };

  init = function() {
    setTimeout(function() {
      return addPageLoadedClass();
    }, 100);
    setFieldClassesOnFocus();
    setupMimicInputDisplays();
    return focusFirstInput();
  };

  init();

}).call(this);
