/**
 * Vim What?
 * Learn vim with style
 */
var layouts   = {};
var lessons   = {};
var curLayout = "colemack";
var curLesson = "11";
var key_info  = {};
var maps  = {
  "n": {},  // "n"  Normal
  "v": {},  // "v"  Visual (including Select)
  "o": {},  // "o"  Operator-pending
  "i": {},  // "i"  Insert
  "c": {},  // "c"  Cmd-line
  "s": {},  // "s"  Select
  "x": {},  // "x"  Visual
  "l": {},  // "l"  langmap |language-mapping|
};
var append = true;
var vim_help = "http://vimhelp.appspot.com/"

$(document).ready(function(){
  $.getJSON("/lib/my_sorted_maps.json", function(json) {
    $(json).each(function(layer, value){
      mode = value[0];
      key  = value[1];
      map  = value[2];
      switch(mode) {
        case " ":
          $.extend(maps["n"], {[key]: map});
          $.extend(maps["v"], {[key]: map});
          $.extend(maps["o"], {[key]: map});
          break;
        default:
          $.extend(maps[""+mode], {[key]: map});
          break;
      }
    })
  });
  $.getJSON("/lib/key_info_symbols.json", function(json) {
    $.extend(key_info, json);
  });
  $.getJSON("/lib/key_info_numbers.json", function(json) {
    $.extend(key_info, json);
  });
  $.getJSON("/lib/key_info_letters.json", function(json) {
    $.extend(key_info, json);
  });
  $.getJSON("/lib/key_links.json", function(json) {
    $.extend(key_info, json);
  });
  $.getJSON("/lib/lessons.json", function(json) {
    lessons = json;
  });
  $.getJSON("/lib/layouts.json", function(json) {
    layouts = json;
  });
  $("#layout-choice").on("change click", function(){
    curLayout = $("#layout-choice").find(":selected").val();
    refresh(curLayout, curLesson)
  });
  $("#lesson-choice").on("change click", function(){
    curLesson = $("#lesson-choice").find(":selected").val();
    refresh(curLayout, curLesson)
  });
  chrome.storage.sync.get(['curLayout', 'curLesson'], function(data) {
    if (typeof(data.curLayout) != "undefined") curLayout = data.curLayout;
    if (typeof(data.curLesson) != "undefined") curLesson = data.curLesson;
    $("#layout-choice").val(curLayout);
    $("#lesson-choice").val(curLesson);
    refresh(curLayout, curLesson);
  });
  $("#query").focus();
});

function refresh(layout, lesson){
  loadKeyboard(layout);
  if(curLesson == "11"){
    $(".info-key").html("<img src='/images/about/all.png'>");
  }
  else{
    loadLesson(parseInt(lesson));
    $(".info-key").html("<img src='/images/about/lesson_"+lesson+".png'>");
  }
  saveChanges();
}

function loadLesson(lesson){
  $(".key").addClass("faded");
  $([0,1,2,3,4,5,6,7]).each(function(I, lessonLayer){
    if(lesson >= I){
      $(lessons[I].split("")).each(function(i, k){
        $("span:contains('"+k+"')").parent().removeClass("faded");
        if(lesson > I){
          $("span:contains('"+k+"')").parent().addClass("some-faded");
        }
      });
    }
  });
}

function loadKeyboard(keyboard){
  layer = "";
  $(".keyboard-base").html("<div class='keyboard' id='"+keyboard+"'>");

  shifted = 0;
  $(layouts[keyboard]).each(function(layer, value){
    shifted++;
    nextLayer = keyboard+"-"+layer;
    $("#"+keyboard).append("<div class='keyboardRow' id='"+nextLayer+"'>");
    if ((shifted % 2) == 1){
      $("#"+keyboard).append("<div class='keyboardRow shifted' id='"+nextLayer+"'>");
    }
    else{
      $("#"+keyboard).append("<div class='keyboardRow' id='"+nextLayer+"'>");
    }
    $(value.split("")).each(function(i, k){
      keyInfo = "<div class='key' id='"+k+"'>";
      if(typeof key_info[k] != 'undefined' && typeof key_info[k]["image"] != 'undefined'){
        keyInfo += "<img src='"+key_info[k]["image"]+"'>";
      }
      keyInfo += "<span class='key-value'>"+k+"</span>";
      keyInfo += "</div>";
      $("#"+nextLayer).append(keyInfo);
    });
  });
  $(".keyboard").append("</div>");
  infoblocks();
}

function infoblocks(){
  $(".key").on("click", function(event, key){
    loadInfo($(this).find("span")[0].innerHTML, event.shiftKey);
  });

  $(document).on('keyup', function(event, key) {
    console.log(event);
    // console.log(event.key);
    if(event.key == "Enter"){
      map_query = $("#query")[0].value;
      console.log(map_query);
      $("#query")[0].value = "";
      $("#query")[0].placeholder = map_query;
      // $(".info-key").html("<span>"+map_query+"</span><br>");
      if(event.shiftKey){
        mapChange(map_query);
      }else{
        mapSearch(map_query);
      }
    }
    else if(event.key != "Shift"){
      loadInfo(event.key, event.shiftKey);
    }
  });
}

// Map lookup
function mapSearch(map_query){
  console.log("mapSearch");
  console.log("map_query: "+map_query);

  info = "";
  $(".info-key").html("");
  map_split = map_query.split('');
  map_mode  = $("#map-mode-choice").find(":selected").val();
  mode_name = $("#map-mode-choice").find(":selected").html();
  my_sorted_maps = "undefined"
  if(map_query == ""){
    console.log("mapSearch EMPTY");
    map_split = map_query.split('');
    $(".info-key").append('<b>'+mode_name+": "+'</b>');
    $.each( map_mode.split(''), function( i, mode) {
      $(".info-key").append('<b>'+mode+" maps: "+'</b>');
      $.each( maps[mode], function( key, value ) {
        $(".info-key").append('<pre>'+key + ": " + value+'</pre>');
      });
    });
    // $(".info-key").append('<b>'+mode_name+" maps: "+'</b>');
    // $.each( maps[map_mode], function( key, value ) {
    //   $(".info-key").append('<pre>'+key + ": " + value+'</pre>');
    // });
  }else{
    if(map_mode == "nvo"){
      my_sorted_maps  = "n maps: "+maps["n"][map_query]
      my_sorted_maps += "<br>v maps: "+maps["v"][map_query]
      my_sorted_maps += "<br>o maps: "+maps["o"][map_query]
    }else{
      my_sorted_maps = maps[map_mode][map_query]
    }
    for (i=0; i<map_split.length; i++){
      loadImage(map_split[i]);
    }
    $(".info-key").append(info);
    chrome.storage.sync.get(map_query, function(data) {
      if (typeof(data[map_query]) != "undefined"){
        $(".info-key").append('<pre>'+data[map_query]+'</pre>');
      }else if(my_sorted_maps != "undefined"){
        $(".info-key").append('<pre>'+my_sorted_maps+'</pre>');
      }else{
        $(".info-key").append("<br>No map found, use Shift + Enter to create.");
      }
    });
  }
}

// Load map into editable window
function mapChange(map_query){
  map_split = map_query.split('');
  map_mode  = $("#map-mode-choice").find(":selected").val();
  $(document).unbind("keyup");
  $( ".key").unbind("click");
  $(".info-key").append("<textarea id='update-map' rows='6' cols='50'>");
  $(".info-key").append("<br><button id='save-map'   type='button'>Save</button>");
  $(".info-key").append("<button id='cancel-map' type='button'>Cancel</button>");
  $(".info-key").append("<button id='delete-map' type='button'>Delete</button>");
  chrome.storage.sync.get(map_query, function(data) {
    if (typeof(data[map_query]) != "undefined"){
      $("#update-map").html(data[map_query]);
    }else{
      $("#update-map").attr("placeholder", "Type your map here");
    }
  });
  $("#save-map").on("click", function(){
    newMapValue = $("#update-map").val();
    chrome.storage.sync.set({[map_query]: newMapValue}, function() {
      $(".info-key").html(map_query+" saved to:<br>"+newMapValue);
      console.log("Saved");
    });
    infoblocks();
  });
  $("#cancel-map").on("click", function(){
    $(".info-key").html("Canceled");
    infoblocks();
  });
  $("#delete-map").on("click", function(){
    chrome.storage.sync.remove([map_query], function() {
      $(".info-key").html("<span>"+map_query+"</span><br><span class='red'>DELETED</span>");
      console.log("Deleted map");
    });
    infoblocks();
  });

}

function loadInfo(key, shifted){
  console.log(key);
  info = "";
  if(shifted == true){
    key = key.toUpperCase();
  }
  if(typeof key_info[key] != 'undefined'){
    loadTitle(key);
    loadImage(key, true);
    loadText(key);
    loadHelp(key);
    $(".info-key").html(info);
  }else{
    $(".info-key").html("no Vim info yet");
    $(".info-key").append("<br><br>Contribute on: <a href='https://github.com/shadoath/vim-what' target='_blank'>GitHub</a>");
  }
  $(".link").on("click", function(){
    console.log("LINK"+this.innerHTML);
    loadInfo(this.innerHTML);
  });
}

function loadTitle(key){
    if(typeof key_info[key]["title"] != 'undefined'){
      console.log(key_info[key]["title"]);
      info = "<p>"+key_info[key]["title"]+"</p>";
    }
    else{
      info = key+"<br>";
    }
}

function loadText(key){
  var text  = key_info[key]["text"]
  var pipe  = new RegExp(/\|(.+?)\|/gi);
  var links = pipe.exec(text);
  if(links != null){
    links.shift();
    $(links).each(function(name, value){
      if(typeof key_info[value] != 'undefined'){
        var link = "<span class='link'>"+value+"</span>";
        text = text.replace(value, link);
      }
    })
  }
  info += text
}

function loadImage(key, append = false){
  if(typeof key_info[key] != 'undefined' && typeof key_info[key]["image"] != 'undefined'){
    info += "<img src='"+key_info[key]["image"]+"'>";
    if (append){
      info += "<br>"
    }
  }
}

function loadAction(key){
    if(typeof key_info[key]["action"] != 'undefined'){
      console.log(key_info[key]["action"]);
      var link = "";
      info += "<br>";
      switch(key_info[key]["action"]) {
        case "motion":
          link = "http://vimhelp.appspot.com/motion.txt.html#motion.txt";
          break;
        case "command":
          link = "http://vimhelp.appspot.com/map.txt.html#%3Acommand";
          break;
        case "operator":
          link = "http://vimhelp.appspot.com/motion.txt.html#operator";
          break;
        case "extra":
          link = "http://vimhelp.appspot.com";
        break;
      }
      info += "<a href='"+link+"' target='_blank'>Vim help</a>";
    }
    else{
      info += key+"<br>";
    }
}

function loadHelp(key){
    if(typeof key_info[key]["vimhelp"] != 'undefined'){
      var help = key_info[key]["vimhelp"];
      var link = "";
      console.log(help);
      info += "<br>";
      link = "http://vimhelp.appspot.com/"+help;
      info += "<a href='"+link+"' target='_blank'>Vim help</a>";
    }
}
function loadCombo(value) {
  console.log(value);
  //TODO load from mappings
}

function saveChanges() {
  chrome.storage.sync.set({'curLayout': curLayout, 'curLesson': curLesson}, function() {
    console.log("Saved layout/lesson");
  });
}
