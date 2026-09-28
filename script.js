/**
 * Ebenezer Paul — Minimalist Cybersecurity Portfolio
 * Fluid Motion, Interactive Terminal, Spotlight & Reactive Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set dynamic copyright year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --- 1. Scroll Progress Bar ---
  const progressBar = document.getElementById('progressBar');
  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // --- 2. Custom Fluid Cursor & Ambient Tracker (Desktop) ---
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

    // Smooth lerp trailing animation for the cursor ring
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover detection for interactive elements
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

  // --- 3. Spotlight Card Glow & 3D Reactive Tilt ---
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle 3D perspective tilt
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

  // --- 4. Click Ripple Wave Animation ---
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

  const rippleElements = document.querySelectorAll('.btn, .chip-btn, .social-link, .contact-pill, .icon-link');
  rippleElements.forEach((el) => {
    el.addEventListener('click', createRipple);
  });

  // --- 5. Scroll-Driven Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
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
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // --- 6. Mobile Navigation Toggle ---
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

  // --- 7. Toast Notification System & Clipboard ---
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

  // --- 8. Active Nav Link on Scroll ---
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

  // --- 9. Interactive Terminal Simulation with Fluid Typewriter ---
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
