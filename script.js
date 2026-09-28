/**
 * Ebenezer Paul — Minimalist Cybersecurity Portfolio
 * Interactive Terminal & Core Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --- Mobile Navigation Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking nav links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Copy Email to Clipboard ---
  const emailToCopy = "ebenezerpaul787@gmail.com";
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyQuickBtn = document.getElementById('copyEmailQuickBtn');
  const toast = document.getElementById('toast');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function handleCopyEmail(button) {
    navigator.clipboard.writeText(emailToCopy).then(() => {
      showToast("✓ Copied: " + emailToCopy);
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
      // Fallback
      prompt("Copy email address:", emailToCopy);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => handleCopyEmail(copyBtn));
  }
  if (copyQuickBtn) {
    copyQuickBtn.addEventListener('click', () => handleCopyEmail(copyQuickBtn));
  }

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  function highlightNavOnScroll() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  // --- Interactive Terminal Simulation ---
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const terminalSubmit = document.getElementById('terminalSubmitBtn');
  const chipButtons = document.querySelectorAll('.chip-btn');

  const COMMANDS = {
    help: `Available commands:
  - whoami     : Learn more about Ebenezer Paul
  - focus      : Display core cybersecurity research domains
  - skills     : Print categorized technical capabilities
  - projects   : List featured security labs & tools
  - contact    : Direct contact channels
  - status     : Check internship & project availability
  - clear      : Reset terminal output`,

    whoami: `Ebenezer Paul
Role   : Cybersecurity Student & Aspiring Security Specialist
Focus  : Defensive Security, Traffic Forensics, Secure Systems
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

    contact: `Direct Inquiries:
  - Email   : ebenezerpaul787@gmail.com
  - Status  : Available for security research & internships`,

    status: `[STATUS CHECK]:
  System Health : 100% OPERATIONAL
  Availability  : OPEN FOR INTERNSHIPS & RESEARCH
  Firewall      : ACTIVE`
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

  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const command = btn.getAttribute('data-command');
      if (command) {
        executeCommand(command);
      }
    });
  });
});
