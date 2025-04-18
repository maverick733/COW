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
});

// Edit booking button
editBookingBtn.addEventListener('click', function() {
    reviewModal.classList.remove('active');
    bookingModal.classList.add('active');
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
