makeArray = (arrayLikeThing) ->
    Array::slice.call arrayLikeThing

log = ->
    console.log.apply console, makeArray(arguments)

passwordString = (value) ->
  new Array(value.length + 1).join '•'

escapeCharacter = (char) ->
  code = char.charCodeAt(0)
  return '&nbsp;' if code is 32
  "&##{ char.charCodeAt(0) };"

escapeCharacters = (str) ->
  escaped = ''
  str.split('').forEach (char) -> escaped += escapeCharacter char
  escaped

formatters =
  name:
    validator: (input) ->
      html = ''
      words = input.value.split(' ')

      words.forEach (word, i) ->
        if word.length is 0 and i isnt 0
          return html += escapeCharacters(word + ' ')

        validatorLabel = 'Middle'
        validatorLabel = 'First' if i is 0
        validatorLabel = 'Last' if i is words.length - 1
        validatorLabel = 'Name' if words.length is 1
        className = if word.match(/^[a-zA-Z'-]+$/) then 'valid' else 'invalid'
        html += """<span class="selection #{ className }" data-validator-label="#{ validatorLabel }" data-value-length="#{ input.value.length }">#{ escapeCharacters word }</span>&nbsp;"""

      console.log html
      html

  url:
    validator: (input) ->
      className = if input.validity.valid then 'valid' else 'invalid'
      extraAttributes = ''
      extraAttributes = """ data-validator-label="URL" data-value-length="#{ input.value.length }" """ if input.value.length is 0
      console.log escapeCharacters input.value
      """<span class="selection #{ className }" #{ extraAttributes }>#{ escapeCharacters input.value }</span>"""

  password:
    validator: (input) ->
      strength = Math.min(10, input.value.length) / .1 # TODO - plz do better here
      strengthData = 'ok'
      strengthData = 'strong' if strength > 80
      strengthData = 'weak' if strength < 50
      """<span class="selection" data-strength="#{ strengthData }">#{ passwordString input.value }</span> """

addPageLoadedClass = ->
  document.body.classList.add 'page-loaded'

setFieldClassesOnFocus = ->
  makeArray(document.querySelectorAll '.field').forEach (field) ->
    input = field.querySelector 'input'
    return unless input
    input.addEventListener 'focus', (event) -> field.classList.add 'field-focused'
    input.addEventListener 'blur', (event) -> field.classList.remove 'field-focused'

setupMimicInputDisplays = ->
  makeArray(document.querySelectorAll '.field').forEach (field) ->
    input = field.querySelector 'input'
    inputValidator = field.querySelector '.input-validator'
    inputDisplay = field.querySelector '.input-display'

    selectionStart = selectionEnd = -1

    updateValidator = ->
      inputValidator.innerHTML = formatters[input.getAttribute('name')].validator input
      updateSelection()

    updateSelection = ->
      update = false

      if input.selectionStart isnt selectionStart or input.selectionEnd isnt selectionEnd
        selectionStart = input.selectionStart
        selectionEnd = input.selectionEnd

        selectionUpdated()

    selectionUpdated = ->
      start = selectionStart
      end = selectionEnd

      if input.getAttribute('type') is 'password'
        value = passwordString input.value
      else
        value = input.value

      if input.value is ''
        inputDisplay.classList.add 'placeholder'
        value = input.getAttribute 'placeholder'
        start = 0
        end = 0
      else
        inputDisplay.classList.remove 'placeholder'

      letters = value.split ''

      letters.forEach (letter, i) ->
        letters[i] = escapeCharacter letter

      if start is end
        letters.splice(start, 0, '<span class="cursor"></span>')
      else
        letters.splice(start, 0, '<span class="selection">')
        letters.splice(end + 1, 0, '</span>')

      html = letters.join('')

      inputDisplay.innerHTML = html

    updateSelection()
    updateValidator()

    input.addEventListener 'input', updateValidator

    input.addEventListener 'change', updateSelection
    input.addEventListener 'mouseup', updateSelection
    input.addEventListener 'click', updateSelection
    input.addEventListener 'mousedown', updateSelection
    input.addEventListener 'mousemove', updateSelection
    input.addEventListener 'keydown', updateSelection
    input.addEventListener 'keypress', updateSelection
    input.addEventListener 'keyup', updateSelection

focusFirstInput = ->
  document.querySelector('.field:first-child input').focus()

init = ->
  setTimeout ->
    addPageLoadedClass()
  , 100
  setFieldClassesOnFocus()
  setupMimicInputDisplays()
  focusFirstInput()

init()