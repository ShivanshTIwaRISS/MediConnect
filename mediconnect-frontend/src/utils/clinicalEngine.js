/**
 * Offline Clinical & Platform Navigation Engine
 * 
 * This is the fallback when the backend AI service is unreachable.
 * Default language: English.
 * If user speaks in Hindi/Hinglish, switches to Hinglish.
 */

// ─── Role-specific navigation maps ──────────────────────────────────────────

const PATIENT_NAV = {
    findDoctors: '**Find Doctors** — Browse all verified specialists, filter by specialization, and view their profiles.',
    bookAppointment: '**Book Appointment** — Select a doctor, pick a date and time slot, and submit your consultation request.',
    myAppointments: '**My Appointments** — View all your scheduled, pending, and past appointments.',
    profile: '**Profile & Settings** — Update your personal information and preferences.',
};

const DOCTOR_NAV = {
    appointmentRequests: '**Appointment Requests** — Review, approve, or decline incoming patient consultation requests.',
    consultationHistory: '**Consultation History** — View all past patient consultations and their details.',
    profile: '**Profile & Settings** — Update your specialization, fees, availability schedule, and bio.',
};

const ADMIN_NAV = {
    manageDoctors: '**Manage Doctors** — Review pending doctor applications, approve or block doctor accounts.',
    manageUsers: '**Manage Users** — View and manage all registered patients and doctors on the platform.',
    allAppointments: '**All Appointments** — Monitor all platform-wide appointments and their statuses.',
};

// ─── Hinglish symptom keyword mappings ───────────────────────────────────────

const HINGLISH_SYMPTOM_MAP = {
    'bukhar': 'fever', 'bukhaar': 'fever', 'buhaar': 'fever',
    'sardi': 'cold', 'sardee': 'cold', 'khansi': 'cough', 'khaansi': 'cough',
    'zukaam': 'cold', 'tabiyat kharab': 'unwell', 'tabiyat': 'unwell',
    'accha nhi': 'unwell', 'acha nhi': 'unwell', 'achha nahi': 'unwell',
    'theek nahi': 'unwell', 'thik nahi': 'unwell', 'bimar': 'sick',
    'sir dard': 'headache', 'sar dard': 'headache', 'chakkar': 'dizziness',
    'pet dard': 'stomach pain', 'ulti': 'nausea', 'dast': 'diarrhea',
    'khujli': 'itching', 'daag': 'skin marks', 'daane': 'pimples',
    'haddi': 'bone pain', 'jodon': 'joint', 'kamar dard': 'back pain', 'ghutne': 'knee',
    'aankh': 'eye', 'nazar': 'vision', 'daant': 'tooth',
    'tension': 'stress', 'neend nahi': 'insomnia', 'neend nhi': 'insomnia',
    'ghabrahat': 'anxiety', 'udaas': 'depression', 'mahila rog': 'gynecology',
    'bachche': 'pediatric', 'kaan': 'ear', 'naak': 'nose', 'gala': 'throat',
    'seene me dard': 'chest pain', 'doctor chahiye': 'need doctor', 'doctor dikhao': 'find doctor',
    'kya haal': 'greeting', 'kaise ho': 'greeting', 'namaskar': 'greeting', 'shukriya': 'thanks', 'dhanyawaad': 'thanks'
};

// ─── Main response generator ─────────────────────────────────────────────────

export const generateSmartResponse = (userQuery = '', role = 'patient', userName = 'User') => {
    const raw = (userQuery || '').trim();
    const q = raw.toLowerCase();

    // Detect Hinglish
    let isHinglish = false;
    let normalizedQuery = q;
    
    for (const [hinglish, english] of Object.entries(HINGLISH_SYMPTOM_MAP)) {
        if (q.includes(hinglish)) {
            normalizedQuery = normalizedQuery.replace(hinglish, english);
            isHinglish = true;
        }
    }

    // ── 1. Gratitude & Pleasantries ──
    if (/^(thanks|thank you|thx|ty|thank u|appreciate|awesome|great|perfect|cool|ok thanks|okay thanks|got it|understood|good|shukriya|dhanyavaad|dhanyawad)/i.test(q)) {
        if (isHinglish) {
            if (role === 'doctor') return `You're welcome, Dr. ${userName}! 😊 Practice management mein koi bhi help chahiye toh poochiye.`;
            if (role === 'admin') return `You're welcome, ${userName}! 😊 Operations mein help ke liye main yahaan hoon.`;
            return `Koi baat nahi, ${userName}! 😊 Apna khayal rakhiye aur jab bhi zaroorat ho, poochiye!`;
        }
        if (role === 'doctor') return `You're welcome, Dr. ${userName}! 😊 I'm always here to assist with your MediConnect practice.`;
        if (role === 'admin') return `You're welcome, ${userName}! 😊 Feel free to ask anytime for administrative assistance.`;
        return `You're very welcome, ${userName}! 😊 Take care and let me know if you need anything else.`;
    }

    // ── 2. Greetings ──
    if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|namaste|hola|yo|kya haal|kaise ho|namaskar)\b/i.test(q)) {
        if (isHinglish) {
            if (role === 'doctor') return `Namaste Dr. ${userName}! 👋\n\nMain aapka MediConnect Clinical Assistant hoon. Yeh raha aapka menu:\n\n• ${DOCTOR_NAV.appointmentRequests}\n• ${DOCTOR_NAV.consultationHistory}\n• ${DOCTOR_NAV.profile}`;
            if (role === 'admin') return `Welcome Administrator ${userName}! 🛡️\n\nMain aapka MediConnect Operations Assistant hoon:\n\n• ${ADMIN_NAV.manageDoctors}\n• ${ADMIN_NAV.manageUsers}\n• ${ADMIN_NAV.allAppointments}`;
            return `Hello ${userName}! 👋\n\nMain aapka MediConnect Health Assistant hoon. Batao, kya help chahiye?\n\n• ${PATIENT_NAV.findDoctors}\n• ${PATIENT_NAV.bookAppointment}\n• ${PATIENT_NAV.myAppointments}`;
        }
        if (role === 'doctor') {
            return `Hello Dr. ${userName}! 👋\n\nI'm your MediConnect Clinical Assistant. Here is your quick menu:\n\n• ${DOCTOR_NAV.appointmentRequests}\n• ${DOCTOR_NAV.consultationHistory}\n• ${DOCTOR_NAV.profile}\n\nHow can I assist you today?`;
        }
        if (role === 'admin') {
            return `Welcome Administrator ${userName}! 🛡️\n\nI'm your MediConnect Operations Assistant:\n\n• ${ADMIN_NAV.manageDoctors}\n• ${ADMIN_NAV.manageUsers}\n• ${ADMIN_NAV.allAppointments}\n\nWhich operation would you like to review?`;
        }
        return `Hello ${userName}! 👋\n\nI'm your MediConnect Health Assistant. How can I help you today?\n\n• ${PATIENT_NAV.findDoctors}\n• ${PATIENT_NAV.bookAppointment}\n• ${PATIENT_NAV.myAppointments}\n\nWhat would you like to explore?`;
    }

    // ── 3. Symptom / Doctor / Specialist Queries ──
    const symptomKeywords = ['heart', 'cardio', 'chest pain', 'blood pressure', 'skin', 'acne', 'rash', 'eczema', 'brain', 'headache', 'migraine', 'nerve', 'mental', 'anxiety', 'stress', 'depress', 'stomach', 'digest', 'acid', 'nausea', 'bone', 'joint', 'knee', 'back pain', 'spine', 'eye', 'vision', 'tooth', 'dental', 'child', 'pediatric', 'fever', 'cold', 'cough', 'flu', 'infection', 'gynecology', 'women', 'pregnancy', 'doctor', 'specialist', 'suggest', 'recommend', 'need a', 'unwell', 'sick', 'dizziness', 'itching', 'ear', 'nose', 'throat', 'need doctor', 'find doctor', 'need specialist'];
    
    const isSymptomQuery = symptomKeywords.some(kw => normalizedQuery.includes(kw));
    
    if (isSymptomQuery) {
        if (isHinglish) {
            if (role === 'doctor') return `Doctor sahab, aap ${DOCTOR_NAV.appointmentRequests} aur ${DOCTOR_NAV.consultationHistory} access kar sakte hain.`;
            if (role === 'admin') return `Admin portal mein saare doctors ${ADMIN_NAV.manageDoctors} mein listed hain.`;
            return `Chinta mat karo ${userName}, main aapko sahi specialist dhundhne mein help karta hoon! 🩺\n\n👉 Left sidebar mein ${PATIENT_NAV.findDoctors} pe jao — wahaan saare verified specialists milenge. Specialization ke hisaab se filter kar sakte ho.\n\nDoctor mil jaaye toh ${PATIENT_NAV.bookAppointment} se consultation schedule karo.`;
        }
        if (role === 'doctor') {
            return `As a medical professional, you can manage consultations in ${DOCTOR_NAV.appointmentRequests} and review past visits in ${DOCTOR_NAV.consultationHistory}.`;
        }
        if (role === 'admin') {
            return `You can view all registered specialists and manage their profiles under ${ADMIN_NAV.manageDoctors}.`;
        }
        return `I'm here to help you find the right specialist! 🩺\n\nPlease navigate to ${PATIENT_NAV.findDoctors} in the left sidebar to browse our accredited specialists by medical specialty.\n\nOnce you select a physician, you can use ${PATIENT_NAV.bookAppointment} to schedule your consultation slot.`;
    }

    // ── 4. Booking & Appointments ──
    if (q.includes('book') || q.includes('schedule') || q.includes('appointment') || q.includes('slot')) {
        if (isHinglish) {
            return `📅 **Appointment Booking:**\n\n1. Sidebar se ${PATIENT_NAV.findDoctors} pe jao\n2. Specialist choose karo\n3. Slot aur date pick karke booking confirm karo\n\nAapka appointment status ${PATIENT_NAV.myAppointments} mein show hoga.`;
        }
        if (role === 'doctor') {
            return `📅 **Managing Appointments:**\n\n• ${DOCTOR_NAV.appointmentRequests} — Review pending patient bookings\n• ${DOCTOR_NAV.profile} — Adjust active consultation days & hours\n• ${DOCTOR_NAV.consultationHistory} — Past consultation records`;
        }
        if (role === 'admin') {
            return `📅 **Platform Appointments:**\n\n• ${ADMIN_NAV.allAppointments} — Monitor all platform consultations\n• ${ADMIN_NAV.manageDoctors} — Manage credentialed doctors`;
        }
        return `📅 **How to Book a Consultation:**\n\n1. Click ${PATIENT_NAV.findDoctors} in the sidebar\n2. Select a physician matching your requirements\n3. Pick your preferred date and available time slot\n4. Enter your consultation reason and click **Confirm Booking**\n\nYou can track all your visits in ${PATIENT_NAV.myAppointments}.`;
    }

    // ── 5. Default Guidance ──
    if (isHinglish) {
        return `Main MediConnect platform mein aapki help ke liye yahaan hoon, ${userName}! 😊\n\n• ${PATIENT_NAV.findDoctors}\n• ${PATIENT_NAV.bookAppointment}\n• ${PATIENT_NAV.myAppointments}`;
    }
    if (role === 'doctor') {
        return `I'm here to assist with your MediConnect clinical practice, Dr. ${userName}!\n\n• ${DOCTOR_NAV.appointmentRequests}\n• ${DOCTOR_NAV.consultationHistory}\n• ${DOCTOR_NAV.profile}`;
    }
    if (role === 'admin') {
        return `I'm here to help with MediConnect platform operations, Administrator ${userName}!\n\n• ${ADMIN_NAV.manageDoctors}\n• ${ADMIN_NAV.manageUsers}\n• ${ADMIN_NAV.allAppointments}`;
    }
    return `I'm here to help you get the best healthcare experience on MediConnect, ${userName}!\n\n• ${PATIENT_NAV.findDoctors}\n• ${PATIENT_NAV.bookAppointment}\n• ${PATIENT_NAV.myAppointments}\n\nFeel free to ask any question about doctors, symptoms, or appointments!`;
};
