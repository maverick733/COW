// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
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
                mainNav.classList.remove('active');
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
const confirmationModal = document.getElementById('confirmationModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const confirmationCloseBtn = document.getElementById('confirmationCloseBtn');
const confirmationOkBtn = document.getElementById('confirmationOkBtn');
const bookingForm = document.getElementById('bookingForm');
const packageNameInput = document.getElementById('packageName');
const confirmedPackageSpan = document.getElementById('confirmedPackage');
const reservationNumberSpan = document.getElementById('reservationNumber');

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
    confirmationModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

modalCloseBtn.addEventListener('click', closeModals);
confirmationCloseBtn.addEventListener('click', closeModals);
confirmationOkBtn.addEventListener('click', closeModals);

// Booking form submission
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate dates
    const checkin = new Date(this.bookingCheckin.value);
    const checkout = new Date(this.bookingCheckout.value);
    
    if (checkin >= checkout) {
        alert('Check-out Datum muss nach dem Check-in Datum liegen.');
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
        name: this.bookingName.value,
        email: this.bookingEmail.value,
        phone: this.bookingPhone.value,
        checkin: formatDate(this.bookingCheckin.value),
        checkout: formatDate(this.bookingCheckout.value),
        nights: nights,
        guests: this.bookingGuests.value,
        notes: this.bookingNotes.value,
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
    
    // Hide booking modal and show confirmation
    bookingModal.classList.remove('active');
    confirmationModal.classList.add('active');
    
    // Reset form
    this.reset();
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


// Function to send booking email (simulated with EmailJS or could be replaced with actual API call)
function sendBookingEmail(data) {
    const emailContent = `
        Neue Buchung bei BM-Coworking:
        
        Paket: ${data.package}
        Name: ${data.name}
        Email: ${data.email}
        Telefon: ${data.phone}
        Datum: ${data.date}
        Besondere Anforderungen: ${data.notes}
        Reservierungsnummer: ${data.reservationNumber}
    `;
    
    // In a real implementation, you would use EmailJS or a backend service
    console.log('Email would be sent to issiman@protonmail.com with content:', emailContent);
    
    // For demo purposes, we'll just log it
    // In production, you would replace this with actual email sending code
    // For example using EmailJS:
    /*
    emailjs.send('service_id', 'template_id', {
        to_email: 'issiman@protonmail.com',
        from_name: 'BM-Coworking Buchungssystem',
        message: emailContent
    });
    */
}

// Hintergrundbilder initialisieren
document.querySelectorAll('[data-bg-image]').forEach(section => {
    section.style.backgroundImage = section.getAttribute('data-bg-image');
    section.classList.add('section-with-bg');
});

// Fetch and update prices from Excel
async function fetchAndUpdatePrices() {
    try {
        const response = await fetch('/api/prices');
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

// Optional: Update prices periodically
setInterval(fetchAndUpdatePrices, 60000); // Update every minute

async function fetchAndUpdatePrices() {
    try {
        const response = await fetch('/api/prices');
        if (!response.ok) throw new Error('Network response was not ok');
        const prices = await response.json();
        // ... rest of the function
    } catch (error) {
        console.error('Error fetching prices:', error);
        // Optional: Show user-friendly error message
    }
}

// Slider Functionality - Updated version
function moveSlide(direction, sectionId) {
    const slider = document.getElementById(`${sectionId}-slider`);
    const cardWidth = slider.querySelector('.feature-card').offsetWidth;
    const gap = 32; // 2rem gap in pixels
    const scrollAmount = (cardWidth + gap) * direction;
    
    slider.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// Initialize sliders with proper event listeners
document.addEventListener('DOMContentLoaded', function() {
    const sliders = ['coworking-slider', 'kultur-wassersport-slider'];
    
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
            });

            slider.addEventListener('mouseleave', () => {
                isDown = false;
            });

            slider.addEventListener('mouseup', () => {
                isDown = false;
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
