# 3d stuff

makeArray = (arrayLikeThing) ->
  Array::slice.call arrayLikeThing

lastFocusedField = undefined

document.querySelector('.three-dee-toggle').addEventListener 'mouseover', ->
  lastFocusedField = document.querySelector('.textual-field.textual-field-focused input') or document.querySelector('.textual-field:first-child input')

document.querySelector('.three-dee-toggle').addEventListener 'click', ->
  return if document.body.classList.contains 'three-dee-primed'

  if @classList.contains 'three-dee-toggled'
    @classList.remove 'three-dee-toggled'
    document.body.classList.add 'three-dee-primed'
    document.body.classList.remove 'three-dee'
    setTimeout ->
      document.body.classList.remove 'three-dee-primed'
    , 2000

  else
    @classList.add 'three-dee-toggled'

    document.body.classList.add 'three-dee-primed'
    setTimeout ->
      document.body.classList.add 'three-dee'
      document.body.classList.remove 'three-dee-primed'
    , 100

  lastFocusedField?.focus()

makeArray(document.querySelectorAll('input')).forEach (input) ->
  input.addEventListener 'blur', (event) ->
    if document.body.classList.contains('three-dee-primed') or document.body.classList.contains('three-dee')
      event.preventDefault()
      @focus()
      return false

# Page load

setTimeout ->
  document.body.classList.add 'page-loaded'
, 100