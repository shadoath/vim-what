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
var layouts = {};
var key_info = {};

$(document).ready(function(){
  $.getJSON("/lib/key_info.json", function(json) {
    key_info = json;
  });
  $.getJSON("/lib/layouts.json", function(json) {
    layouts = json;
    loadJSON("colemack");
  });
  $("#layout-choice").on("change", function(){
    loadJSON($("#layout-choice").find(":selected").val());
  });
});

function loadJSON(keyboard){
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
      if(typeof key_info[k] != 'undefined' && typeof key_info[k]["image"] != 'undefined'){
        $("#"+nextLayer).append("<span class='key' data-key='"+k+"'><img src='"+key_info[k]["image"]+"'>"+k+"</span>");
      }else{
        $("#"+nextLayer).append("<span class='key' data-key=\""+k+"\">"+k+"</span>");
      }
    });
  });
  $(".keyboard").append("</div>");
  infoblocks();
}

function infoblocks(){
  $(".key").on("click", function(event, key){
    loadInfo(this.innerHTML, event.shiftKey);
  });

  $(document).on('keyup', function(event, key) {
    if(event['key'] != "Shift"){
      loadInfo(event['key'], event.shiftKey);
    }
  });
}

function loadInfo(key, shifted){
  if(shifted == true){
    key = key.toUpperCase();
  }
  $(".info-key").html(key);
  if(typeof key_info[key] != 'undefined'){
    $(".info-title").html(key_info[key]["title"]);
    $(".info-text").html(key_info[key]["text"]);
  }else{
    $(".info-title").html("no Vim info yet");
    $(".info-text").html("Contribute on: <a href='https://github.com/shadoath/vim-what' target='_blank'>GitHub</a>");
  }
}
