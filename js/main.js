document.addEventListener('DOMContentLoaded', () => {
  const countEls = document.querySelectorAll('[data_count]');

  const animateValue = (el) => {
    const raw = Number(el.dataset.count || el.textContent.replace(/[^\d.-]/g, ''));
    const isCompact = el.textContent.includes('k') || el.textContent.includes('K');
    const start = 0;
    const end = raw;
    const duration = 1200;
    const startTime = performance.now();

    const step = (t) => {
      const progress = Math.min((t - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (end - start) * eased);

      if (isCompact && end >= 1000) {
        el.textContent = `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`;
      } else {
        el.textContent = value.toLocaleString();
      }

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  countEls.forEach((el) => {
    el.dataset.count = el.dataset.count || el.textContent;
    observer.observe(el);
  });

  const pinButtons = document.querySelectorAll('.pin');
  const exItems = document.querySelectorAll('.ex_item');

  pinButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.pin;
      pinButtons.forEach((btn) => btn.classList.toggle('is_active', btn === button));
      exItems.forEach((item) => item.classList.toggle('is_active', item.dataset.item === target));
    });
  });

  const bhTabs = document.querySelectorAll('.bh_tab');
  const bhPanels = document.querySelectorAll('.bh_panel');
  const bhInk = document.getElementById('bh_ink');

  const moveInk = (tab) => {
    if (!bhInk) return;
    const tabs = Array.from(bhTabs);
    const idx = tabs.indexOf(tab);
    const offset = (tab.offsetWidth + 8) * idx + 6;
    bhInk.style.transform = `translateX(${offset}px)`;
  };

  bhTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.state;
      bhTabs.forEach((btn) => {
        const active = btn === tab;
        btn.classList.toggle('is_active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      bhPanels.forEach((panel) => panel.classList.toggle('is_active', panel.dataset.panel === target));
      moveInk(tab);
    });
  });

  if (bhTabs.length) moveInk(bhTabs[0]);

  const fill = document.getElementById('day_fill');
  if (fill) {
    const line = document.getElementById('day_line');
    if (line) {
      const observer2 = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fill.style.width = '100%';
            observer2.disconnect();
          }
        });
      }, { threshold: 0.35 });
      observer2.observe(line);
    }
  }

  const headBar = document.getElementById('head_bar');
  if (headBar) {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      headBar.style.width = `${Math.min(progress * 100, 100)}%`;
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
});
