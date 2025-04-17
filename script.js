// ========== KONFIGURATION ========== //
const CONFIG = {
  API_ENDPOINT: 'https://ihre-api-url.de/api',
  DEFAULT_ERROR_MSG: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
  MIN_BOOKING_DAYS: 1,
  MAX_BOOKING_DAYS: 30
};

// ========== STATE MANAGEMENT ========== //
let appState = {
  isLoading: false,
  currentPackage: null,
  bookingDates: {
    checkin: null,
    checkout: null
  }
};

// ========== DOM ELEMENTE ========== //
const elements = {
  // Modale
  bookingModal: document.getElementById('bookingModal'),
  confirmationModal: document.getElementById('confirmationModal'),
  
  // Buttons
  packageBookBtns: document.querySelectorAll('.package-book-btn'),
  modalCloseBtns: document.querySelectorAll('.modal-close-btn'),
  confirmationOkBtn: document.getElementById('confirmationOkBtn'),
  
  // Formular
  bookingForm: document.getElementById('bookingForm'),
  packageNameInput: document.getElementById('packageName'),
  mobilePackageName: document.getElementById('mobilePackageName'),
  
  // Inputs
  checkinInput: document.getElementById('bookingCheckin'),
  checkoutInput: document.getElementById('bookingCheckout'),
  
  // Bestätigungsanzeige
  confirmedPackage: document.getElementById('confirmedPackage'),
  reservationNumber: document.getElementById('reservationNumber'),
  confirmedCheckin: document.getElementById('confirmedCheckin'),
  confirmedCheckout: document.getElementById('confirmedCheckout'),
  confirmedNights: document.getElementById('confirmedNights'),
  confirmedGuests: document.getElementById('confirmedGuests'),
  
  // Loader
  loader: document.getElementById('loader'),
  
  // Fehleranzeige
  errorDisplay: document.getElementById('errorDisplay')
};

// ========== EVENT LISTENER ========== //
function initEventListeners() {
  // Buchungsbuttons
  elements.packageBookBtns.forEach(btn => {
    btn.addEventListener('click', handlePackageSelect);
  });

  // Modal schließen
  elements.modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeModals);
  });
  
  elements.confirmationOkBtn.addEventListener('click', closeModals);

  // Formular
  elements.bookingForm.addEventListener('submit', handleFormSubmit);
  
  // Datumsvalidierung
  elements.checkinInput.addEventListener('change', handleDateChange);
  elements.checkoutInput.addEventListener('change', handleDateChange);
}

// ========== EVENT HANDLER ========== //
function handlePackageSelect(e) {
  const packageName = e.currentTarget.getAttribute('data-package');
  appState.currentPackage = packageName;
  
  elements.packageNameInput.value = packageName;
  elements.mobilePackageName.textContent = packageName;
  
  openModal(elements.bookingModal);
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  try {
    toggleLoading(true);
    
    const bookingData = prepareBookingData();
    const response = await sendBookingToServer(bookingData);
    
    if (response.success) {
      showConfirmation(response.data);
    } else {
      showError(response.message || CONFIG.DEFAULT_ERROR_MSG);
    }
  } catch (error) {
    console.error('Buchungsfehler:', error);
    showError(CONFIG.DEFAULT_ERROR_MSG);
  } finally {
    toggleLoading(false);
  }
}

function handleDateChange() {
  const checkin = new Date(elements.checkinInput.value);
  const checkout = new Date(elements.checkoutInput.value);
  
  appState.bookingDates = { checkin, checkout };
  
  // Check-out automatisch anpassen wenn nötig
  if (checkin && checkout && checkin >= checkout) {
    const newCheckout = new Date(checkin);
    newCheckout.setDate(newCheckout.getDate() + CONFIG.MIN_BOOKING_DAYS);
    elements.checkoutInput.valueAsDate = newCheckout;
    appState.bookingDates.checkout = newCheckout;
  }
}

// ========== BUSINESS LOGIK ========== //
function validateForm() {
  // Reset vorheriger Fehler
  clearError();
  
  const { checkin, checkout } = appState.bookingDates;
  const guests = parseInt(elements.bookingForm.bookingGuests.value);
  
  // Pflichtfelder
  if (!elements.bookingForm.bookingName.value.trim()) {
    showError('Bitte geben Sie Ihren Namen ein');
    return false;
  }
  
  if (!elements.bookingForm.bookingEmail.value.trim()) {
    showError('Bitte geben Sie eine Email-Adresse ein');
    return false;
  }
  
  // Datumsvalidierung
  if (!checkin || !checkout) {
    showError('Bitte wählen Sie Check-in und Check-out Datum');
    return false;
  }
  
  if (checkin >= checkout) {
    showError(`Check-out muss mindestens ${CONFIG.MIN_BOOKING_DAYS} Tag(e) nach Check-in liegen`);
    return false;
  }
  
  const nights = calculateNights(checkin, checkout);
  
  if (nights > CONFIG.MAX_BOOKING_DAYS) {
    showError(`Die maximale Aufenthaltsdauer beträgt ${CONFIG.MAX_BOOKING_DAYS} Tage`);
    return false;
  }
  
  // Gästevalidierung
  if (isNaN(guests) {
    showError('Bitte geben Sie die Anzahl der Gäste an');
    return false;
  }
  
  return true;
}

function prepareBookingData() {
  const { checkin, checkout } = appState.bookingDates;
  const nights = calculateNights(checkin, checkout);
  
  return {
    package: elements.packageNameInput.value,
    name: elements.bookingForm.bookingName.value.trim(),
    email: elements.bookingForm.bookingEmail.value.trim(),
    phone: elements.bookingForm.bookingPhone.value.trim(),
    checkin: checkin.toISOString(),
    checkout: checkout.toISOString(),
    nights,
    guests: parseInt(elements.bookingForm.bookingGuests.value),
    notes: elements.bookingForm.bookingNotes.value.trim(),
    reservationNumber: generateReservationNumber()
  };
}

async function sendBookingToServer(bookingData) {
  try {
    const response = await fetch(`${CONFIG.API_ENDPOINT}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getAuthToken()
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || CONFIG.DEFAULT_ERROR_MSG);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Fehler:', error);
    throw error;
  }
}

// ========== UI FUNKTIONEN ========== //
function showConfirmation(bookingData) {
  elements.confirmedPackage.textContent = bookingData.package;
  elements.reservationNumber.textContent = bookingData.reservationNumber;
  elements.confirmedCheckin.textContent = formatDate(bookingData.checkin);
  elements.confirmedCheckout.textContent = formatDate(bookingData.checkout);
  elements.confirmedNights.textContent = bookingData.nights;
  elements.confirmedGuests.textContent = bookingData.guests;
  
  closeModal(elements.bookingModal);
  openModal(elements.confirmationModal);
  
  // Formular zurücksetzen
  elements.bookingForm.reset();
  appState.bookingDates = { checkin: null, checkout: null };
}

function showError(message) {
  elements.errorDisplay.textContent = message;
  elements.errorDisplay.style.display = 'block';
  
  // Auto-hide nach 5 Sekunden
  setTimeout(clearError, 5000);
}

function clearError() {
  elements.errorDisplay.style.display = 'none';
  elements.errorDisplay.textContent = '';
}

function toggleLoading(isLoading) {
  appState.isLoading = isLoading;
  
  if (isLoading) {
    elements.loader.style.display = 'flex';
    elements.bookingForm.querySelector('button[type="submit"]').disabled = true;
  } else {
    elements.loader.style.display = 'none';
    elements.bookingForm.querySelector('button[type="submit"]').disabled = false;
  }
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  
  // Erst body scrollen erlauben wenn alle Modale geschlossen
  if (!document.querySelector('.modal.active')) {
    document.body.style.overflow = 'auto';
  }
}

function closeModals() {
  closeModal(elements.bookingModal);
  closeModal(elements.confirmationModal);
}

// ========== HELPER FUNKTIONEN ========== //
function calculateNights(checkin, checkout) {
  return Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function generateReservationNumber() {
  return 'BM-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
}

function getAuthToken() {
  // In einer echten App würden Sie das Token aus einem Login-System holen
  return localStorage.getItem('authToken') || '';
}

// ========== INITIALISIERUNG ========== //
function init() {
  // Datumsinputs vorbereiten
  const today = new Date().toISOString().split('T')[0];
  elements.checkinInput.min = today;
  elements.checkoutInput.min = today;
  
  // Event Listener registrieren
  initEventListeners();
  
  console.log('Buchungssystem initialisiert');
}

// Starten der Anwendung
document.addEventListener('DOMContentLoaded', init);
