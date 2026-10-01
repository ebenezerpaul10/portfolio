/**
 * Ebenezer Paul — Cyber Portfolio JavaScript Core
 * Bento Grid Telemetry, Digital Clock, Terminal Tabs, Project Filtering, and Motion
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current copyright year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --- 1. Live Digital Clock Widget (IST / Local Time) ---
  const digitalClock = document.getElementById('digitalClock');
  function updateClock() {
    if (!digitalClock) return;
    const now = new Date();
    // Format to 24-hour HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    digitalClock.textContent = `${hours}:${minutes}:${seconds}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // --- 2. Interactive Background Cyber Particle Network Canvas ---
  const canvas = document.getElementById('bgCanvas');
  let ctx = null;
  let particles = [];
  let width = window.innerWidth;
  let height = window.innerHeight;
  let mouse = { x: -1000, y: -1000 };
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;

  if (canvas) {
    ctx = canvas.getContext('2d');
    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.min(Math.floor((width * height) / 24000), 50);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.6 + 1,
          baseColor: Math.random() > 0.4 ? 'rgba(34, 211, 238,' : 'rgba(16, 185, 129,'
        });
      }
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      scrollVelocity *= 0.92;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy - scrollVelocity * 0.3;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 90) {
          const force = (90 - dist) / 90;
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.baseColor} 0.55)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 110) {
            const alpha = (1 - dist2 / 110) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);
  }

  // --- 3. Scroll Progress Bar & Floating Dock Tracker ---
  const progressBar = document.getElementById('progressBar');
  const glow1 = document.getElementById('glow1');
  const glow2 = document.getElementById('glow2');
  const floatingDock = document.getElementById('floatingDock');

  function handleScroll() {
    const currentScrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    scrollVelocity = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    if (progressBar && docHeight > 0) {
      const scrollPercent = (currentScrollY / docHeight) * 100;
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    if (glow1) {
      glow1.style.transform = `translate3d(0, ${currentScrollY * -0.1}px, 0)`;
    }
    if (glow2) {
      glow2.style.transform = `translate3d(0, ${currentScrollY * 0.08}px, 0)`;
    }

    if (floatingDock) {
      if (currentScrollY > 360) {
        floatingDock.classList.add('visible');
      } else {
        floatingDock.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 4. Custom Fluid Cursor & Trailing Ring (Desktop) ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const interactiveSelectors = 'a, button, input, [data-hover="true"], .spotlight-card, .term-tab-btn, .filter-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  // --- 5. Magnetic Micro-Interaction on Magnetic Targets ---
  const magneticElements = document.querySelectorAll('.magnetic-target');
  if (window.matchMedia('(pointer: fine)').matches) {
    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.25;
        const deltaY = (e.clientY - centerY) * 0.25;
        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // --- 6. Card Spotlight Glow & 3D Reactive Tilt ---
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.setProperty('--mouse-x', '-500px');
      card.style.setProperty('--mouse-y', '-500px');
    });
  });

  // --- 7. Click Ripple Feedback Wave ---
  function createRipple(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const size = Math.max(rect.width, rect.height) * 1.5;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    btn.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  const rippleElements = document.querySelectorAll('.btn, .term-tab-btn, .filter-btn, .dock-btn, .project-code-link');
  rippleElements.forEach((el) => {
    el.addEventListener('click', createRipple);
  });

  // --- 8. Project Category Filter Tabs ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 250);
        }
      });
    });
  });

  // --- 9. Terminal Tabs & CLI Simulation ---
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const terminalSubmit = document.getElementById('terminalSubmitBtn');
  const termTabBtns = document.querySelectorAll('.term-tab-btn');

  const TAB_CONTENT = {
    profile: `<div class="term-line"><span class="term-prompt">ebenezer@sec-box:~$</span> <span class="term-cmd">cat profile.json</span></div>
<div class="term-response text-cyan">
  {<br />
  &nbsp;&nbsp;"name": "Ebenezer Paul",<br />
  &nbsp;&nbsp;"role": "Cybersecurity Student &amp; Defensive Specialist",<br />
  &nbsp;&nbsp;"interests": ["Network Forensics", "SOC Telemetry", "Crypto Systems"],<br />
  &nbsp;&nbsp;"phone": "+91 79045 09223",<br />
  &nbsp;&nbsp;"email": "ebenezerpaul787@gmail.com",<br />
  &nbsp;&nbsp;"status": "Available Immediately"<br />
  }
</div>`,

    focus: `<div class="term-line"><span class="term-prompt">ebenezer@sec-box:~$</span> <span class="term-cmd">get-focus-domains</span></div>
<div class="term-response">
  &gt; [01] Deep Packet Forensics &amp; Anomaly Detection (Wireshark/Scapy)<br />
  &gt; [02] Linux OS Hardening &amp; CIS Baseline Enforcement<br />
  &gt; [03] Zero-Knowledge Cryptographic Tools (AES-256-GCM)<br />
  &gt; [04] Endpoint Threat Hunting &amp; Telemetry Parsing (Sysmon)
</div>`,

    telemetry: `<div class="term-line"><span class="term-prompt">ebenezer@sec-box:~$</span> <span class="term-cmd">systemctl status defense-matrix</span></div>
<div class="term-response text-emerald">
  ● defense-matrix.service - Core Security Pipeline<br />
  &nbsp;&nbsp;Loaded: loaded (/etc/systemd/system/defense-matrix.service; enabled)<br />
  &nbsp;&nbsp;Active: active (running) | Integrity: 100%<br />
  &nbsp;&nbsp;Firewall: UFW ACTIVE (strict baseline rules enabled)<br />
  &nbsp;&nbsp;Recruitment Status: 🟢 OPEN FOR INTERNSHIPS &amp; PROJECTS
</div>`,

    contact: `<div class="term-line"><span class="term-prompt">ebenezer@sec-box:~$</span> <span class="term-cmd">netstat --direct-reach</span></div>
<div class="term-response">
  &gt; Phone    : +91 79045 09223 (Voice &amp; WhatsApp)<br />
  &gt; Email    : ebenezerpaul787@gmail.com<br />
  &gt; GitHub   : https://github.com/ebenezerpaul10<br />
  &gt; Location : Tamil Nadu, India (UTC+5:30)
</div>`
  };

  termTabBtns.forEach((tab) => {
    tab.addEventListener('click', () => {
      termTabBtns.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const tabKey = tab.getAttribute('data-tab');
      if (TAB_CONTENT[tabKey] && terminalOutput) {
        terminalOutput.innerHTML = TAB_CONTENT[tabKey];
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    });
  });

  const CLI_COMMANDS = {
    help: `Available commands:
  - phone    : Print telephone & WhatsApp number
  - email    : Display primary email contact
  - whoami   : Print user profile
  - skills   : Print technical skill matrix
  - labs     : Show engineered security labs
  - clear    : Reset terminal window`,

    phone: `Direct Phone & WhatsApp:
  +91 79045 09223 (Instant calling & chat enabled)`,

    email: `Direct Email:
  ebenezerpaul787@gmail.com (Responses within 24h)`,

    whoami: `Ebenezer Paul // Cybersecurity Student & Defensive Toolmaker`,

    skills: `Toolchain:
  Wireshark, Nmap, Sysmon, OWASP, Linux CIS, Python, Bash, AES-256`,

    labs: `Projects:
  1. PacketPulse (Network Sentinel)
  2. SysHardener (Linux CIS Auditor)
  3. CipherLock (AES-256 Vault)
  4. ThreatHunt (SOC Telemetry Lab)`
  };

  function executeCliCommand(cmd) {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd || !terminalOutput) return;

    if (cleanCmd === 'clear') {
      terminalOutput.innerHTML = `<div class="term-line"><span class="term-prompt">ebenezer@sec-box:~$</span> <span class="text-cyan">Console cleared. Type 'help' for available commands.</span></div>`;
      return;
    }

    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="term-prompt">ebenezer@sec-box:~$</span> <span class="term-cmd">${cleanCmd}</span>`;
    terminalOutput.appendChild(line);

    const resp = document.createElement('div');
    resp.className = 'term-response';

    if (CLI_COMMANDS[cleanCmd]) {
      resp.innerHTML = `&gt; ${CLI_COMMANDS[cleanCmd].replace(/\n/g, '<br>&gt; ')}`;
    } else {
      resp.innerHTML = `<span style="color:#ef4444;">Unrecognized command: '${cleanCmd}'. Type 'help' for options.</span>`;
    }

    terminalOutput.appendChild(resp);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        terminalInput.value = '';
        executeCliCommand(val);
      }
    });
  }

  if (terminalSubmit) {
    terminalSubmit.addEventListener('click', () => {
      if (terminalInput) {
        const val = terminalInput.value;
        terminalInput.value = '';
        executeCliCommand(val);
      }
    });
  }

  // --- 10. Toast Notification & Copy Actions ---
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function triggerToast(msg) {
    if (!toast) return;
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function copyText(value, label, button) {
    navigator.clipboard.writeText(value).then(() => {
      triggerToast(`✓ Copied: ${value}`);
      if (button) {
        const span = button.querySelector('span');
        if (span) {
          const prev = span.textContent;
          span.textContent = "Copied!";
          setTimeout(() => {
            span.textContent = prev;
          }, 2000);
        }
      }
    }).catch(() => {
      prompt(`Copy ${label}:`, value);
    });
  }

  // Phone Copy Buttons
  const copyPhoneMainBtn = document.getElementById('copyPhoneMainBtn');
  if (copyPhoneMainBtn) {
    copyPhoneMainBtn.addEventListener('click', () => {
      copyText('+91 79045 09223', 'Phone Number', copyPhoneMainBtn);
    });
  }

  // Email Copy Buttons
  const copyEmailHeroBtn = document.getElementById('copyEmailHeroBtn');
  const copyEmailMainBtn = document.getElementById('copyEmailMainBtn');
  if (copyEmailHeroBtn) {
    copyEmailHeroBtn.addEventListener('click', () => {
      copyText('ebenezerpaul787@gmail.com', 'Email Address', copyEmailHeroBtn);
    });
  }
  if (copyEmailMainBtn) {
    copyEmailMainBtn.addEventListener('click', () => {
      copyText('ebenezerpaul787@gmail.com', 'Email Address', copyEmailMainBtn);
    });
  }

  // --- 11. Staggered Scroll Reveal Observer ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // --- 12. Mobile Menu Navigation Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // --- 13. Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  function highlightNav() {
    const scrollPos = window.scrollY + 140;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((item) => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });
});
