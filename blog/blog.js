// ============ FILTER FUNCTIONALITY ============
const filterButtons = document.querySelectorAll(".filter-btn");
const blogCards = document.querySelectorAll(".blog-card");
const cardImages = document.querySelectorAll(".card-image");

cardImages.forEach((img) => {
  const src =
    img.getAttribute("data-image") ||
    (img.closest(".blog-card") &&
      img.closest(".blog-card").getAttribute("data-image"));
  if (src) {
    img.style.backgroundImage = `url("${src}")`;
    img.style.backgroundSize = "cover";
    img.style.backgroundPosition = "center";
    img.style.backgroundRepeat = "no-repeat";
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to clicked button
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");
    let visibleCount = 0;

    // Filter cards with animation
    blogCards.forEach((card, index) => {
      const category = card.getAttribute("data-category");

      if (filterValue === "all" || category === filterValue) {
        card.style.animation = "none";
        setTimeout(() => {
          card.style.display = "grid";
          card.style.animation = `riseSkew 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${
            visibleCount * 0.1
          }s both`;
          visibleCount++;
        }, 10);
      } else {
        card.style.animation = `fadeOutDown 0.4s ease-out forwards`;
        setTimeout(() => {
          card.style.display = "none";
        }, 400);
      }
    });
  });
});

// Add fadeOutDown animation
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// ============ SEARCH FUNCTIONALITY ============
const searchInput = document.querySelector(".search-input");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let visibleCount = 0;

    blogCards.forEach((card, index) => {
      const title = card.querySelector(".card-title").textContent.toLowerCase();
      const excerpt = card
        .querySelector(".card-excerpt")
        .textContent.toLowerCase();
      const category = card
        .querySelector(".card-category")
        .textContent.toLowerCase();

      if (
        title.includes(searchTerm) ||
        excerpt.includes(searchTerm) ||
        category.includes(searchTerm)
      ) {
        setTimeout(() => {
          card.style.display = "grid";
          card.style.animation = `fadeInUp 0.4s ease-out ${
            visibleCount * 0.08
          }s both`;
          visibleCount++;
        }, 0);
      } else {
        card.style.animation = "fadeOutDown 0.3s ease-out forwards";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  });

  // Clear search on focus and show all
  searchInput.addEventListener("focus", () => {
    if (searchInput.value === "") {
      blogCards.forEach((card) => {
        card.style.display = "grid";
        card.style.animation = "fadeInUp 0.4s ease-out";
      });
    }
  });
}

// ============ CARD CLICK TO NAVIGATE ============
blogCards.forEach((card) => {
  card.addEventListener("click", function (e) {
    e.preventDefault();
    if (!modal) return;
    const title = card.querySelector(".card-title").textContent;
    const excerpt = card.querySelector(".card-excerpt").textContent;
    const imgDiv = card.querySelector(".card-image");
    const bg = window.getComputedStyle(imgDiv).backgroundImage;
    modalTitle.textContent = title;
    modalBody.textContent = excerpt;
    modalImage.style.backgroundImage = bg;
    modal.classList.add("open");
  });
  card.style.cursor = "pointer";
});

// Add scaleOut animation for click
const clickStyle = document.createElement("style");
clickStyle.textContent = `
    @keyframes scaleOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
`;
document.head.appendChild(clickStyle);

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ============ NEWSLETTER FORM ============
const newsletterForm = document.querySelector(".newsletter-form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    const button = newsletterForm.querySelector("button");
    const originalText = button.textContent;

    // Validate email
    if (!isValidEmail(email)) {
      button.textContent = "❌ Invalid email";
      button.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "";
      }, 2000);
      return;
    }

    // Add success animation
    button.textContent = "✓ Subscribed!";
    button.style.background = "linear-gradient(135deg, #10b981, #059669)";
    button.style.transform = "scale(1.05)";

    // Show success message
    showNotification("Successfully subscribed to our newsletter!", "success");

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = "";
      button.style.transform = "";
      newsletterForm.reset();
    }, 2500);
  });
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        background: ${type === "success" ? "#10b981" : "#3b82f6"};
        color: white;
        font-weight: 600;
        animation: slideInUp 0.4s ease-out;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutDown 0.4s ease-out forwards";
    setTimeout(() => notification.remove(), 400);
  }, 3000);
}

// ============ PAGE LOAD ANIMATION ============
window.addEventListener("load", () => {
  // Animate cards on load
  blogCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.animation = `riseSkew 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${
      index * 0.1
    }s both`;
  });

  // Scroll to top on load
  window.scrollTo(0, 0);
});

// ============ INTERSECTION OBSERVER FOR LAZY ANIMATIONS ============
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observerCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation =
        "riseSkew 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards";
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe filter section
const filterSection = document.querySelector(".blog-filters");
if (filterSection) {
  observer.observe(filterSection);
}

// Observe newsletter section
const newsletterSection = document.querySelector(".newsletter-section");
if (newsletterSection) {
  observer.observe(newsletterSection);
}
const industryCta = document.querySelector(".industry-cta-inner");
if (industryCta) {
  observer.observe(industryCta);
}

// ============ KEYBOARD NAVIGATION ============
document.addEventListener("keydown", (e) => {
  // Press '/' to focus search
  if (e.key === "/" && searchInput) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }

  // Press 'Escape' to clear search
  if (e.key === "Escape" && searchInput && searchInput.value) {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
  }
});

// ============ BACK BUTTON ANIMATION ============
const backBtn = document.querySelector(".back-btn");
if (backBtn) {
  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 300);
  });
}

// ============ PARALLAX SCROLL EFFECT ============
window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset;
  const bgSvg = document.querySelector(".blog-bg-svg");

  if (bgSvg) {
    bgSvg.style.transform = `translateY(${scrollTop * 0.3}px)`;
  }
});

// ============ ACTIVE SCROLL INDICATOR ============
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 200) {
      section.style.opacity = "1";
    }
  });
});

// ============ SMOOTH SCROLL BEHAVIOR ============
document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href.startsWith("#") && href !== "#") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});

// ============ CARD HOVER ANIMATIONS ============
blogCards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-12px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// ============ FILTER BUTTON HOVER EFFECTS ============
filterButtons.forEach((btn) => {
  btn.addEventListener("mouseenter", function () {
    if (!this.classList.contains("active")) {
      this.style.transform = "translateY(-2px)";
    }
  });

  btn.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

// ============ CONSOLE MESSAGE ============
console.log(
  "%cWelcome to Deckoviz Blog! 🎨",
  "font-size: 20px; color: #7c3aed; font-weight: bold;"
);
console.log(
  '%cPress "/" to search articles or "Esc" to clear',
  "font-size: 12px; color: #d05fa2;"
);

// ============ PERFORMANCE OPTIMIZATION ============
// Debounce search for better performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to search if needed for large datasets
if (searchInput) {
  const debouncedSearch = debounce((e) => {
    searchInput.dispatchEvent(new Event("input"));
  }, 300);
}

// ============ ANALYTICS TRACKING ============
// Track filter clicks
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log(`Filtered by: ${btn.getAttribute("data-filter")}`);
    // You can send this to your analytics service
  });
});

// Track card clicks
blogCards.forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.querySelector(".card-title").textContent;
    console.log(`Opened article: ${title}`);
    // You can send this to your analytics service
  });
});

// Track newsletter subscriptions
if (newsletterForm) {
  newsletterForm.addEventListener("submit", () => {
    console.log("Newsletter subscription initiated");
    // You can send this to your analytics service
  });
}

const modal = document.getElementById("post-modal");
const modalClose = modal ? modal.querySelector(".post-modal-close") : null;
const modalTitle = modal ? modal.querySelector(".post-modal-title") : null;
const modalBody = modal ? modal.querySelector(".post-modal-body") : null;
const modalImage = modal ? modal.querySelector(".post-modal-image") : null;
const readLinks = document.querySelectorAll(".read-more");

readLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const card = e.target.closest(".blog-card");
    if (!card || !modal) return;
    const title = card.querySelector(".card-title").textContent;
    const excerpt = card.querySelector(".card-excerpt").textContent;
    const imgDiv = card.querySelector(".card-image");
    const bg = window.getComputedStyle(imgDiv).backgroundImage;
    modalTitle.textContent = title;
    modalBody.textContent = excerpt;
    modalImage.style.backgroundImage = bg;
    modal.classList.add("open");
  });
});

if (modalClose) {
  modalClose.addEventListener("click", () => {
    modal.classList.remove("open");
  });
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
    }
  });
}
