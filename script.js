/**
 * Ebenezer Paul — Minimalist Cybersecurity Portfolio
 * Fluid Cyber Canvas, Scroll Velocity Effects, Text Scramble, Magnetic Hover & 3D Tilt
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set dynamic copyright year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --- 1. Interactive Background Cyber Particle Network Canvas ---
  const canvas = document.getElementById('bgCanvas');
  let ctx = null;
  let particles = [];
  let width = (window.innerWidth);
  let height = (window.innerHeight);
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
      const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.8 + 1,
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

    // Particle Animation Loop with Scroll Acceleration
    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Smooth scroll velocity decay
      scrollVelocity *= 0.92;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Normal drift + scroll reaction
        p.x += p.vx;
        p.y += p.vy - scrollVelocity * 0.35;

        // Wrap around screen borders
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.x -= (dx / dist) * force * 2.2;
          p.y -= (dy / dist) * force * 2.2;
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.baseColor} 0.6)`;
        ctx.fill();

        // Connect nearby particles with cyber lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 120) {
            const alpha = (1 - dist2 / 120) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);
  }

  // --- 2. Scroll Progress Bar & Background Parallax ---
  const progressBar = document.getElementById('progressBar');
  const glow1 = document.getElementById('glow1');
  const glow2 = document.getElementById('glow2');
  const floatingDock = document.getElementById('floatingDock');

  function handleScroll() {
    const currentScrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Track scroll velocity for canvas particles
    scrollVelocity = (currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    // Top progress bar
    if (progressBar && docHeight > 0) {
      const scrollPercent = (currentScrollY / docHeight) * 100;
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    // Parallax motion on ambient glows
    if (glow1) {
      glow1.style.transform = `translate3d(0, ${currentScrollY * -0.12}px, 0)`;
    }
    if (glow2) {
      glow2.style.transform = `translate3d(0, ${currentScrollY * 0.08}px, 0)`;
    }

    // Floating Quick Island visibility
    if (floatingDock) {
      if (currentScrollY > 380) {
        floatingDock.classList.add('visible');
      } else {
        floatingDock.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Scroll to Top action
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 3. Custom Fluid Cursor & Ambient Tracker (Desktop) ---
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
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const interactiveSelectors = 'a, button, input, [data-hover="true"], .spotlight-card, .chip-btn';
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

  // --- 4. Magnetic Micro-Interaction on Magnetic Targets ---
  const magneticElements = document.querySelectorAll('.magnetic-target');
  if (window.matchMedia('(pointer: fine)').matches) {
    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // --- 5. Spotlight Card Glow & 3D Reactive Tilt ---
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
      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.setProperty('--mouse-x', '-500px');
      card.style.setProperty('--mouse-y', '-500px');
    });
  });

  // --- 6. Click Ripple Wave Animation ---
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

  const rippleElements = document.querySelectorAll('.btn, .chip-btn, .social-link, .contact-pill, .icon-link, .dock-btn');
  rippleElements.forEach((el) => {
    el.addEventListener('click', createRipple);
  });

  // --- 7. Cyberpunk / Matrix Text Scramble Decoding Effect ---
  const scrambleChars = '!<>-_\\/[]{}—=+*^?#________';
  function scrambleText(element) {
    const finalContent = element.getAttribute('data-scramble') || element.textContent;
    let iteration = 0;
    const totalFrames = finalContent.length;

    const interval = setInterval(() => {
      element.textContent = finalContent
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) {
            return finalContent[index];
          }
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join('');

      if (iteration >= totalFrames) {
        clearInterval(interval);
        element.textContent = finalContent;
      }
      iteration += 1 / 2;
    }, 28);
  }

  // --- 8. Scroll-Driven Reveal Animation & Scramble Trigger ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');

            // Check if inside has scramble elements
            const scrambleTarget = entry.target.querySelector('[data-scramble]');
            if (scrambleTarget && !scrambleTarget.dataset.scrambled) {
              scrambleTarget.dataset.scrambled = "true";
              scrambleText(scrambleTarget);
            }

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // --- 9. Mobile Navigation Toggle ---
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

  // --- 10. Toast Notification System & Clipboard ---
  const toast = document.getElementById('toast');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    if (toastTimeout) clearTimeout(toastTimeout);

    toast.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function copyToClipboard(text, successMsg, button) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
      if (button) {
        const textSpan = button.querySelector('span');
        if (textSpan) {
          const original = textSpan.textContent;
          textSpan.textContent = "Copied!";
          setTimeout(() => {
            textSpan.textContent = original;
          }, 2000);
        }
      }
    }).catch(() => {
      prompt("Copy to clipboard:", text);
    });
  }

  // Email Copy Handlers
  const emailToCopy = "ebenezerpaul787@gmail.com";
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyEmailQuickBtn = document.getElementById('copyEmailQuickBtn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      copyToClipboard(emailToCopy, "✓ Email copied: " + emailToCopy, copyEmailBtn);
    });
  }
  if (copyEmailQuickBtn) {
    copyEmailQuickBtn.addEventListener('click', () => {
      copyToClipboard(emailToCopy, "✓ Email copied: " + emailToCopy, copyEmailQuickBtn);
    });
  }

  // Phone Copy Handler
  const phoneToCopy = "+91 79045 09223";
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      copyToClipboard(phoneToCopy, "✓ Phone copied: " + phoneToCopy, copyPhoneBtn);
    });
  }

  // --- 11. Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  function highlightNavOnScroll() {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach((item) => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // --- 12. Interactive Terminal Simulation with Fluid Typewriter ---
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const terminalSubmit = document.getElementById('terminalSubmitBtn');
  const chipButtons = document.querySelectorAll('.chip-btn');

  const COMMANDS = {
    help: `Available commands:
  - phone      : Show direct telephone & WhatsApp channels
  - email      : Direct email contact
  - whoami     : Learn more about Ebenezer Paul
  - focus      : Display core cybersecurity research domains
  - skills     : Print categorized technical capabilities
  - projects   : List featured security labs & tools
  - contact    : Full contact matrix
  - status     : Check internship & project availability
  - clear      : Reset terminal output`,

    phone: `Direct Phone & WhatsApp:
  Number : +91 79045 09223
  Status : Available for calls & instant messaging`,

    call: `Direct Phone & WhatsApp:
  Number : +91 79045 09223
  Status : Available for calls & instant messaging`,

    email: `Direct Email:
  Address: ebenezerpaul787@gmail.com
  Status : Inbox open for collaborations`,

    whoami: `Ebenezer Paul
Role   : Cybersecurity Student & Aspiring Security Specialist
Focus  : Defensive Security, Traffic Forensics, Secure Systems
Contact: +91 79045 09223 | ebenezerpaul787@gmail.com
Mission: Building bulletproof systems and analyzing attack surfaces to protect digital assets.`,

    focus: `Core Research Areas:
  [1] Packet Forensics & Network Anomaly Detection
  [2] System Hardening & Configuration Baselines (CIS)
  [3] Threat Telemetry Analysis & Incident Response (SIEM)
  [4] Secure Software Development (OWASP Top 10)`,

    skills: `Technical Stack:
  - Defense & Forensics : Wireshark, Nmap, Splunk/ELK, Sysmon, OWASP
  - Environments        : Linux (Debian, Arch), Windows Server, Docker
  - Languages           : Python, Bash, C/C++, HTML/CSS/JS, SQL`,

    projects: `Featured Labs:
  1. PacketPulse  - Real-time network sentinel & packet analysis tool
  2. SysHardener  - Automated Linux CIS security baseline auditor
  3. CipherLock   - Client-side AES-256-GCM zero-knowledge vault
  4. ThreatHunt   - SOC analysis & log telemetry detection lab`,

    contact: `Direct Contact Channels:
  - Phone   : +91 79045 09223
  - Email   : ebenezerpaul787@gmail.com
  - GitHub  : https://github.com/ebenezerpaul10
  - Status  : 🟢 Ready for interviews & internships`,

    status: `[STATUS CHECK]:
  System Health : 100% OPERATIONAL
  Availability  : OPEN FOR INTERNSHIPS & RESEARCH
  Firewall      : ACTIVE
  Contact Link  : +91 79045 09223`
  };

  function appendTerminalLine(cmd, outputHtml, isRawText = false) {
    if (!terminalOutput) return;

    if (cmd) {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'term-line';
      lineDiv.innerHTML = `<span class="term-prompt">$</span> <span class="term-cmd">${escapeHtml(cmd)}</span>`;
      terminalOutput.appendChild(lineDiv);
    }

    if (outputHtml) {
      const respDiv = document.createElement('div');
      respDiv.className = 'term-response';
      if (isRawText) {
        respDiv.innerHTML = `&gt; ${outputHtml.replace(/\n/g, '<br>&gt; ')}`;
      } else {
        respDiv.innerHTML = outputHtml;
      }
      terminalOutput.appendChild(respDiv);
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      appendTerminalLine(null, `<span class="text-cyan">Terminal cleared. Type 'help' for command list.</span>`);
      return;
    }

    if (COMMANDS[cmd]) {
      appendTerminalLine(cmd, COMMANDS[cmd], true);
    } else {
      appendTerminalLine(cmd, `<span style="color:#ef4444;">Command not recognized: '${escapeHtml(cmd)}'. Type 'help' for commands.</span>`);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        terminalInput.value = '';
        executeCommand(val);
      }
    });
  }

  if (terminalSubmit) {
    terminalSubmit.addEventListener('click', () => {
      if (terminalInput) {
        const val = terminalInput.value;
        terminalInput.value = '';
        executeCommand(val);
      }
    });
  }

  // Typewriter effect when clicking quick chips
  let isTyping = false;
  function simulateTypewriter(text, callback) {
    if (!terminalInput || isTyping) return;
    isTyping = true;
    terminalInput.value = '';
    let i = 0;
    const interval = setInterval(() => {
      terminalInput.value += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => {
          isTyping = false;
          callback();
        }, 150);
      }
    }, 45);
  }

  chipButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const command = btn.getAttribute('data-command');
      if (command) {
        simulateTypewriter(command, () => {
          terminalInput.value = '';
          executeCommand(command);
        });
      }
    });
  });
});
