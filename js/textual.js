(function() {
  var escapeCharacter, escapeCharacters, focusFirstInput, formatters, init, passwordString, setFieldClassesOnFocus, setupMimicInputDisplays, validateEmail;

  passwordString = function(value) {
    return new Array(value.length + 1).join('•');
  };

  validateEmail = function(email) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
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
    var char, characters, escaped, _i, _len;
    escaped = '';
    characters = str.split('');
    for (_i = 0, _len = characters.length; _i < _len; _i++) {
      char = characters[_i];
      escaped += escapeCharacter(char);
    }
    return escaped;
  };

  formatters = {
    name: {
      validator: function(input) {
        var className, html, i, validatorLabel, word, words, _i, _len;
        html = '';
        words = input.value.split(' ');
        for (i = _i = 0, _len = words.length; _i < _len; i = ++_i) {
          word = words[i];
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
          html += "<span class=\"selection " + className + "\" data-validator-label=\"" + validatorLabel + "\" data-value-length=\"" + input.value.length + "\">" + (escapeCharacters(word)) + "</span>&nbsp;";
        }
        return html;
      }
    },
    email: {
      validator: function(input) {
        var className, emailParts, validationHTML, value;
        className = validateEmail(input.value) ? 'valid' : 'invalid';
        validationHTML = "<span class=\"validation " + className + "\"></span>";
        value = input.value;
        emailParts = value.split('@');
        if (emailParts.length === 2) {
          return "" + validationHTML + "<span class=\"username\">" + (escapeCharacters(emailParts[0])) + "</span><span class=\"at\">@</span><span class=\"domain\">" + (escapeCharacters(emailParts[1])) + "</span>";
        }
        return "" + validationHTML + "<span class=\"username\">" + (escapeCharacters(input.value)) + "</span>";
      }
    },
    url: {
      validator: function(input) {
        var className, extraAttributes;
        className = input.validity.valid ? 'valid' : 'invalid';
        extraAttributes = '';
        if (input.value.length === 0) {
          extraAttributes = 'data-validator-label="URL"';
        }
        return "<span class=\"selection " + className + "\" data-value-length=\"0\" " + extraAttributes + ">" + (escapeCharacters(input.value)) + "</span>";
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

  setFieldClassesOnFocus = function() {
    var field, fields, _i, _len, _results;
    fields = document.querySelectorAll('.textual .textual-field');
    _results = [];
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      field = fields[_i];
      _results.push((function(field) {
        var input;
        input = field.querySelector('input');
        if (!input) {
          return;
        }
        input.addEventListener('focus', function(event) {
          return field.classList.add('textual-field-focused');
        });
        return input.addEventListener('blur', function(event) {
          return field.classList.remove('textual-field-focused');
        });
      })(field));
    }
    return _results;
  };

  setupMimicInputDisplays = function() {
    var field, fields, _i, _len, _results;
    fields = document.querySelectorAll('.textual .textual-field');
    _results = [];
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      field = fields[_i];
      _results.push((function(field) {
        var input, inputDisplay, inputValidator, selectionEnd, selectionStart, selectionUpdated, updateSelection, updateValidator;
        input = field.querySelector('input');
        inputValidator = field.querySelector('.input-validator');
        inputDisplay = field.querySelector('.input-display');
        selectionStart = selectionEnd = -1;
        updateValidator = function() {
          return inputValidator.innerHTML = formatters[field.getAttribute('data-textual-field-type')].validator(input);
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
          var end, html, i, letter, letters, start, value, _j, _len1;
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
          for (i = _j = 0, _len1 = letters.length; _j < _len1; i = ++_j) {
            letter = letters[i];
            letters[i] = escapeCharacter(letter);
          }
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
        input.addEventListener('input', function() {
          updateValidator();
          return updateSelection();
        });
        input.addEventListener('change', updateSelection);
        input.addEventListener('mouseup', updateSelection);
        input.addEventListener('click', updateSelection);
        input.addEventListener('mousedown', updateSelection);
        input.addEventListener('mousemove', updateSelection);
        input.addEventListener('keydown', updateSelection);
        input.addEventListener('keypress', updateSelection);
        return input.addEventListener('keyup', updateSelection);
      })(field));
    }
    return _results;
  };

  focusFirstInput = function() {
    return document.querySelector('.textual-field:first-child input').focus();
  };

  init = function() {
    setFieldClassesOnFocus();
    setupMimicInputDisplays();
    return focusFirstInput();
  };

  init();

}).call(this);
