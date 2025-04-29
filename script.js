// Hero Slider Functionality
const heroSlider = () => {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Function to show slide
    const showSlide = (index) => {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    };
    
    // Next slide
    const nextSlide = () => {
        const newIndex = (currentIndex + 1) % slides.length;
        showSlide(newIndex);
        resetAutoSlide();
    };
    
    // Previous slide
    const prevSlide = () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(newIndex);
        resetAutoSlide();
    };
    
    // Auto slide
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    };
    
    // Reset auto slide timer
    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoSlide();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });
    
    // Touch events for mobile
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
    
    // Initialize
    showSlide(0);
    startAutoSlide();
};

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Header Scroll Effect
const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
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

// Form Submission
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.');
        this.reset();
    });
}

// Packages & Booking Functionality
const packageTabBtns = document.querySelectorAll('.package-tab-btn');
const packageContents = document.querySelectorAll('.package-content');
const packageBookBtns = document.querySelectorAll('.package-book-btn');
const bookingModal = document.getElementById('bookingModal');
const reviewModal = document.getElementById('reviewModal');
const confirmationModal = document.getElementById('confirmationModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const reviewCloseBtn = document.getElementById('reviewCloseBtn');
const confirmationCloseBtn = document.getElementById('confirmationCloseBtn');
const confirmationOkBtn = document.getElementById('confirmationOkBtn');
const bookingForm = document.getElementById('bookingForm');
const packageNameInput = document.getElementById('packageName');
const confirmedPackageSpan = document.getElementById('confirmedPackage');
const reservationNumberSpan = document.getElementById('reservationNumber');
const reviewBookingBtn = document.getElementById('reviewBookingBtn');
const editBookingBtn = document.getElementById('editBookingBtn');
const confirmBookingBtn = document.getElementById('confirmBookingBtn');

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

// Open booking modal with body scroll lock
packageBookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const packageName = btn.getAttribute('data-package');
        packageNameInput.value = packageName;
        bookingModal.classList.add('active');
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
    bookingModal.classList.remove('active');
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
[bookingModal, reviewModal, confirmationModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModals();
        }
    });
});

// Review booking button
reviewBookingBtn.addEventListener('click', function() {
    // Validate form
    const form = document.getElementById('bookingForm');
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
    const checkin = new Date(form.bookingCheckin.value);
    const checkout = new Date(form.bookingCheckout.value);
    
    if (checkin >= checkout) {
        alert('Check-out Datum muss nach dem Check-in Datum liegen.');
        form.bookingCheckout.style.borderColor = 'red';
        return;
    }
    
    // Fill review modal with data
    document.getElementById('reviewPackage').textContent = packageNameInput.value;
    document.getElementById('reviewName').textContent = form.bookingName.value;
    document.getElementById('reviewEmail').textContent = form.bookingEmail.value;
    document.getElementById('reviewPhone').textContent = form.bookingPhone.value || '-';
    document.getElementById('reviewGuests').textContent = form.bookingGuests.value;
    document.getElementById('reviewCheckin').textContent = new Date(form.bookingCheckin.value).toLocaleDateString('de-DE');
    document.getElementById('reviewCheckout').textContent = new Date(form.bookingCheckout.value).toLocaleDateString('de-DE');
    document.getElementById('reviewNotes').textContent = form.bookingNotes.value || '-';
    
    // Show review modal
    bookingModal.classList.remove('active');
    reviewModal.classList.add('active');
    
    // Scroll to top of review modal on mobile
    if (window.innerWidth <= 768) {
        const reviewContainer = document.querySelector('.review-modal .landscape-form');
        if (reviewContainer) {
            reviewContainer.scrollTo(0, 0);
        }
    }
});

// Edit booking button
editBookingBtn.addEventListener('click', function() {
    reviewModal.classList.remove('active');
    bookingModal.classList.add('active');
    
    // Scroll to top of form on mobile
    if (window.innerWidth <= 768) {
        const formContainer = document.querySelector('.landscape-form');
        if (formContainer) {
            formContainer.scrollTo(0, 0);
        }
    }
});

// Confirm booking button
confirmBookingBtn.addEventListener('click', function() {
    const form = document.getElementById('bookingForm');
    
    // Calculate number of nights
    const checkin = new Date(form.bookingCheckin.value);
    const checkout = new Date(form.bookingCheckout.value);
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
        name: form.bookingName.value,
        email: form.bookingEmail.value,
        phone: form.bookingPhone.value,
        checkin: formatDate(form.bookingCheckin.value),
        checkout: formatDate(form.bookingCheckout.value),
        nights: nights,
        guests: form.bookingGuests.value,
        notes: form.bookingNotes.value,
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
    sendBookingEmail(formData);
    
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

// Function to send booking email
function sendBookingEmail(data) {
    const emailContent = `
        Neue Buchung bei BM-Coworking:
        
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
});
