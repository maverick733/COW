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
    
    // Generate reservation number
    const reservationNumber = 'BM-' + Math.floor(100000 + Math.random() * 900000);
    
    // Get form data
    const formData = {
        package: packageNameInput.value,
        name: this.bookingName.value,
        email: this.bookingEmail.value,
        phone: this.bookingPhone.value,
        date: this.bookingDate.value,
        notes: this.bookingNotes.value,
        reservationNumber: reservationNumber
    };
    
    // Send email (simulated)
    sendBookingEmail(formData);
    
    // Show confirmation
    confirmedPackageSpan.textContent = formData.package;
    reservationNumberSpan.textContent = formData.reservationNumber;
    
    // Show confirmation modal
    bookingModal.classList.remove('active');
    confirmationModal.classList.add('active');
    
    // Reset form
    this.reset();
});

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
