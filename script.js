// Hero Slider Functionality
const heroSlider = () => {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentIndex = 0;
    let autoSlideInterval;
    
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    };
    
    const nextSlide = () => {
        const newIndex = (currentIndex + 1) % slides.length;
        showSlide(newIndex);
        resetAutoSlide();
    };
    
    const prevSlide = () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(newIndex);
        resetAutoSlide();
    };
    
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 4000);
    };
    
    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoSlide();
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.querySelector('.hero-slider').addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    document.querySelector('.hero-slider').addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    const handleSwipe = () => {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
        } else if (touchEndX > touchStartX + 50) {
            prevSlide();
        }
    };
    
    showSlide(0);
    startAutoSlide();
};

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileCloseBtn = document.getElementById('mobileCloseBtn');
const mainNav = document.getElementById('mainNav');

function toggleMobileMenu() {
    mainNav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

function closeMobileMenu() {
    mainNav.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
mobileCloseBtn.addEventListener('click', closeMobileMenu);

// Close mobile menu when clicking on nav links
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Header Scroll Effect
const header = document.querySelector('.main-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    if (mainNav.classList.contains('active')) {
        closeMobileMenu();
    }
    
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
        header.classList.remove('transparent');
    } else {
        header.classList.add('transparent');
    }
    
    if (currentScroll <= 0) {
        header.classList.remove('scrolled-up');
        header.classList.remove('scrolled');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scrolled-up')) {
        header.classList.remove('scrolled');
        header.classList.add('scrolled-up');
    } else if (currentScroll < lastScroll && header.classList.contains('scrolled-up')) {
        header.classList.remove('scrolled-up');
        header.classList.add('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Tab Functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Scroll down arrow click
document.querySelector('.scroll-down').addEventListener('click', () => {
    window.scrollTo({
        top: document.querySelector('#coworking').offsetTop - 80,
        behavior: 'smooth'
    });
});

// Form Submission
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.');
        this.reset();
    });
}

// Card Detail Modal
const cardDetailModal = document.getElementById('cardDetailModal');
const cardModalCloseBtn = document.getElementById('cardModalCloseBtn');
const cardDetailContent = document.getElementById('cardDetailContent');
const openCardBtns = document.querySelectorAll('.open-card-btn');

let scrollPosition = 0;

function openCardDetail(cardId) {
    // Save scroll position
    scrollPosition = window.scrollY;
    
    // In a real implementation, you would fetch the card details from a database or API
    // For this example, we'll create a simple detail view
    
    const card = document.querySelector(`[data-card-id="${cardId}"]`);
    if (!card) return;
    
    const title = card.querySelector('.feature-title').textContent;
    const text = card.querySelector('.feature-text').textContent;
    const imgSrc = card.querySelector('.feature-img img').src;
    
    cardDetailContent.innerHTML = `
        <div class="card-detail-img">
            <img src="${imgSrc}" alt="${title}">
        </div>
        <div class="card-detail-text">
            <h3>${title}</h3>
            <p>${text}</p>
            <p>Weitere Details zu diesem Angebot würden hier angezeigt werden.</p>
            <button class="btn">Jetzt buchen</button>
        </div>
    `;
    
    cardDetailModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeCardDetail() {
    cardDetailModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
}

openCardBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const cardId = this.closest('.feature-card').getAttribute('data-card-id');
        openCardDetail(cardId);
    });
});

cardModalCloseBtn.addEventListener('click', closeCardDetail);

cardDetailModal.addEventListener('click', (e) => {
    if (e.target === cardDetailModal) {
        closeCardDetail();
    }
});

// Mobile Ad Popup
const mobileAdModal = document.getElementById('mobileAdModal');
const adCloseBtn = document.getElementById('adCloseBtn');
const adActionBtn = document.getElementById('adActionBtn');

// Desktop Ad Banner
const desktopAdBanner = document.getElementById('desktopAdBanner');
const desktopAdCloseBtn = document.getElementById('desktopAdCloseBtn');
const desktopAdActionBtn = document.getElementById('desktopAdActionBtn');

function showMobileAd() {
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            mobileAdModal.classList.add('active');
        }, 10000); // Show after 10 seconds
    }
}

function showDesktopAd() {
    if (window.innerWidth > 768) {
        setTimeout(() => {
            desktopAdBanner.classList.add('active');
        }, 15000); // Show after 15 seconds
    }
}

function closeMobileAd() {
    mobileAdModal.classList.remove('active');
}

function closeDesktopAd() {
    desktopAdBanner.classList.remove('active');
}

adCloseBtn.addEventListener('click', closeMobileAd);
adActionBtn.addEventListener('click', () => {
    closeMobileAd();
    window.location.href = '#pakete';
});

desktopAdCloseBtn.addEventListener('click', closeDesktopAd);
desktopAdActionBtn.addEventListener('click', () => {
    closeDesktopAd();
    window.location.href = '#pakete';
});

// Packages & Reservation Functionality
const packageTabBtns = document.querySelectorAll('.package-tab-btn');
const packageContents = document.querySelectorAll('.package-content');
const packageReserveBtns = document.querySelectorAll('.package-reserve-btn');
const reservationModal = document.getElementById('reservationModal');
const reviewModal = document.getElementById('reviewModal');
const confirmationModal = document.getElementById('confirmationModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const reviewCloseBtn = document.getElementById('reviewCloseBtn');
const confirmationCloseBtn = document.getElementById('confirmationCloseBtn');
const confirmationOkBtn = document.getElementById('confirmationOkBtn');
const reservationForm = document.getElementById('reservationForm');
const packageNameInput = document.getElementById('packageName');
const confirmedPackageSpan = document.getElementById('confirmedPackage');
const reservationNumberSpan = document.getElementById('reservationNumber');
const reviewReservationBtn = document.getElementById('reviewReservationBtn');
const editReservationBtn = document.getElementById('editReservationBtn');
const confirmReservationBtn = document.getElementById('confirmReservationBtn');

// Package tabs
packageTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const packageId = btn.getAttribute('data-package');
        
        // Remove active class from all buttons and contents
        packageTabBtns.forEach(btn => btn.classList.remove('active'));
        packageContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(`${packageId}-packages`).classList.add('active');
    });
});

// Open reservation modal with body scroll lock
packageReserveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const packageName = btn.getAttribute('data-package');
        packageNameInput.value = packageName;
        reservationModal.classList.add('active');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        
        // Scroll to top of form on mobile
        if (window.innerWidth <= 768) {
            const formContainer = document.querySelector('.landscape-form');
            if (formContainer) {
                formContainer.scrollTo(0, 0);
            }
        }
    });
});

// Close modals and restore body scroll
function closeModals() {
    reservationModal.classList.remove('active');
    reviewModal.classList.remove('active');
    confirmationModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
}

modalCloseBtn.addEventListener('click', closeModals);
reviewCloseBtn.addEventListener('click', closeModals);
confirmationCloseBtn.addEventListener('click', closeModals);
confirmationOkBtn.addEventListener('click', closeModals);

// Close modal when clicking on backdrop
[reservationModal, reviewModal, confirmationModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModals();
        }
    });
});

// Review reservation button
reviewReservationBtn.addEventListener('click', function() {
    // Validate form
    const form = document.getElementById('reservationForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value) {
            field.style.borderColor = 'red';
            isValid = false;
        } else {
            field.style.borderColor = '#ddd';
        }
    });
    
    if (!isValid) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus.');
        return;
    }
    
    // Validate dates
    const checkin = new Date(form.reservationCheckin.value);
    const checkout = new Date(form.reservationCheckout.value);
    
    if (checkin >= checkout) {
        alert('Check-out Datum muss nach dem Check-in Datum liegen.');
        form.reservationCheckout.style.borderColor = 'red';
        return;
    }
    
    // Fill review modal with data
    document.getElementById('reviewPackage').textContent = packageNameInput.value;
    document.getElementById('reviewName').textContent = form.reservationName.value;
    document.getElementById('reviewEmail').textContent = form.reservationEmail.value;
    document.getElementById('reviewPhone').textContent = form.reservationPhone.value || '-';
    document.getElementById('reviewGuests').textContent = form.reservationGuests.value;
    document.getElementById('reviewCheckin').textContent = new Date(form.reservationCheckin.value).toLocaleDateString('de-DE');
    document.getElementById('reviewCheckout').textContent = new Date(form.reservationCheckout.value).toLocaleDateString('de-DE');
    document.getElementById('reviewNotes').textContent = form.reservationNotes.value || '-';
    
    // Show review modal
    reservationModal.classList.remove('active');
    reviewModal.classList.add('active');
    
    // Scroll to top of review modal on mobile
    if (window.innerWidth <= 768) {
        const reviewContainer = document.querySelector('.review-modal .landscape-form');
        if (reviewContainer) {
            reviewContainer.scrollTo(0, 0);
        }
    }
});

// Edit reservation button
editReservationBtn.addEventListener('click', function() {
    reviewModal.classList.remove('active');
    reservationModal.classList.add('active');
    
    // Scroll to top of form on mobile
    if (window.innerWidth <= 768) {
        const formContainer = document.querySelector('.landscape-form');
        if (formContainer) {
            formContainer.scrollTo(0, 0);
        }
    }
});

// Confirm reservation button
confirmReservationBtn.addEventListener('click', function() {
    const form = document.getElementById('reservationForm');
    
    // Calculate number of nights
    const checkin = new Date(form.reservationCheckin.value);
    const checkout = new Date(form.reservationCheckout.value);
    const timeDiff = checkout - checkin;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // Generate reservation number
    const reservationNumber = 'BM-' + Math.floor(100000 + Math.random() * 900000);
    
    // Format dates for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('de-DE', options);
    };
    
    // Get form data
    const formData = {
        package: packageNameInput.value,
        name: form.reservationName.value,
        email: form.reservationEmail.value,
        phone: form.reservationPhone.value,
        checkin: formatDate(form.reservationCheckin.value),
        checkout: formatDate(form.reservationCheckout.value),
        nights: nights,
        guests: form.reservationGuests.value,
        notes: form.reservationNotes.value,
        reservationNumber: reservationNumber
    };
    
    // Update confirmation modal
    document.getElementById('confirmedPackage').textContent = formData.package;
    document.getElementById('reservationNumber').textContent = formData.reservationNumber;
    document.getElementById('confirmedCheckin').textContent = formData.checkin;
    document.getElementById('confirmedCheckout').textContent = formData.checkout;
    document.getElementById('confirmedNights').textContent = formData.nights;
    document.getElementById('confirmedGuests').textContent = formData.guests;
    
    // Send confirmation email (simulated)
    sendReservationEmail(formData);
    
    // Hide review modal and show confirmation
    reviewModal.classList.remove('active');
    confirmationModal.classList.add('active');
    
    // Reset form
    form.reset();
    
    // Scroll to top of confirmation modal on mobile
    if (window.innerWidth <= 768) {
        const confirmationContainer = document.querySelector('.confirmation-modal .landscape-form');
        if (confirmationContainer) {
            confirmationContainer.scrollTo(0, 0);
        }
    }
});

// Function to send reservation email
function sendReservationEmail(data) {
    const emailContent = `
        Neue Reservierung bei BM-Coworking:
        
        Paket: ${data.package}
        Name: ${data.name}
        Email: ${data.email}
        Telefon: ${data.phone}
        Check-in: ${data.checkin}
        Check-out: ${data.checkout}
        Nächte: ${data.nights}
        Personen: ${data.guests}
        Besondere Anforderungen: ${data.notes || 'Keine'}
        Reservierungsnummer: ${data.reservationNumber}
    `;
    
    console.log('Email würde gesendet werden mit:', emailContent);
    // In der Praxis würden Sie hier EmailJS oder eine Backend-API aufrufen
}

// Initialize background images
document.querySelectorAll('[data-bg-image]').forEach(section => {
    const bgImage = section.getAttribute('data-bg-image');
    if (bgImage) {
        section.style.backgroundImage = `url('${bgImage}')`;
        section.style.backgroundSize = 'cover';
        section.style.backgroundPosition = 'center';
        section.style.backgroundRepeat = 'no-repeat';
        section.classList.add('section-with-bg');
    }
});

// Fetch and update prices from API
async function fetchAndUpdatePrices() {
    try {
        const response = await fetch('/api/prices');
        if (!response.ok) throw new Error('Network response was not ok');
        const prices = await response.json();
        
        // Update prices in the DOM
        prices.forEach(item => {
            const elements = document.querySelectorAll(`[data-package-id="${item.id}"] .pricing-price`);
            elements.forEach(el => {
                el.innerHTML = `€${item.price}<span>/${item.period}</span>`;
            });
        });
    } catch (error) {
        console.error('Error fetching prices:', error);
    }
}

// Initial fetch
fetchAndUpdatePrices();

// Update prices periodically
setInterval(fetchAndUpdatePrices, 60000); // Update every minute

// Better mobile input handling
document.addEventListener('DOMContentLoaded', function() {
    // Prevent zoom on input focus in mobile
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            document.body.style.zoom = '100%';
        }
    }, { passive: true });
    
    // Improve date input on mobile
    if ('ontouchstart' in window) {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.type = 'date';
            });
            input.addEventListener('blur', function() {
                if (!this.value) this.type = 'text';
            });
        });
    }
    
    // Initialize hero slider
    heroSlider();
    
    // Reset scroll position when modals open
    const modals = [reservationModal, reviewModal, confirmationModal];
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                const formContainer = modal.querySelector('.landscape-form');
                if (formContainer) {
                    formContainer.scrollTop = 0;
                }
            }
        });
    });
    
    // Show ads after delay
    showMobileAd();
    showDesktopAd();
});
