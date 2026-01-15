// Handles vault tree expansion with sibling collapse
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const tree = document.querySelector('.vault-tree-shell');
    if (!tree) return;

    const activeLis = tree.querySelectorAll('li.active, li.ancestor');
    const expand = (li) => li.classList.add('expanded');
    const collapseSiblings = (li) => {
      const parent = li.parentElement;
      if (!parent) return;
      Array.from(parent.children).forEach(sib => {
        if (sib !== li) sib.classList.remove('expanded');
      });
    };

    // Expand active branch on load
    activeLis.forEach(li => {
      expand(li);
      let p = li.parentElement?.closest('li');
      while (p) {
        expand(p);
        p = p.parentElement?.closest('li');
      }
    });

    tree.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const li = link.closest('li');
      if (!li) return;

      // Collapse siblings at this depth, expand current
      collapseSiblings(li);
      expand(li);
      let p = li.parentElement?.closest('li');
      while (p) {
        expand(p);
        collapseSiblings(p);
        p = p.parentElement?.closest('li');
      }
    });
  });
})();
