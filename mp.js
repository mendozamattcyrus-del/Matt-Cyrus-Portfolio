const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close menu on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Sliding pill indicator
const pill = document.getElementById('navPill');
const navItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function movePill(target) {
    if (!target || window.innerWidth <= 768) {
        pill.classList.remove('visible');
        return;
    }
    const linkRect = target.getBoundingClientRect();
    const listRect = navLinks.getBoundingClientRect();
    pill.style.width = linkRect.width + 'px';
    pill.style.left = (linkRect.left - listRect.left) + 'px';
    pill.classList.add('visible');
}

function updateActiveLink() {
    const scrollPos = window.scrollY + 150;
    let currentId = 'home';
    sections.forEach(section => {
        if (section.offsetTop <= scrollPos) currentId = section.id;
    });
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + currentId) {
            item.classList.add('active');
            movePill(item);
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-links a.active');
    movePill(active);
});

// Hover preview
navItems.forEach(item => item.addEventListener('mouseenter', () => movePill(item)));
navLinks.addEventListener('mouseleave', () => {
    const active = document.querySelector('.nav-links a.active');
    movePill(active);
});

// Initial pill position
setTimeout(() => {
    const active = document.querySelector('.nav-links a.active');
    movePill(active);
}, 700);

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.15 });
revealElements.forEach(el => revealObserver.observe(el));

/* =========================================================
   FEEDBACK SECTION LOGIC
   ========================================================= */
(() => {
  const STORAGE_KEY = 'portfolio_feedbacks';
  const MAX_FEEDBACKS = 50;

  const form           = document.getElementById('feedbackForm');
  const nameInput      = document.getElementById('fbName');
  const emailInput     = document.getElementById('fbEmail');
  const messageInput   = document.getElementById('fbMessage');
  const submitBtn      = document.getElementById('fbSubmitBtn');
  const feedbackList   = document.getElementById('feedbackList');
  const feedbackCount  = document.getElementById('feedbackCount');
  const clearBtn       = document.getElementById('clearFeedbackBtn');
  const charCount      = document.getElementById('charCount');
  const ratingError    = document.getElementById('ratingError');
  const toast          = document.getElementById('toast');

  /* ---------- Helpers ---------- */
  const escapeHtml = (str) =>
    str.replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));

  const getInitials = (name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length-1].charAt(0)).toUpperCase();
  };

  const timeAgo = (timestamp) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff/60) + 'm ago';
    if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff/86400) + 'd ago';
    return new Date(timestamp).toLocaleDateString();
  };

  const showToast = (message, type='success') => {
    toast.textContent = message;
    toast.className = 'toast show' + (type === 'error' ? ' error' : '');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };

  /* ---------- Storage ---------- */
  const loadFeedbacks = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  };
  const saveFeedbacks = (list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  /* ---------- Render ---------- */
  const renderFeedbacks = () => {
    const list = loadFeedbacks();
    feedbackCount.textContent = `${list.length} feedback${list.length !== 1 ? 's' : ''}`;
    clearBtn.style.display = list.length > 0 ? 'inline-flex' : 'none';

    if (list.length === 0) {
      feedbackList.innerHTML = `
        <div class="feedback-empty">
          <i class="far fa-comment-dots"></i>
          <p>No feedbacks yet. Be the first to share your thoughts!</p>
        </div>`;
      return;
    }

    feedbackList.innerHTML = list.map(fb => `
      <div class="feedback-item">
        <div class="feedback-item-head">
          <div class="feedback-user">
            <div class="feedback-avatar">${escapeHtml(getInitials(fb.name))}</div>
            <div>
              <div class="feedback-name">${escapeHtml(fb.name)}</div>
              <div class="feedback-email">${escapeHtml(fb.email)}</div>
            </div>
          </div>
          <div class="feedback-stars" title="${fb.rating} out of 5">
            ${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)}
          </div>
        </div>
        <div class="feedback-msg">${escapeHtml(fb.message)}</div>
        <div class="feedback-time"><i class="far fa-clock"></i> ${timeAgo(fb.timestamp)}</div>
      </div>
    `).join('');
  };

  /* ---------- Validation ---------- */
  const setError = (input, show) => {
    const group = input.closest('.form-group');
    if (group) group.classList.toggle('error', show);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validateForm = () => {
    let valid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length > 50) {
      setError(nameInput, true); valid = false;
    } else setError(nameInput, false);

    if (!validateEmail(emailInput.value)) {
      setError(emailInput, true); valid = false;
    } else setError(emailInput, false);

    const rating = document.querySelector('input[name="rating"]:checked');
    if (!rating) {
      ratingError.style.display = 'block'; valid = false;
    } else ratingError.style.display = 'none';

    const msg = messageInput.value.trim();
    if (!msg || msg.length > 500) {
      setError(messageInput, true); valid = false;
    } else setError(messageInput, false);

    return valid;
  };

  /* ---------- Character counter ---------- */
  messageInput.addEventListener('input', () => {
    const len = messageInput.value.length;
    charCount.textContent = len;
    charCount.style.color = len > 480 ? (len >= 500 ? '#ef4444' : '#fbbf24') : '';
    if (len <= 500) setError(messageInput, false);
  });

  /* ---------- Live clear errors on input ---------- */
  nameInput.addEventListener('input', () => setError(nameInput, false));
  emailInput.addEventListener('input', () => setError(emailInput, false));
  document.querySelectorAll('input[name="rating"]').forEach(r =>
    r.addEventListener('change', () => ratingError.style.display = 'none')
  );

  /* ---------- Submit ---------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors above.', 'error');
      return;
    }

    // Button loading state
    const original = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    // Simulate async submit
    setTimeout(() => {
      const feedback = {
        id: Date.now() + '-' + Math.random().toString(36).slice(2,8),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        rating: parseInt(document.querySelector('input[name="rating"]:checked').value, 10),
        message: messageInput.value.trim(),
        timestamp: Date.now()
      };

      const list = loadFeedbacks();
      list.unshift(feedback);
      if (list.length > MAX_FEEDBACKS) list.length = MAX_FEEDBACKS;
      saveFeedbacks(list);

      renderFeedbacks();
      showToast('Thanks for your feedback! 🎉');

      form.reset();
      charCount.textContent = '0';
      submitBtn.disabled = false;
      submitBtn.innerHTML = original;
    }, 700);
  });

  /* ---------- Clear all ---------- */
  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all feedbacks? This cannot be undone.')) {
      saveFeedbacks([]);
      renderFeedbacks();
      showToast('All feedbacks cleared.', 'error');
    }
  });

  /* ---------- Initial render ---------- */
  renderFeedbacks();
})();
