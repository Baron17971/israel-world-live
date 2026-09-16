(function () {
  'use strict';

  var from = 'חינוך ו־STEM';
  var to = 'חינוך ולימודי STEM';

  function fixText(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.indexOf(from) >= 0) {
        node.nodeValue = node.nodeValue.split(from).join(to);
      }
    }
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 3) {
          if (node.nodeValue && node.nodeValue.indexOf(from) >= 0) node.nodeValue = node.nodeValue.split(from).join(to);
        } else if (node.nodeType === 1) {
          fixText(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  fixText(document.body);
})();
