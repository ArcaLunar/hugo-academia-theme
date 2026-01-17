document.addEventListener('DOMContentLoaded', () => {
  const config = {
    collapse: window.siteConfig?.code?.collapse ?? true,
    collapsedByDefault: window.siteConfig?.code?.collapsedByDefault ?? true,
    summaryText: window.siteConfig?.code?.summaryText ?? 'Code'
  };

  if (!config.collapse) return;

  document.querySelectorAll('.markdown-body pre code').forEach((codeEl) => {
    const preEl = codeEl.closest('pre');
    if (!preEl) return;

    if (preEl.closest('.code-block')) return;

    const codeContent = codeEl.textContent || '';
    const lines = codeContent.split('\n').filter(line => line.trim().length > 0);

    if (lines.length <= 1 && codeContent.trim().length < 100) {
      return;
    }

    const details = document.createElement('details');
    details.className = 'code-block';
    if (!config.collapsedByDefault) {
      details.setAttribute('open', '');
    }

    const summary = document.createElement('summary');
    summary.textContent = config.summaryText;
    details.appendChild(summary);

    preEl.parentNode.insertBefore(details, preEl);
    preEl.parentNode.removeChild(preEl);
    details.appendChild(preEl);
  });
});
