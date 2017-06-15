/**
 * Vim What?
 * Learn vim with style
 */
var layouts   = {};
var lessons   = {};
var curLayout = "colemack";
var curLesson = "11";
var key_info  = {};

$(document).ready(function(){
  $.getJSON("/lib/key_info_symbols.json", function(json) {
    $.extend(key_info, json);
  });
  $.getJSON("/lib/key_info_numbers.json", function(json) {
    $.extend(key_info, json);
  });
  $.getJSON("/lib/key_info_letters.json", function(json) {
    $.extend(key_info, json);
  });
  $.getJSON("/lib/lessons.json", function(json) {
    lessons = json;
  });
  $.getJSON("/lib/layouts.json", function(json) {
    layouts = json;
  });
  $("#layout-choice").on("change", function(){
    curLayout = $("#layout-choice").find(":selected").val();
    refresh(curLayout, curLesson)
  });
  $("#lesson-choice").on("change", function(){
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
      map = map_query.split('');
      $("#query")[0].value = "";
      $("#query")[0].placeholder = map_query;
      $(".info-key").html(map_query+"<br>");
      if(event.shiftKey){
        //Load map into editable window
        console.log("Shift ENTER");
        $(".info-key").append("<textarea id='update-map' rows='6' cols='50'>");
        $(".info-key").append("<br><input type='submit'>");
        $("#update-map").html("VALUE OF MAP HERE");

      }else{
        //Load Map
        for (i=0; i<map.length; i++){
          loadImage(map[i], true);
        }

      }
    }
    else if(event.key != "Shift"){
      loadInfo(event.key, event.shiftKey);
    }
  });
}

function loadInfo(key, shifted){
  console.log(key);
  if(shifted == true){
    key = key.toUpperCase();
  }
  if(typeof key_info[key] != 'undefined'){
    loadImage(key);
    $(".info-key").append(key_info[key]["text"]);
  }else{
    $(".info-key").html("no Vim info yet");
    $(".info-key").append("Contribute on: <a href='https://github.com/shadoath/vim-what' target='_blank'>GitHub</a>");
  }
}

function loadImage(key, append = false){
  info = "";
  if(typeof key_info[key] != 'undefined' && typeof key_info[key]["image"] != 'undefined'){
    info = "<img src='"+key_info[key]["image"]+"'><br>";
  }else{
    info = key+"<br>";
  }
  if(append){
    $(".info-key").append(info.slice(0,-4));
  }else{
    $(".info-key").html(info);
  }
}

function loadCombo(value) {
  console.log(value);
  //TODO load from mappings
}

function saveChanges() {
  chrome.storage.sync.set({'curLayout': curLayout, 'curLesson': curLesson}, function() {
    console.log("Saved");
  });
}
