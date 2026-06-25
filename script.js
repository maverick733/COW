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

// Card Detail Modal - mit Navigation zwischen den kulturellen Highlights
const cardDetailModal = document.getElementById('cardDetailModal');
const cardModalCloseBtn = document.getElementById('cardModalCloseBtn');
const cardDetailContent = document.getElementById('cardDetailContent');
const openCardBtns = document.querySelectorAll('.open-card-btn');
const modalPrevBtn = document.getElementById('modalPrevBtn');
const modalNextBtn = document.getElementById('modalNextBtn');
const modalCounter = document.getElementById('modalCounter');

// Alle kulturellen Karten sammeln (nur die mit data-card-id und data-full-text)
let cultureCards = [];
let currentCardIndex = 0;

function updateCultureCards() {
    // Nur Karten aus der Kultur-Sektion sammeln
    const kulturSection = document.getElementById('kultur');
    cultureCards = Array.from(kulturSection.querySelectorAll('.feature-card[data-card-id][data-full-text]'));
}

function getCardData(card) {
    const title = card.querySelector('.feature-title').textContent;
    const imgSrc = card.querySelector('.feature-img img').src;
    const fullText = card.getAttribute('data-full-text') || card.querySelector('.feature-text').textContent;
    return { title, imgSrc, fullText };
}

function renderCardDetail(card) {
    if (!card) return;
    
    const data = getCardData(card);
    
    cardDetailContent.innerHTML = `
        <div class="card-detail-img">
            <img src="${data.imgSrc}" alt="${data.title}">
        </div>
        <div class="card-detail-text">
            <h3>${data.title}</h3>
            <p style="white-space: pre-wrap; line-height: 1.8;">${data.fullText}</p>
            <button class="btn" style="margin-top: 1rem;">Jetzt buchen</button>
        </div>
    `;
    
    // Counter aktualisieren
    const total = cultureCards.length;
    modalCounter.textContent = `${currentCardIndex + 1} / ${total}`;
    
    // Navigation Buttons anzeigen/ausblenden
    modalPrevBtn.style.visibility = currentCardIndex > 0 ? 'visible' : 'hidden';
    modalNextBtn.style.visibility = currentCardIndex < total - 1 ? 'visible' : 'hidden';
}

function openCardDetail(cardId) {
    // Kulturelle Karten aktualisieren
    updateCultureCards();
    
    // Karte finden
    const card = document.querySelector(`.feature-card[data-card-id="${cardId}"]`);
    if (!card) return;
    
    // Prüfen ob es eine Kultur-Karte ist
    const isCultureCard = card.hasAttribute('data-full-text');
    if (isCultureCard) {
        currentCardIndex = cultureCards.indexOf(card);
        if (currentCardIndex === -1) {
            // Falls die Karte nicht in der Liste ist, neu laden
            updateCultureCards();
            currentCardIndex = cultureCards.indexOf(card);
        }
        renderCardDetail(card);
    } else {
        // Normale Karte (nicht Kultur)
        const title = card.querySelector('.feature-title').textContent;
        const imgSrc = card.querySelector('.feature-img img').src;
        const text = card.querySelector('.feature-text').textContent;
        
        cardDetailContent.innerHTML = `
            <div class="card-detail-img">
                <img src="${imgSrc}" alt="${title}">
            </div>
            <div class="card-detail-text">
                <h3>${title}</h3>
                <p style="white-space: pre-wrap; line-height: 1.8;">${text}</p>
                <button class="btn" style="margin-top: 1rem;">Jetzt buchen</button>
            </div>
        `;
        
        // Navigation für nicht-Kultur-Karten ausblenden
        modalPrevBtn.style.visibility = 'hidden';
        modalNextBtn.style.visibility = 'hidden';
        modalCounter.textContent = '';
    }
    
    cardDetailModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeCardDetail() {
    cardDetailModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Navigation innerhalb des Modals
function navigateModal(direction) {
    const total = cultureCards.length;
    let newIndex = currentCardIndex + direction;
    
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= total) newIndex = total - 1;
    
    if (newIndex !== currentCardIndex) {
        currentCardIndex = newIndex;
        const card = cultureCards[currentCardIndex];
        if (card) {
            renderCardDetail(card);
            // Kleine Animation für flüssigen Übergang
            cardDetailContent.style.opacity = '0';
            setTimeout(() => {
                cardDetailContent.style.opacity = '1';
            }, 100);
        }
    }
}

modalPrevBtn.addEventListener('click', () => navigateModal(-1));
modalNextBtn.addEventListener('click', () => navigateModal(1));

// Tastatursteuerung für Modal-Navigation
document.addEventListener('keydown', (e) => {
    if (cardDetailModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateModal(1);
        }
    }
});

// Open card buttons
openCardBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.feature-card');
        if (card) {
            const cardId = card.getAttribute('data-card-id');
            openCardDetail(cardId);
        }
    });
});

cardModalCloseBtn.addEventListener('click', closeCardDetail);

cardDetailModal.addEventListener('click', (e) => {
    if (e.target === cardDetailModal) {
        closeCardDetail();
    }
});

// Schließen mit Escape-Taste
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cardDetailModal.classList.contains('active')) {
        closeCardDetail();
    }
});

// Initial: Kulturelle Karten sammeln
document.addEventListener('DOMContentLoaded', () => {
    updateCultureCards();
});

// Mobile Ad Popup
const mobileAdModal = document.getElementById('mobileAdModal');
const adCloseBtn = document.getElementById('adCloseBtn');
const adActionBtn = document.getElementById('adActionBtn');

function showMobileAd() {
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            mobileAdModal.classList.add('active');
        }, 10000);
    }
}

function closeMobileAd() {
    mobileAdModal.classList.remove('active');
}

adCloseBtn.addEventListener('click', closeMobileAd);
adActionBtn.addEventListener('click', () => {
    closeMobileAd();
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
const reviewReservationBtn = document.getElementById('reviewReservationBtn');
const editReservationBtn = document.getElementById('editReservationBtn');
const confirmReservationBtn = document.getElementById('confirmReservationBtn');

// Package tabs
packageTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const packageId = btn.getAttribute('data-package');
        
        packageTabBtns.forEach(btn => btn.classList.remove('active'));
        packageContents.forEach(content => content.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${packageId}-packages`).classList.add('active');
    });
});

// Open reservation modal
packageReserveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const packageName = btn.getAttribute('data-package');
        packageNameInput.value = packageName;
        reservationModal.classList.add('active');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        
        if (window.innerWidth <= 768) {
            const formContainer = document.querySelector('.landscape-form');
            if (formContainer) {
                formContainer.scrollTo(0, 0);
            }
        }
    });
});

// Close modals
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

[reservationModal, reviewModal, confirmationModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModals();
        }
    });
});

// Review reservation button
reviewReservationBtn.addEventListener('click', function() {
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
    
    const checkin = new Date(form.reservationCheckin.value);
    const checkout = new Date(form.reservationCheckout.value);
    
    if (checkin >= checkout) {
        alert('Check-out Datum muss nach dem Check-in Datum liegen.');
        form.reservationCheckout.style.borderColor = 'red';
        return;
    }
    
    document.getElementById('reviewPackage').textContent = packageNameInput.value;
    document.getElementById('reviewName').textContent = form.reservationName.value;
    document.getElementById('reviewEmail').textContent = form.reservationEmail.value;
    document.getElementById('reviewPhone').textContent = form.reservationPhone.value || '-';
    document.getElementById('reviewGuests').textContent = form.reservationGuests.value;
    document.getElementById('reviewCheckin').textContent = new Date(form.reservationCheckin.value).toLocaleDateString('de-DE');
    document.getElementById('reviewCheckout').textContent = new Date(form.reservationCheckout.value).toLocaleDateString('de-DE');
    document.getElementById('reviewNotes').textContent = form.reservationNotes.value || '-';
    
    reservationModal.classList.remove('active');
    reviewModal.classList.add('active');
    
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
    
    const checkin = new Date(form.reservationCheckin.value);
    const checkout = new Date(form.reservationCheckout.value);
    const timeDiff = checkout - checkin;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    const reservationNumber = 'BM-' + Math.floor(100000 + Math.random() * 900000);
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('de-DE', options);
    };
    
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
    
    document.getElementById('confirmedPackage').textContent = formData.package;
    document.getElementById('reservationNumber').textContent = formData.reservationNumber;
    document.getElementById('confirmedCheckin').textContent = formData.checkin;
    document.getElementById('confirmedCheckout').textContent = formData.checkout;
    document.getElementById('confirmedNights').textContent = formData.nights;
    document.getElementById('confirmedGuests').textContent = formData.guests;
    
    sendReservationEmail(formData);
    
    reviewModal.classList.remove('active');
    confirmationModal.classList.add('active');
    
    form.reset();
    
    if (window.innerWidth <= 768) {
        const confirmationContainer = document.querySelector('.confirmation-modal .landscape-form');
        if (confirmationContainer) {
            confirmationContainer.scrollTo(0, 0);
        }
    }
});

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

fetchAndUpdatePrices();
setInterval(fetchAndUpdatePrices, 60000);

// Better mobile input handling
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            document.body.style.zoom = '100%';
        }
    }, { passive: true });
    
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
    
    heroSlider();
    updateCultureCards();
    
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
    
    showMobileAd();
});
