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
    "text": "after/around/ctrl-a ++/"
  },
  "@": {
    "title": "Register",
    "text": "<br>:let @q='_ctrl-r_ctrl-r_q (paste @q)<br>*modify*<br>' (closing quote) & _enter_"
  }
}
$(document).ready(function(){

  loadJSON("colemack");
});

function loadJSON(keyboard){
  $(".keyboard-base").html("");
  currentKeyboard= ""
  layer = "";

  currentKeyboard ="<div class='keyboard' id='"+keyboard+"'>";
  console.log(":"+layer);
  $(".keyboard-base").append(currentKeyboard);
  $(layouts[keyboard]).each(function(layer, value){


    console.log("Layer:"+layer);
    nextLayer = keyboard+"-"+layer;
    $("#"+keyboard).append("<div class='keyboardRow' id='"+nextLayer+"'>");

    currentLayer ="<div class='"+nextLayer+"'>";
    console.log("keyboard:    "+currentKeyboard);
    console.log("currentLayer:"+currentLayer);

    // $("."+nextLayer).append(nextLayer);

    $(value.split("")).each(function(i, k){
      // console.log("Key:"+k);
      // console.log("Key:"+currentLayer);
      $("#"+nextLayer).append("<span class='key'>"+k+"</span>");
    });
  });
  $(".keyboard").append("</div>");
  infoblocks();
}
function infoblocks(){

  $(".key").on("click", function(event, key){
    if (event.shiftKey){
      loadInfo(this.innerHTML, true);
    }else{
      loadInfo(this.innerHTML, false);
    }
  });

  $("#layout-choice").on("change", function(){
    loadJSON($("#layout-choice").find(":selected").val());
  });

}
function loadInfo(key, shifted){
  console.log(key);
  console.log("shift? "+shifted);
  $(".info-key").html("");
  $(".info-title").html("");
  $(".info-text").html("");
  $(".info-key").append(key);
  $(".info-title").append(key_info[key]["title"]);
  $(".info-text").append(key_info[key]["text"]);
}

