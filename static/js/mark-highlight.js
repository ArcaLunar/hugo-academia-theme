document.addEventListener('DOMContentLoaded', () => {
  // Fallback to wrap ==text== with <mark> when Goldmark mark is not active
  document.querySelectorAll('.markdown-body').forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const toWrap = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.nodeValue || !node.nodeValue.includes('==')) continue;
      // skip inside code/pre
      let p = node.parentNode;
      let skip = false;
      while (p && p !== root) {
        const tag = p.nodeName.toLowerCase();
        if (tag === 'code' || tag === 'pre' || tag === 'script' || tag === 'style') { skip = true; break; }
        p = p.parentNode;
      }
      if (skip) continue;
      const parts = node.nodeValue.split(/(==[^=]+==)/g);
      if (parts.length > 1) {
        toWrap.push({ node, parts });
      }
    }
    toWrap.forEach(({ node, parts }) => {
      const frag = document.createDocumentFragment();
      parts.forEach(part => {
        const m = part.match(/^==(.+)==$/s);
        if (m) {
          const mark = document.createElement('mark');
          mark.textContent = m[1];
          frag.appendChild(mark);
        } else if (part.length) {
          frag.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
  });
});
