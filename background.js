"use strict";

var connection = null;

chrome.runtime.onInstalled.addListener(function () {

  connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:5000/chatHub").configureLogging(signalR.LogLevel.Information).withAutomaticReconnect().build();

  
  connection.on("ReceiveMessage", function (user, message) {
  
    //chrome.extension.getBackgroundPage().alert(message);
  });
  
  connection.start().then(function () {
    chrome.extension.getBackgroundPage().alert(connection.state);

  }).catch(function (err) {
      return console.error(err.toString());
  });

});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  const url = changeInfo.pendingUrl || changeInfo.url;
  if (!url || !url.startsWith("http")) {
    return;
  }

  const hostname = new URL(url).href;
  //chrome.extension.getBackgroundPage().alert(changeInfo.url);
  connection.invoke("SendMessage", "PC da Dany", url).catch(function (err) {
    return console.error(err.toString());
  });

  chrome.storage.local.get(["blocked", "enabled"], function (local) {
    const { blocked, enabled } = local;
    if (Array.isArray(blocked) && enabled && blocked.find(domain => hostname.includes(domain))) {
      chrome.tabs.remove(tabId);
    }
  });
});



// chrome.runtime.onInstalled.addListener(function () {
//     chrome.storage.local.get(["blocked", "enabled"], function (local) {
//       if (!Array.isArray(local.blocked)) {
//         chrome.storage.local.set({ blocked: [] });
//       }
  
//       if (typeof local.enabled !== "boolean") {
//         chrome.storage.local.set({ enabled: false });
//       }
//     });
//   });
  
//   chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
//     const url = changeInfo.pendingUrl || changeInfo.url;
//     if (!url || !url.startsWith("http")) {
//       return;
//     }
  
//     const hostname = new URL(url).href;
//     //chrome.extension.getBackgroundPage().alert(changeInfo.url);
  

//     chrome.storage.local.get(["blocked", "enabled"], function (local) {
//       const { blocked, enabled } = local;
//       if (Array.isArray(blocked) && enabled && blocked.find(domain => hostname.includes(domain))) {
//         chrome.tabs.remove(tabId);
//       }
//     });
//   });