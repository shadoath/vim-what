/**
 * Vim What?
 * Learn vim with style
 */
var layouts = {}
var lessons = {}
var curLayout = 'colemack'
var curLesson = '11'
var key_info = {}
var maps = {
  n: {}, // "n"  Normal
  v: {}, // "v"  Visual (including Select)
  o: {}, // "o"  Operator-pending
  i: {}, // "i"  Insert
  c: {}, // "c"  Cmd-line
  s: {}, // "s"  Select
  x: {}, // "x"  Visual
  l: {}, // "l"  langmap |language-mapping|
}
var debug = true
var append = true
var saving_map = false
var vim_help = 'http://vimhelp.appspot.com/'

$(document).ready(function () {
  $.getJSON('/lib/key_info_symbols.json', function (json) {
    $.extend(key_info, json)
  })
  $.getJSON('/lib/key_info_numbers.json', function (json) {
    $.extend(key_info, json)
  })
  $.getJSON('/lib/key_info_letters.json', function (json) {
    $.extend(key_info, json)
  })
  $.getJSON('/lib/key_links.json', function (json) {
    $.extend(key_info, json)
  })
  $.getJSON('/lib/lessons.json', function (json) {
    lessons = json
  })
  $.getJSON('/lib/layouts.json', function (json) {
    layouts = json
  })
  $('#layout-choice').on('change click', function () {
    curLayout = $('#layout-choice').find(':selected').val()
    refresh(curLayout, curLesson)
  })
  $('#lesson-choice').on('change click', function () {
    curLesson = $('#lesson-choice').find(':selected').val()
    refresh(curLayout, curLesson)
  })
  chrome.storage.sync.get(['curLayout', 'curLesson'], function (data) {
    if (typeof data.curLayout != 'undefined') curLayout = data.curLayout
    if (typeof data.curLesson != 'undefined') curLesson = data.curLesson
    $('#layout-choice').val(curLayout)
    $('#lesson-choice').val(curLesson)
    setTimeout(function () {
      refresh(curLayout, curLesson)
    }, 100)
  })
  $('#query').focus()
})

function refresh(layout, lesson) {
  loadKeyboard(layout)
  if (curLesson == '11') {
    $('.info-key').html("<img src='/images/about/all.png'>")
  } else {
    loadLesson(parseInt(lesson))
    $('.info-key').html("<img src='/images/about/lesson_" + lesson + ".png'>")
  }
  saveChanges()
}

function loadLesson(lesson) {
  $('.key').addClass('faded')
  $([0, 1, 2, 3, 4, 5, 6, 7]).each(function (I, lessonLayer) {
    if (lesson >= I) {
      $(lessons[I].split('')).each(function (i, k) {
        $("span:contains('" + k + "')")
          .parent()
          .removeClass('faded')
        if (lesson > I) {
          $("span:contains('" + k + "')")
            .parent()
            .addClass('some-faded')
        }
      })
    }
  })
}

function loadKeyboard(keyboard) {
  layer = ''
  $('.keyboard-base').html("<div class='keyboard' id='" + keyboard + "'>")

  shifted = 0
  $(layouts[keyboard]).each(function (layer, value) {
    shifted++
    nextLayer = keyboard + '-' + layer
    if (shifted % 2 == 1) {
      $('#' + keyboard).append(
        "<div class='keyboardRow shifted' id='" + nextLayer + "'>"
      )
    } else {
      $('#' + keyboard).append(
        "<div class='keyboardRow' id='" + nextLayer + "'>"
      )
    }
    $(value.split('')).each(function (i, k) {
      keyInfo = "<div class='key' id='" + k + "'>"
      if (
        typeof key_info[k] != 'undefined' &&
        typeof key_info[k]['image'] != 'undefined'
      ) {
        keyInfo += "<img src='" + key_info[k]['image'] + "'>"
      }
      keyInfo += "<span class='key-value'>" + k + '</span>'
      keyInfo += '</div>'
      $('#' + nextLayer).append(keyInfo)
    })
  })
  $('.keyboard').append('</div>')
  infoblocks()
}

function infoblocks() {
  $('.key').on('click', function (event, key) {
    loadInfo($(this).find('span')[0].innerHTML, event.shiftKey)
  })
  saving_map = false
}
$(window).on('keyup', function (event, key) {
  debugLog({ event, key })
  if (!saving_map) {
    if (event.key == 'Enter') {
      map_query = $('#query')[0].value
      debugLog({ map_query })
      $('#query')[0].value = ''
      $('#query')[0].placeholder = map_query
      // $(".info-key").html("<span>"+map_query+"</span><br>");
      if (event.shiftKey) {
        mapChange(map_query)
      } else {
        mapSearch(map_query)
      }
    } else if (event.key != 'Shift') {
      loadInfo(event.key, event.shiftKey)
    }
  }
})

// Map lookup
function mapSearch(query) {
  debugLog('mapSearch')
  debugLog({ query })
  info = ''
  if (query == '') {
    $('.info-key').html('Create a new map with &lt;shift&gt;+Enter')
  } else {
    $('.info-key').html('')
    // debugLog((data);
    map_split = query.split('')
    for (i = 0; i < map_split.length; i++) {
      loadImage(map_split[i])
    }
    $('.info-key').append(info)
    chrome.storage.sync.get(map_query, function (data) {
      if (typeof data[map_query] != 'undefined') {
        $('.info-key').append('<pre>' + data[map_query] + '</pre>')
      } else {
        $('.info-key').append('<br>No map found, use Shift + Enter to create.')
      }
    })
  }
}

// Load map into editable window
function mapChange(map_query) {
  saving_map = true
  map_split = map_query.split('')
  map_mode = $('#map-mode-choice').find(':selected').val()
  $(document).unbind('keyup')
  $('.key').unbind('click')
  $('.info-key').append("<textarea id='update-map' rows='6' cols='50'>")
  $('.info-key').append(
    "<br><button id='save-map'   type='button'>Save</button>"
  )
  $('.info-key').append("<button id='cancel-map' type='button'>Cancel</button>")
  $('.info-key').append("<button id='delete-map' type='button'>Delete</button>")
  chrome.storage.sync.get(map_query, function (data) {
    if (typeof data[map_query] != 'undefined') {
      $('#update-map').html(data[map_query])
    } else {
      $('#update-map').attr('placeholder', 'Type your map here')
    }
  })
  $('#save-map').on('click', function () {
    newMapValue = $('#update-map').val()
    chrome.storage.sync.set({ [map_query]: newMapValue }, function () {
      $('.info-key').html(map_query + ' saved to:<br>' + newMapValue)
      debugLog('Saved-map: ' + map_query + ': ' + newMapValue)
    })
    infoblocks()
  })
  $('#cancel-map').on('click', function () {
    $('.info-key').html('Canceled')
    infoblocks()
  })
  $('#delete-map').on('click', function () {
    chrome.storage.sync.remove([map_query], function () {
      $('.info-key').html(
        '<span>' + map_query + "</span><br><span class='red'>DELETED</span>"
      )
      debugLog('Deleted map: ' + map_query)
    })
    infoblocks()
  })
}

function loadInfo(key, shifted) {
  debugLog({ key, shifted })
  info = ''
  if (shifted == true) {
    key = key.toUpperCase()
  }
  if (typeof key_info[key] != 'undefined') {
    loadTitle(key)
    loadImage(key, true)
    loadText(key)
    loadPlugin(key)
    loadHelp(key)
    $('.info-key').html(info)
  } else {
    $('.info-key').html('no Vim info yet')
    $('.info-key').append(
      "<br><br>Contribute on: <a href='https://github.com/shadoath/vim-what' target='_blank'>GitHub</a>"
    )
  }
  $('.link').on('click', function () {
    debugLog('LINK' + this.innerHTML)
    loadInfo(this.innerHTML)
  })
}

function loadTitle(key) {
  if (typeof key_info[key]['title'] != 'undefined') {
    debugLog(key_info[key]['title'])
    info = '<p>' + key_info[key]['title'] + '</p>'
  } else {
    info = key + '<br>'
  }
}

function loadText(key) {
  var text = key_info[key]['text']
  var pipe = new RegExp(/\|(.+?)\|/gi)
  var links = pipe.exec(text)
  if (links != null) {
    links.shift()
    $(links).each(function (name, value) {
      if (typeof key_info[value] != 'undefined') {
        var link = "<span class='link'>" + value + '</span>'
        text = text.replace(value, link)
      }
    })
  }
  info += text
}

function loadImage(key, append = false) {
  if (
    typeof key_info[key] != 'undefined' &&
    typeof key_info[key]['image'] != 'undefined'
  ) {
    info += "<img src='" + key_info[key]['image'] + "'>"
    if (append) {
      info += '<br>'
    }
  }
}

function loadAction(key) {
  if (typeof key_info[key]['action'] != 'undefined') {
    debugLog(key_info[key]['action'])
    var link = ''
    info += '<br>'
    switch (key_info[key]['action']) {
      case 'motion':
        link = 'http://vimhelp.appspot.com/motion.txt.html#motion.txt'
        break
      case 'command':
        link = 'http://vimhelp.appspot.com/map.txt.html#%3Acommand'
        break
      case 'operator':
        link = 'http://vimhelp.appspot.com/motion.txt.html#operator'
        break
      case 'extra':
        link = 'http://vimhelp.appspot.com'
        break
    }
    info += "<a href='" + link + "' target='_blank'>Vim help</a>"
  } else {
    info += key + '<br>'
  }
}

function loadHelp(key) {
  if (typeof key_info[key]['vimhelp'] != 'undefined') {
    var help = key_info[key]['vimhelp']
    var link = ''
    debugLog(help)
    info += "<span class='info-content'>"
    link = 'http://vimhelp.appspot.com/' + help
    info += "<a href='" + link + "' target='_blank'>Vim help</a>"
    info += '</span>'
  }
}

function loadPlugin(key) {
  if (typeof key_info[key]['plugins'] != 'undefined') {
    var plugins = key_info[key]['plugins'].split(' || ')
    $(plugins).each(function (key, plugin) {
      // debugLog(plugin);
      plugin = plugin.split(' | ')
      info += "<span class='plugin-content'>"
      info +=
        "<b>Plugin:</b> <a href='https://github.com/" +
        plugin[0] +
        "' target='_blank'>" +
        plugin[0] +
        '</a>'
      info += '</span>'
      info += '<pre>' + plugin[1] + '</pre>'
    })
  }
}
function loadCombo(value) {
  debugLog(value)
  //TODO load from mappings
}

function saveChanges() {
  chrome.storage.sync.set(
    { curLayout: curLayout, curLesson: curLesson },
    function () {
      debugLog('Saved layout/lesson')
    }
  )
}

function debugLog(message) {
  if (debug) {
    console.log(message)
  }
}
