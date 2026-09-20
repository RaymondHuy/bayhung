/* Progressive enhancement only. All page content and links are in generated HTML. */
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const menuButton = $('[data-menu-toggle]');
  const menu = $('#primary-nav');
  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Mở menu');
    menu?.classList.remove('is-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    menu?.classList.toggle('is-open', open);
  });
  menu?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  matchMedia('(min-width: 768px)').addEventListener('change', closeMenu);
  const themeButton = $('[data-theme-toggle]');
  const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const updateThemeLabel = () => themeButton?.setAttribute('aria-label', isDark() ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
  updateThemeLabel();
  themeButton?.addEventListener('click', () => {
    const theme = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('bay-hung-theme', theme); } catch { /* Storage may be disabled; theme still works for this page. */ }
    updateThemeLabel();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeLabel);

  const products = $$('[data-product]');
  const search = $('#product-search');
  const filters = $$('[data-filter]');
  const normalize = s => s.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
  let activeFilter = 'all';
  function updateProducts() {
    const query = normalize(search?.value || '');
    let total = 0;
    for (const card of products) {
      const visible = (activeFilter === 'all' || card.dataset.category === activeFilter) && normalize(card.dataset.search).includes(query);
      card.hidden = !visible;
      if (visible) total++;
    }
    const count = $('#product-count');
    if (count) count.textContent = `${total} nhóm trái cây`;
    const empty = $('#empty-products');
    if (empty) empty.hidden = total !== 0;
  }
  for (const button of filters) button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    for (const other of filters) other.setAttribute('aria-pressed', String(other === button));
    updateProducts();
  });
  search?.addEventListener('input', updateProducts);
  $('#reset-products')?.addEventListener('click', () => {
    activeFilter = 'all';
    if (search) search.value = '';
    for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.filter === 'all'));
    updateProducts();
    search?.focus();
  });
  if (search) $('[data-enhanced].catalog-tools').hidden = false;

  const quoteForm = $('#quote-form');
  if (quoteForm) {
    quoteForm.closest('[data-enhanced]').hidden = false;
    const requested = new URLSearchParams(location.search).get('san-pham');
    const select = quoteForm.elements.product;
    if (requested && [...select.options].some(option => option.value === requested)) select.value = requested;
    for (const name of ['quantity', 'location']) {
      quoteForm.elements[name].addEventListener('input', () => quoteForm.elements[name].setCustomValidity(''));
    }
    quoteForm.addEventListener('submit', event => {
      event.preventDefault();
      for (const name of ['quantity', 'location']) {
        const input = quoteForm.elements[name];
        input.setCustomValidity(input.value.trim() ? '' : 'Vui lòng nhập thông tin này.');
      }
      if (!quoteForm.reportValidity()) return;
      const fields = new FormData(quoteForm);
      const product = select.selectedOptions[0].textContent;
      const note = String(fields.get('note') || '').trim();
      const message = `Chào Bảy Hưng, mình muốn hỏi giá sỉ:\n\n- Trái cây: ${product}\n- Số lượng dự kiến: ${String(fields.get('quantity')).trim()}\n- Khu vực nhận: ${String(fields.get('location')).trim()}${note ? `\n- Ghi chú: ${note}` : ''}\n\nNhờ Bảy Hưng tư vấn giống, xuất xứ, quy cách và báo giá theo lô. Cảm ơn!`;
      $('#quote-message').value = message;
      $('#quote-result').hidden = false;
      $('#copy-status').textContent = 'Tin nhắn chưa được gửi. Bạn có thể sao chép để gửi qua kênh liên hệ.';
      $('#copy-quote').focus({ preventScroll: true });
      $('#quote-result').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
    });
    $('#copy-quote')?.addEventListener('click', async () => {
      const message = $('#quote-message');
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(message.value);
        $('#copy-status').textContent = 'Đã sao chép. Mở ứng dụng liên hệ và dán tin nhắn để gửi.';
      } catch {
        message.focus(); message.select();
        $('#copy-status').textContent = 'Trình duyệt chưa cho phép sao chép tự động. Nội dung đã được chọn; hãy sao chép thủ công.';
      }
    });
  }
})();
