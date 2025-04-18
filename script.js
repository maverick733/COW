// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mainNav.classList.toggle('active');
    document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : 'auto';
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
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
});

// Form Submission
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.');
    this.reset();
});

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

// Open booking modal
packageBookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const packageName = btn.getAttribute('data-package');
        packageNameInput.value = packageName;
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modals
function closeModals() {
    bookingModal.classList.remove('active');
    reviewModal.classList.remove('active');
    confirmationModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

modalCloseBtn.addEventListener('click', closeModals);
reviewCloseBtn.addEventListener('click', closeModals);
confirmationCloseBtn.addEventListener('click', closeModals);
confirmationOkBtn.addEventListener('click', closeModals);

// Review booking before submission
reviewBookingBtn.addEventListener('click', function() {
    // Get form data
    const formData = {
        package: packageNameInput.value,
        name: bookingForm.bookingName.value,
        email: bookingForm.bookingEmail.value,
        phone: bookingForm.bookingPhone.value,
        checkin: bookingForm.bookingCheckin.value,
        checkout: bookingForm.bookingCheckout.value,
        guests: bookingForm.bookingGuests.value,
        notes: bookingForm.bookingNotes.value || 'Keine'
    };
    
    // Update review modal
    document.getElementById('reviewPackage').textContent = formData.package;
    document.getElementById('reviewName').textContent = formData.name;
    document.getElementById('reviewEmail').textContent = formData.email;
    document.getElementById('reviewPhone').textContent = formData.phone || 'Nicht angegeben';
    document.getElementById('reviewCheckin').textContent = formData.checkin;
    document.getElementById('reviewCheckout').textContent = formData.checkout;
    document.getElementById('reviewGuests').textContent = formData.guests;
    document.getElementById('reviewNotes').textContent = formData.notes;
    
    // Hide booking modal and show review modal
    bookingModal.classList.remove('active');
    reviewModal.classList.add('active');
});

// Edit booking
editBookingBtn.addEventListener('click', function() {
    reviewModal.classList.remove('active');
    bookingModal.classList.add('active');
});

// Confirm booking
confirmBookingBtn.addEventListener('click', function() {
    // Validate dates
    const checkin = new Date(bookingForm.bookingCheckin.value);
    const checkout = new Date(bookingForm.bookingCheckout.value);
    
    if (checkin >= checkout) {
        alert('Check-out Datum muss nach dem Check-in Datum liegen.');
        reviewModal.classList.remove('active');
        bookingModal.classList.add('active');
        return;
    }
    
    // Calculate number of nights
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
        name: bookingForm.bookingName.value,
        email: bookingForm.bookingEmail.value,
        phone: bookingForm.bookingPhone.value,
        checkin: formatDate(bookingForm.bookingCheckin.value),
        checkout: formatDate(bookingForm.bookingCheckout.value),
        nights: nights,
        guests: bookingForm.bookingGuests.value,
        notes: bookingForm.bookingNotes.value,
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
    bookingForm.reset();
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

// Slider Functionality
function moveSlide(direction, sectionId) {
    const slider = document.getElementById(`${sectionId}-slider`);
    const card = slider.querySelector('.feature-card');
    const cardWidth = card.offsetWidth;
    const gap = 32; // 2rem gap in pixels
    const scrollAmount = (cardWidth + gap) * direction;
    
    slider.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// Initialize sliders with proper event listeners
document.addEventListener('DOMContentLoaded', function() {
    const sliders = ['coworking-slider', 'kultur-slider', 'aktivitaeten-slider', 'uebernachtung-slider'];
    
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            // Add touch events for mobile
            let isDown = false;
            let startX;
            let scrollLeft;

            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
                slider.style.cursor = 'grabbing';
            });

            slider.addEventListener('mouseleave', () => {
                isDown = false;
                slider.style.cursor = 'grab';
            });

            slider.addEventListener('mouseup', () => {
                isDown = false;
                slider.style.cursor = 'grab';
            });

            slider.addEventListener('mousemove', (e) => {
                if(!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 2; // Scroll speed
                slider.scrollLeft = scrollLeft - walk;
            });

            // Touch events
            slider.addEventListener('touchstart', (e) => {
                isDown = true;
                startX = e.touches[0].pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });

            slider.addEventListener('touchend', () => {
                isDown = false;
            });

            slider.addEventListener('touchmove', (e) => {
                if(!isDown) return;
                e.preventDefault();
                const x = e.touches[0].pageX - slider.offsetLeft;
                const walk = (x - startX) * 2;
                slider.scrollLeft = scrollLeft - walk;
            });
        }
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (mainNav.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
