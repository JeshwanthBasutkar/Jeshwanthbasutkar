/* ==========================================================================
   Jeshwanth Basutkar - Portfolio Interactive JavaScript
   Includes: Particle Neural Network Background, Typewriter, Filters, Modal,
             Contact Copying, Toast Notifications & Mobile Navigation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Neural Network Particle Canvas
  initParticleCanvas();

  // Initialize Typewriter Effect
  initTypewriter();

  // Initialize Navbar Scroll Effects
  initNavbar();

  // Initialize Project Filters & Modals
  initProjects();

  // Initialize Contact Copy & Form Handling
  initContact();
});

/* --------------------------------------------------------------------------
   1. NEURAL PARTICLE CANVAS BACKGROUND
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 14), 70);
  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(139, 92, 246, ';
      this.baseAlpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push
      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 3;
          this.y -= (dy / distance) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.baseAlpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          let alpha = (1 - dist / 130) * 0.15;
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typedSpan = document.querySelector('.typed-text');
  if (!typedSpan) return;

  const titles = [
    'Data Science Practitioner',
    'Machine Learning Engineer',
    'Computer Vision & NLP Specialist',
    'Generative AI Developer'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typedSpan.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typedSpan.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      isDeleting = true;
      typeSpeed = 1800; // Pause at top
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. NAVBAR & SCROLL HIGHLIGHTING
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll active link highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('open')) {
        navLinksContainer.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. PROJECTS FILTER & MODAL DETAIL VIEW
   -------------------------------------------------------------------------- */
const projectsData = [
  {
    id: 'fake-news',
    category: 'nlp',
    title: 'Fake News Detection Using CNN',
    description: 'Developed a deep learning model utilizing Convolutional Neural Networks to classify and verify text articles, implementing a complete NLP pipeline for automated detection.',
    fullDetails: `
      <p><strong>Architecture:</strong> Convolutional Neural Networks (CNN) combined with word embedding techniques (Word2Vec / GloVe) for text feature extraction.</p>
      <br>
      <p><strong>Key Highlights:</strong></p>
      <ul style="padding-left: 20px; color: var(--text-muted); margin-top: 8px;">
        <li>Cleaned and preprocessed complex text datasets (tokenization, stop-word removal, lemmatization).</li>
        <li>Implemented dynamic sequence padding and 1D CNN feature maps to capture spatial text dependencies.</li>
        <li>Achieved robust binary classification performance in identifying deceptive and fake news articles.</li>
      </ul>
    `,
    tech: ['Python', 'TensorFlow', 'Keras', 'NumPy', 'Pandas', 'Scikit-learn', 'NLP Pipeline'],
    github: 'https://github.com/jeshwanthbasutkar/fake-news-detection',
    image: 'assets/images/fake-news-detection.png'
  },
  {
    id: 'jellyfish-id',
    category: 'cv',
    title: 'Jellyfish Species Identification from Underwater Images',
    description: 'Built an image classification system using image processing techniques to identify and categorize various jellyfish species from complex underwater visual data.',
    fullDetails: `
      <p><strong>Architecture:</strong> Deep Learning Computer Vision model using Transfer Learning & Custom CNN Layers for species classification.</p>
      <br>
      <p><strong>Key Highlights:</strong></p>
      <ul style="padding-left: 20px; color: var(--text-muted); margin-top: 8px;">
        <li>Handled low-contrast and noisy underwater visual data using OpenCV image enhancement techniques.</li>
        <li>Applied data augmentation strategies (rotation, scaling, contrast adjustment) to optimize model generalization.</li>
        <li>Categorized multiple rare underwater jellyfish species with high precision and low false-positive rates.</li>
      </ul>
    `,
    tech: ['Python', 'OpenCV', 'TensorFlow', 'CNN', 'Matplotlib', 'Image Processing'],
    github: 'https://github.com/jeshwanthbasutkar/jellyfish-identification',
    image: 'assets/images/jellyfish-identification.png'
  }
];

function initProjects() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal setup
  const modalBackdrop = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-detail-body');

  window.openProjectModal = function(projectId) {
    const proj = projectsData.find(p => p.id === projectId);
    if (!proj || !modalBackdrop) return;

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px;">
        <img src="${proj.image}" alt="${proj.title}" style="width: 100%; height: 220px; object-fit: cover; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
      </div>
      <h3 style="font-size: 1.6rem; margin-bottom: 8px;">${proj.title}</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
        ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
      <div style="font-size: 0.98rem; line-height: 1.7; color: var(--text-muted);">
        ${proj.fullDetails}
      </div>
      <div style="margin-top: 28px; display: flex; gap: 14px;">
        <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <i class="fab fa-github"></i> View GitHub Repo
        </a>
      </div>
    `;

    modalBackdrop.classList.add('active');
  };

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('active');
      }
    });
  }

  // Resume Modal setup
  const resumeModalBackdrop = document.getElementById('resume-modal');
  const resumeModalClose = document.getElementById('resume-modal-close-btn');

  window.openResumeModal = function() {
    if (resumeModalBackdrop) {
      resumeModalBackdrop.classList.add('active');
    } else {
      window.open('JeshwanthBasutkar.pdf', '_blank');
    }
  };

  window.closeResumeModal = function() {
    if (resumeModalBackdrop) {
      resumeModalBackdrop.classList.remove('active');
    }
  };

  if (resumeModalClose) {
    resumeModalClose.addEventListener('click', closeResumeModal);
  }

  if (resumeModalBackdrop) {
    resumeModalBackdrop.addEventListener('click', (e) => {
      if (e.target === resumeModalBackdrop) {
        closeResumeModal();
      }
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resumeModalBackdrop) resumeModalBackdrop.classList.remove('active');
      if (modalBackdrop) modalBackdrop.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   5. CONTACT & TOAST NOTIFICATION UTILITIES
   -------------------------------------------------------------------------- */
function initContact() {
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');

      try {
        const response = await fetch('https://formsubmit.co/ajax/jeshwanthbasutkar@gmail.com', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showToast('Thank you! Your message has been sent to Jeshwanth.', 'fa-paper-plane');
          contactForm.reset();
        } else {
          showToast('Form submitted! (First submission requires email activation)', 'fa-envelope');
          contactForm.reset();
        }
      } catch (err) {
        showToast('Error sending message. Please try emailing directly.', 'fa-exclamation-triangle');
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
}

window.copyToClipboard = function(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${label} copied to clipboard!`, 'fa-copy');
  }).catch(() => {
    showToast(`Failed to copy ${label}`, 'fa-exclamation-triangle');
  });
};

function showToast(message, iconClass = 'fa-check-circle') {
  let toast = document.getElementById('custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
