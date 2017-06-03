// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 *
 */
var layouts   = {};
var curLayout = "colemack";
var lessons   = {};
var curLesson = "0";
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
    loadKeyboard(curLayout);
  });
  $("#layout-choice").on("change", function(){
    curLayout = $("#layout-choice").find(":selected").val();
    startup(curLayout, curLesson)
  });
  $("#lesson-choice").on("change", function(){
    curLesson = $("#lesson-choice").find(":selected").val();
    startup(curLayout, curLesson)
  });
});

function startup(layout, lesson){
  loadKeyboard(layout);
  if(curLesson == "11"){
    $(".info-key").html("<img src='/images/about/all.png'>");
  }
  else{
    loadLesson(lesson);
    $(".info-key").html("<img src='/images/about/lesson_"+lesson+".png'>");
  }

}

function loadLesson(lesson){
  console.log(lesson);
  $(".key").addClass("faded");
  $(lessons[lesson].split("")).each(function(i, k){
    keySpan    = "<span class='key-value'>"+k+"</span>";
    lessonSpan = $( "div:contains('"+keySpan+"')" );
    console.log(keySpan);
    console.log(lessonSpan);
    $("span:contains('"+k+"')").parent().removeClass("faded")
  })
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
    if(event['key'] != "Shift"){
      loadInfo(event['key'], event.shiftKey);
    }
  });
}

function loadInfo(key, shifted){
  console.log("loadInfo: "+key);
  if(shifted == true){
    key = key.toUpperCase();
  }
  if(typeof key_info[key] != 'undefined'){
    $(".info-key").html(key_info[key]["text"]);
    if(typeof key_info[key]["image"] != 'undefined'){
      $(".info-key").append("<img src='"+key_info[key]["image"]+"'>");
    }else{
      $(".info-key").append(key);
    }
  }else{
    $(".info-key").html("no Vim info yet");
    $(".info-key").append("Contribute on: <a href='https://github.com/shadoath/vim-what' target='_blank'>GitHub</a>");
  }
}
