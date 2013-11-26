passwordString = (value) ->
  new Array(value.length + 1).join '•'

validateEmail = (email) ->
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test email

escapeCharacter = (char) ->
  code = char.charCodeAt(0)
  return '&nbsp;' if code is 32
  "&##{ char.charCodeAt(0) };"

escapeCharacters = (str) ->
  escaped = ''
  characters = str.split('')
  for char in characters
    escaped += escapeCharacter char
  escaped

formatters =
  name:
    validator: (input) ->
      html = ''
      words = input.value.split(' ')

      for word, i in words
        if word.length is 0 and i isnt 0
          return html += escapeCharacters(word + ' ')

        validatorLabel = 'Middle'
        validatorLabel = 'First' if i is 0
        validatorLabel = 'Last' if i is words.length - 1
        validatorLabel = 'Name' if words.length is 1
        className = if word.match(/^[a-zA-Z'-]+$/) then 'valid' else 'invalid'
        html += """<span class="selection #{ className }" data-validator-label="#{ validatorLabel }" data-value-length="#{ input.value.length }">#{ escapeCharacters word }</span>&nbsp;"""

      html

  email:
    validator: (input) ->
      #className = if input.validity.valid then 'valid' else 'invalid'
      className = if validateEmail(input.value) then 'valid' else 'invalid'
      validationHTML = """<span class="validation #{ className }"></span>"""

      value = input.value

      emailParts = value.split('@')
      if emailParts.length is 2
        return """#{ validationHTML }<span class="username">#{ escapeCharacters emailParts[0] }</span><span class="at">@</span><span class="domain">#{ escapeCharacters emailParts[1] }</span>"""

      """#{ validationHTML }<span class="username">#{ escapeCharacters input.value }</span>"""

  url:
    validator: (input) ->
      className = if input.validity.valid then 'valid' else 'invalid'
      extraAttributes = ''
      extraAttributes = 'data-validator-label="URL"' if input.value.length is 0
      """<span class="selection #{ className }" data-value-length="0" #{ extraAttributes }>#{ escapeCharacters input.value }</span>"""

  password:
    validator: (input) ->
      strength = Math.min(10, input.value.length) / .1 # TODO - plz do better here
      strengthData = 'ok'
      strengthData = 'strong' if strength > 80
      strengthData = 'weak' if strength < 50
      """<span class="selection" data-strength="#{ strengthData }">#{ passwordString input.value }</span> """

setFieldClassesOnFocus = ->
  fields = document.querySelectorAll '.textual .textual-field'

  for field in fields
    do (field) ->
      input = field.querySelector 'input'
      return unless input
      input.addEventListener 'focus', (event) -> field.classList.add 'textual-field-focused'
      input.addEventListener 'blur', (event) -> field.classList.remove 'textual-field-focused'

setupMimicInputDisplays = ->
  fields = document.querySelectorAll '.textual .textual-field'

  for field in fields
    do (field) ->
      input = field.querySelector 'input'
      inputValidator = field.querySelector '.input-validator'
      inputDisplay = field.querySelector '.input-display'

      selectionStart = selectionEnd = -1

      updateValidator = ->
        inputValidator.innerHTML = formatters[field.getAttribute('data-textual-field-type')].validator input

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

        for letter, i in letters
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

      input.addEventListener 'input', ->
        updateValidator()
        updateSelection()

      input.addEventListener 'change', updateSelection
      input.addEventListener 'mouseup', updateSelection
      input.addEventListener 'click', updateSelection
      input.addEventListener 'mousedown', updateSelection
      input.addEventListener 'mousemove', updateSelection
      input.addEventListener 'keydown', updateSelection
      input.addEventListener 'keypress', updateSelection
      input.addEventListener 'keyup', updateSelection

focusFirstInput = ->
  document.querySelector('.textual-field:first-child input').focus()

init = ->
  setFieldClassesOnFocus()
  setupMimicInputDisplays()
  focusFirstInput()

init()