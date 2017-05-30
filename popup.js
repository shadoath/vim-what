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
      "zxcvb-=km,."
    ]
  };
var key_info = {
  "a": "after/around/ctrl-a ++/",
  "b": ""
}
$(document).ready(function(){

  loadJSON("colemack");
});

function loadJSON(keyboard){
  $(".all").html("");
  currentKeyboard= ""
  layer = "";

  currentKeyboard ="<div class='keyboard' id='"+keyboard+"'>";
  console.log(":"+layer);
  $(".all").append(currentKeyboard);
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
  $(".info").html("");
  $(".info").append(key+"<br>");
  $(".info").append(key_info[key]);
}

