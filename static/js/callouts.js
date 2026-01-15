document.addEventListener('DOMContentLoaded', () => {
  const typeMap = {
    note: 'Note', info: 'Info', tip: 'Tip', success: 'Success', question: 'Question',
    warning: 'Warning', caution: 'Caution', danger: 'Danger', bug: 'Bug', example: 'Example',
    quote: 'Quote'
  };
  const icons = {
    note: 'fa-regular fa-note-sticky',
    info: 'fa-solid fa-circle-info',
    tip: 'fa-regular fa-lightbulb',
    success: 'fa-regular fa-circle-check',
    question: 'fa-regular fa-circle-question',
    warning: 'fa-solid fa-triangle-exclamation',
    caution: 'fa-solid fa-triangle-exclamation',
    danger: 'fa-solid fa-circle-xmark',
    bug: 'fa-solid fa-bug',
    example: 'fa-regular fa-circle-dot',
    quote: 'fa-solid fa-quote-left'
  };
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);

  document.querySelectorAll('.markdown-body blockquote').forEach((bq) => {
    if (bq.classList.contains('callout')) return;
    const html = bq.innerHTML.trim();
    const re = /^\s*<p>\s*\[!([A-Za-z]+)\]\s*([+-])?\s*([\s\S]*?)<\/p>\s*/i;
    const m = html.match(re);
    if (!m) return;
    const type = m[1].toLowerCase();
    const sign = m[2] || '';
    let firstRest = (m[3] || '').trim();
    let titleText = firstRest || typeMap[type] || cap(type);
    let firstBody = '';
    if (firstRest.includes('\n')) {
      const parts = firstRest.split(/\r?\n/);
      titleText = parts.shift().trim() || typeMap[type] || cap(type);
      firstBody = parts.join('\n').trim();
    }
    const cls = typeMap[type] ? type : 'note';
    const collapsible = sign === '-' || sign === '+';
    const collapsed = collapsible && sign === '-';

    let bodyHTML = html.replace(re, '').trim();
    if (firstBody) {
      bodyHTML = `<p>${firstBody}</p>` + (bodyHTML ? bodyHTML : '');
    }

    const wrapper = document.createElement('div');
    wrapper.className = `callout callout-${cls}`;
    if (collapsed) wrapper.classList.add('is-collapsed');

    const header = document.createElement('div');
    header.className = 'callout-title';

    let toggle;
    if (collapsible) {
      toggle = document.createElement('span');
      toggle.className = 'callout-toggle';
      const chevron = document.createElement('i');
      chevron.className = collapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-down';
      toggle.appendChild(chevron);
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('tabindex', '0');
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      toggle.addEventListener('click', () => {
        const isCollapsed = wrapper.classList.toggle('is-collapsed');
        content.style.display = isCollapsed ? 'none' : '';
        chevron.className = isCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-down';
        toggle.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
      });
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
      });
    }

    const iconSpan = document.createElement('span');
    iconSpan.className = 'callout-icon';
    const i = document.createElement('i');
    i.className = icons[cls] || 'fa-regular fa-message';
    iconSpan.appendChild(i);
    const titleSpan = document.createElement('span');
    titleSpan.className = 'callout-title-text';
    titleSpan.textContent = titleText;

    header.appendChild(iconSpan);
    if (collapsible && toggle) header.appendChild(toggle);
    header.appendChild(titleSpan);

    const content = document.createElement('div');
    content.className = 'callout-content';
    content.innerHTML = bodyHTML || '<p></p>';
    if (collapsible) {
      content.style.display = collapsed ? 'none' : '';
    }

    wrapper.appendChild(header);
    wrapper.appendChild(content);
    bq.replaceWith(wrapper);
  });
});
