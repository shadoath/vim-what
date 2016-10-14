// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}


  function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
  }
  function updateReaderLevel(statusText) {
    document.getElementById('read_status').textContent = statusText;
  }

function getcookie(c_name){
  var c_value = document.cookie;
  var c_start = c_value.indexOf(" " + c_name + "=");
  if(c_start == -1){
    c_start = c_value.indexOf(c_name + "=");
  }
  if(c_start == -1){
    c_value = null;
  }else{
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);
    if(c_end == -1){
      c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start, c_end));
    }
  return c_value;
}

function saveToStorage(data) {
  // Get a value saved in a form.
  // Check that there's some code there.
  if (!data) {
    renderStatus('Error: No data specified');
    updateReaderLevel('??');
    return;
  }
  getCurrentTabUrl(function(url){
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({url, data}, function() {
      // Notify that we saved.
      renderStatus(url + ' data saved');
      updateReaderLevel(data + '%');
    });
  });

}

function loadFromStorage(name) {
  // Get a value saved in a form.
  // Check that there's some code there.
  if (!name) {
    renderStatus('Error: No name specified');
    updateReaderLevel('Not found!');
    return;
  }
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.get(name, function(data) {
    // Notify that we saved.
    renderStatus('Loaded '+ name);
    console.log(JSON.stringify(data));
    updateReaderLevel(data[name] + '%');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url){
    loadListeners();
    // Put the image URL in Google search.
    console.log(url);
    renderStatus('You are at:' + url);
    loadFromStorage(url);

    // saveToStorage('100');
    // updateReaderLevel('100%');

  });
});

function loadListeners(){
  $("#saveReadLevel").unbind().click(function(){
    var reader_value = $('#reader_range')[0].value
    saveToStorage(reader_value);
  });

  $("#reader_range").unbind().change(function(){
    updateReaderLevel($('#reader_range')[0].value + '%');
  });
}
