gsap.registerPlugin(ScrollTrigger, CustomEase, ScrollToPlugin);

CustomEase.create('cin', 'M0,0 C0.16,1 0.3,1 1,1');
CustomEase.create('expo', 'M0,0 C0.05,0.1 0.2,1 1,1');


class SmoothScroll {
  constructor() {
    this.target = window.scrollY;
    this.current = window.scrollY;
    this.ease = 0.09;

    this._onScroll();
    this._proxy();
    this._raf();
  }

  _onScroll() {
    window.addEventListener(
      "scroll",
      () => {
        this.target = window.scrollY;
      },
      { passive: true }
    );
  }

  _proxy() {
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop: (value) => {
        if (value !== undefined) {
          window.scrollTo(0, value);
        }
        return window.scrollY;
      },

      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
    });

    ScrollTrigger.addEventListener("refresh", () => {
      this.current = window.scrollY;
      this.target = window.scrollY;
    });
  }

  _raf() {
    const tick = () => {
      this.current += (this.target - this.current) * this.ease;

      if (Math.abs(this.target - this.current) < 0.05) {
        this.current = this.target;
      }

      ScrollTrigger.update();

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}


function initPreloader() {
  const tl = gsap.timeline({
    onComplete() {
      document.body.classList.remove('is-loading');
      initHero();

      if (window.matchMedia('(pointer:fine)').matches) {
        new SmoothScroll();
      }
    }
  });

  tl.to('.pre-fill', { width: '100%', duration: 1.8, ease: 'power2.inOut' });

  tl.to('.pre-logo span', {
    translateY: '0%',
    stagger: 0.07,
    duration: 0.85,
    ease: 'cin'
  }, 0.3);

  tl.to('.pre-tag', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4');

  tl.to({}, { duration: 0.45 });

  tl.to('.pre-inner', {
    opacity: 0,
    scale: 0.96,
    duration: 0.4,
    ease: 'power2.in'
  });

  tl.to('.pre-curtain--top', {
    scaleY: 0,
    duration: 0.85,
    ease: 'power4.inOut'
  }, '-=0.2');

  tl.to('.pre-curtain--bot', {
    scaleY: 0,
    duration: 0.85,
    ease: 'power4.inOut'
  }, '<');

  tl.to('#preloader', {
    autoAlpha: 0,
    duration: 0.25,
    onComplete() {
      document.getElementById('preloader').style.display = 'none';
    }
  }, '-=0.1');
}


function initHero() {
  const tl = gsap.timeline({ delay: 0.08 });

  tl.to('.nav-logo', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'expo'
  });

  tl.to('#heroLogo', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'expo'
  }, '-=0.5');

  tl.to('#heroEye', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out'
  }, '-=0.6');

  tl.to('.hl', {
    translateY: '0%',
    stagger: 0.1,
    duration: 1.2,
    ease: 'cin'
  }, '-=0.5');

  tl.to('#heroSub', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6');

  tl.to('#heroCtas', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.55');

  tl.to('#camWrap', {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.2,
    ease: 'expo'
  }, '-=0.8');

  tl.to('#heroScroll', {
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  }, '-=0.4');

  gsap.to('#camWrap', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });
}


function initNav() {
  const nav = document.getElementById('nav');

  ScrollTrigger.create({
    start: 80,
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled')
  });

  // FIXED SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      const target = document.querySelector(link.getAttribute('href'));

      if (!target) return;

      gsap.to(window, {
        duration: 1.4,
        scrollTo: {
          y: target,
          offsetY: 0
        },
        ease: 'power3.inOut'
      });
    });
  });

  const hbg = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  let open = false;

  hbg.addEventListener('click', () => {
    open = !open;

    if (open) {
      links.style.cssText = `
        display:flex;
        flex-direction:column;
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100vh;
        background:rgba(0,0,0,.97);
        align-items:center;
        justify-content:center;
        gap:36px;
        z-index:190;
      `;

      gsap.fromTo(
        links,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      gsap.fromTo(
        links.querySelectorAll('.nl'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.5,
          ease: 'expo'
        }
      );
    } else {
      gsap.to(links, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          links.style.cssText = '';
        }
      });
    }

    const spans = hbg.querySelectorAll('span');

    gsap.to(spans[0], {
      rotation: open ? 45 : 0,
      y: open ? 6 : 0,
      duration: 0.3
    });

    gsap.to(spans[1], {
      rotation: open ? -45 : 0,
      y: open ? -6 : 0,
      duration: 0.3
    });
  });

  links.querySelectorAll('.nl').forEach(l => {
    l.addEventListener('click', () => {
      open = false;

      gsap.to(links, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          links.style.cssText = '';
        }
      });

      const spans = hbg.querySelectorAll('span');

      gsap.to(spans[0], {
        rotation: 0,
        y: 0,
        duration: 0.3
      });

      gsap.to(spans[1], {
        rotation: 0,
        y: 0,
        duration: 0.3
      });
    });
  });
}

function initCursor() {
  const dot = document.querySelector('.cur-dot');
  const ring = document.querySelector('.cur-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.05, ease: 'none' });
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    gsap.set(ring, { x: rx, y: ry });
  });

  // Hover states
  document.querySelectorAll('a, button, .sc, .citem, .car-btn, .vid-play').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cm'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cm'));
  });

  document.addEventListener('mouseleave', () =>
    gsap.to([dot, ring], { opacity: 0, duration: 0.3 }));
  document.addEventListener('mouseenter', () =>
    gsap.to([dot, ring], { opacity: 1, duration: 0.3 }));
}


function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(btn, { x: dx * 0.36, y: dy * 0.36, duration: 0.5, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

function initReveals() {

  // .rup elements — fade + slide up
  gsap.utils.toArray('.rup').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });


  gsap.utils.toArray('.reveal-lines').forEach(el => {
    const rawHTML = el.innerHTML;
    const parts = rawHTML.split('<br>');
    el.innerHTML = parts.map(p =>
      `<span style="display:block;overflow:hidden">` +
      `<span class="rl-inner" style="display:block;transform:translateY(108%)">${p}</span>` +
      `</span>`
    ).join('');

    gsap.to(el.querySelectorAll('.rl-inner'), {
      translateY: '0%', stagger: 0.1, duration: 1.2, ease: 'cin',
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' }
    });
  });

  gsap.utils.toArray('.reveal-img').forEach(el => {
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power4.inOut',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
    });
  });

  gsap.utils.toArray('.sc').forEach((card, i) => {
    gsap.to(card, {
      clipPath: 'inset(0 0 0% 0)', duration: 1.0, ease: 'power4.inOut',
      scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
      delay: (i % 3) * 0.1
    });
  });

  gsap.utils.toArray('.pillar').forEach((p, i) => {
    gsap.to(p, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: p, start: 'top 86%', toggleActions: 'play none none none' },
      delay: i * 0.12
    });
  });


}


function initCounters() {
  document.querySelectorAll('.a-stat-n').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter() {
        gsap.to(obj, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val); }
        });
      }
    });
  });
}

/*  The video carousel styling */
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prev = document.getElementById('carPrev');
  const next = document.getElementById('carNext');
  const dotsWrap = document.getElementById('carDots');
  if (!track) return;

  const items = track.querySelectorAll('.citem');
  const total = items.length;
  let current = 0;

  items.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'car-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.style.cursor = 'none';
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function getItemWidth() {
    return items[0].offsetWidth + 24; // + gap
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.car-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    const offset = getItemWidth() * current;
    gsap.to(track, { x: -offset, duration: 0.72, ease: 'expo' });
    updateDots();
    prev.disabled = current === 0;
    next.disabled = current === total - 1;
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  prev.disabled = true;

  let startX = 0, isDragging = false, startScroll = 0;

  track.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    track.style.cursor = 'grabbing';
  });
  document.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = '';
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 60) {
      diff < 0 ? goTo(current + 1) : goTo(current - 1);
    }
  });

  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 60) diff < 0 ? goTo(current + 1) : goTo(current - 1);
  });

  // Play video on hover
  items.forEach(item => {
    const vid = item.querySelector('video');
    if (!vid) return;
    item.addEventListener('mouseenter', () => vid.play());
    item.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
  });

  // Reveal on scroll
  gsap.from(items, {
    opacity: 0, y: 50, stagger: 0.1, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#work', start: 'top 80%', toggleActions: 'play none none none' }
  });
}

/*The video toggle in about*/
function initVideoToggle() {
  const btn = document.getElementById('vidToggle');
  const icon = document.getElementById('vidIcon');
  const vid = btn && btn.closest('.vid-frame') && btn.closest('.vid-frame').querySelector('video');
  if (!btn || !vid) return;

  // let playing = !vid.paused;

  btn.addEventListener('click', () => {
    if (vid.paused) {
      vid.play();
      icon.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="white"/><rect x="14" y="4" width="4" height="16" fill="white"/>';
    } else {
      vid.pause();
      icon.innerHTML = '<path d="M8 5v14l11-7z" fill="white"/>';
    }
  });
}

/* Pause the marquee scrolling when i hover */
function initMarquee() {
  const m = document.querySelector('.marquee');
  const t = document.querySelector('.mtrack');
  if (!m || !t) return;
  m.addEventListener('mouseenter', () => t.style.animationPlayState = 'paused');
  m.addEventListener('mouseleave', () => t.style.animationPlayState = 'running');
}

/* Contact form leading to whatsapp */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-p');
    const tx = btn.querySelector('.btn-tx');
    gsap.to(tx, {
      opacity: 0, y: -10, duration: 0.3,
      onComplete() {
        tx.textContent = 'Message Sent ✓';
        gsap.to(tx, { opacity: 1, y: 0, duration: 0.4 });
      }
    });
    const name = form.querySelector('[name="name"]').value || 'there';
    const project = form.querySelector('[name="project"]').value || 'a project';
    const msg = encodeURIComponent(`Hi PARVEL! I'm ${name} and I'd love to discuss ${project}.`);
    setTimeout(() => window.open(`https://wa.me/2349033831825?text=${msg}`, '_blank'), 900);
  });
}


function initParallax() {
  // Philosophy geometric bg subtle scroll
  gsap.to('.phil-bg-svg', {
    y: 60, ease: 'none',
    scrollTrigger: {
      trigger: '#philosophy', start: 'top bottom', end: 'bottom top', scrub: true
    }
  });
}



document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initMagnetic();
  initMarquee();
  initNav();
  initReveals();
  initCounters();
  initCarousel();
  initVideoToggle();
  initForm();
  initParallax();

  initPreloader();

  window.addEventListener('resize', () => ScrollTrigger.refresh());
});
