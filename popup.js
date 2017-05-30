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
var layouts = {
  "qwerty": [
    "!@#$%^&*()-=",
    "qwertyuiop[]\\",
    "asdfghjkl;'",
    "zxcvbnm,./"
  ],

  "colemack": [
    "!@#$%^&*()=",
    "qwfpg[]jluy;-",
    "arstd/\\hneeio'",
    "zxcvb-=km,.",
  ]
};
var key_info = {
  "a": {
    "title": "lowercase",
    "text": "insert after cursor<br>{command} around {selector}<br>ctrl-a: ++"
  },
  "A": {
    "title": "UPPERCASE",
    "text": "append at end of line"
  },
  "@": {
    "title": "Register",
    "text": "<br>:let @q='_ctrl-r_ctrl-r_q (paste @q)<br>*modify*<br>' (closing quote) & _enter_"
  }
}
$(document).ready(function(){
  loadJSON("colemack");
  $("#layout-choice").on("change", function(){
    loadJSON($("#layout-choice").find(":selected").val());
  });
});

function loadJSON(keyboard){
  layer = "";
  $(".keyboard-base").html("<div class='keyboard' id='"+keyboard+"'>");

  $(layouts[keyboard]).each(function(layer, value){
    nextLayer = keyboard+"-"+layer;
    $("#"+keyboard).append("<div class='keyboardRow' id='"+nextLayer+"'>");
    currentLayer ="<div class='"+nextLayer+"'>";
    $(value.split("")).each(function(i, k){
      $("#"+nextLayer).append("<span class='key'>"+k+"</span>");
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
    loadInfo(event['key'], event.shiftKey);
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
