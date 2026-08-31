/**
 * Offline Clinical & Platform Navigation Engine
 * 
 * This is the LAST-RESORT fallback when the backend AI service is unreachable.
 * It provides role-aware platform navigation guidance WITHOUT mentioning any
 * specific doctor names, fees, or data — because it has NO database access.
 * 
 * All doctor-specific recommendations come ONLY from the backend AI route
 * which fetches real data from the database.
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

// ─── Main response generator ─────────────────────────────────────────────────

export const generateSmartResponse = (userQuery = '', role = 'patient', userName = 'User') => {
    const raw = (userQuery || '').trim();
    const q = raw.toLowerCase();

    // ── 1. Gratitude & Pleasantries ──
    if (/^(thanks|thank you|thx|ty|thank u|appreciate|awesome|great|perfect|cool|ok thanks|okay thanks|got it|understood|good)/i.test(q)) {
        if (role === 'doctor') return `You're welcome, Dr. ${userName}! 😊 I'm here whenever you need help managing your practice on MediConnect.`;
        if (role === 'admin') return `You're welcome, ${userName}! 😊 I'm here to help with any platform administration tasks.`;
        return `You're welcome, ${userName}! 😊 I'm always here to help you navigate MediConnect and find the right care.`;
    }

    // ── 2. Greetings ──
    if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|namaste|hola|yo)\b/i.test(q)) {
        if (role === 'doctor') {
            return `Hello Dr. ${userName}! 👋\n\nI'm your MediConnect Clinical Assistant. Here's what I can help you with:\n\n• ${DOCTOR_NAV.appointmentRequests}\n• ${DOCTOR_NAV.consultationHistory}\n• ${DOCTOR_NAV.profile}\n\nWhat would you like to do?`;
        }
        if (role === 'admin') {
            return `Welcome Administrator ${userName}! 🛡️\n\nI'm your MediConnect Operations Assistant:\n\n• ${ADMIN_NAV.manageDoctors}\n• ${ADMIN_NAV.manageUsers}\n• ${ADMIN_NAV.allAppointments}\n\nWhat platform operation would you like help with?`;
        }
        return `Hello ${userName}! 👋\n\nI'm your MediConnect Health Assistant. I can help you:\n\n• ${PATIENT_NAV.findDoctors}\n• ${PATIENT_NAV.bookAppointment}\n• ${PATIENT_NAV.myAppointments}\n\nWhat would you like to explore today?`;
    }

    // ── 3. About MediConnect / Platform Inquiries ──
    if (q.includes('about this platform') || q.includes('about platform') || q.includes('what is this') || q.includes('what is mediconnect') || q.includes('how does this work') || q.includes('how does mediconnect work') || q.includes('tell me about this') || q.includes('features') || q.includes('what can you do')) {
        return `🏥 **About MediConnect**\n\nMediConnect is a digital healthcare platform connecting patients with verified medical specialists.\n\n**Key Features:**\n• **Specialist Directory** — Browse verified doctors across multiple medical fields\n• **Instant Booking** — Schedule consultations by selecting available time slots\n• **Role-Based Portals:**\n  - **Patients:** Find doctors, book appointments, track visit history\n  - **Doctors:** Manage appointment requests, set availability, view consultations\n  - **Admins:** Verify doctors, manage users, monitor platform activity\n• **Theme Support** — Switch between Dark and Light modes\n\nWould you like help with a specific feature?`;
    }

    // ── 4. Symptom / Doctor / Specialist Queries ──
    // Without DB access, we guide them to the Find Doctors section instead of inventing names
    const symptomKeywords = ['heart', 'cardio', 'chest pain', 'blood pressure', 'skin', 'acne', 'rash', 'eczema', 'brain', 'headache', 'migraine', 'nerve', 'mental', 'anxiety', 'stress', 'depress', 'therapy', 'stomach', 'digest', 'acid', 'nausea', 'bone', 'joint', 'knee', 'back pain', 'spine', 'eye', 'vision', 'tooth', 'dental', 'child', 'pediatric', 'fever', 'cold', 'cough', 'flu', 'infection', 'gynecology', 'women', 'pregnancy', 'doctor', 'specialist', 'suggest', 'recommend', 'need a'];
    
    const isSymptomQuery = symptomKeywords.some(kw => q.includes(kw));
    
    if (isSymptomQuery) {
        if (role === 'doctor') {
            return `As a doctor on MediConnect, you can:\n\n• View your incoming consultation requests in ${DOCTOR_NAV.appointmentRequests}\n• Review patient history in ${DOCTOR_NAV.consultationHistory}\n\nFor clinical references, please consult your professional medical resources.`;
        }
        if (role === 'admin') {
            return `As an administrator, you can view all doctors and their specializations in ${ADMIN_NAV.manageDoctors}.\n\nFor specific doctor listings and patient-facing features, please check the platform from a patient account.`;
        }
        return `I'd love to help you find the right specialist! 🩺\n\nPlease go to ${PATIENT_NAV.findDoctors} in the left sidebar to browse all our **verified specialists**. You can filter by specialization to find exactly the right doctor for your needs.\n\nOnce you find a doctor, use ${PATIENT_NAV.bookAppointment} to schedule a consultation.\n\n💡 *I'm currently in offline mode, so I can't show specific doctor details right now. The Find Doctors page has the complete, up-to-date directory.*`;
    }

    // ── 5. Booking & Appointment Queries ──
    if (q.includes('book') || q.includes('schedule') || q.includes('how to book') || q.includes('appointment') || q.includes('slot')) {
        if (role === 'doctor') {
            return `📅 **Managing Your Appointments:**\n\n• ${DOCTOR_NAV.appointmentRequests} — Approve or decline patient booking requests\n• ${DOCTOR_NAV.profile} — Adjust your available consultation days and hours\n• ${DOCTOR_NAV.consultationHistory} — Review past completed consultations`;
        }
        if (role === 'admin') {
            return `📅 **Platform Appointment Management:**\n\n• ${ADMIN_NAV.allAppointments} — View and monitor all appointments across the platform\n• ${ADMIN_NAV.manageDoctors} — Ensure doctors are verified before they can receive bookings`;
        }
        return `📅 **How to Book a Consultation:**\n\n1. Click ${PATIENT_NAV.findDoctors} from the left sidebar\n2. Browse specialists and select one that matches your needs\n3. Pick a date and an available time slot\n4. Enter your reason for consultation\n5. Click **Confirm & Request Consultation**\n\nYou can track your booking status in ${PATIENT_NAV.myAppointments}.`;
    }

    // ── 6. Pricing & Fees ──
    if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('charge') || q.includes('how much') || q.includes('rate')) {
        if (role === 'doctor') {
            return `You can update your consultation fees in ${DOCTOR_NAV.profile}. Your current fee is displayed on your doctor profile card visible to patients.`;
        }
        return `💳 **Consultation Fees:**\n\nEach doctor sets their own consultation fee. You can see the exact fee displayed on every doctor's card in ${PATIENT_NAV.findDoctors} before booking.\n\nFees are transparently shown so there are no surprises!`;
    }

    // ── 7. Tracking / Status / Cancel ──
    if (q.includes('my appointment') || q.includes('status') || q.includes('track') || q.includes('history') || q.includes('cancel')) {
        if (role === 'doctor') {
            return `📋 **Your Appointment Management:**\n\n• ${DOCTOR_NAV.appointmentRequests} — Pending patient requests awaiting your review\n• ${DOCTOR_NAV.consultationHistory} — All past completed consultations`;
        }
        if (role === 'admin') {
            return `📋 **Platform Monitoring:**\n\n• ${ADMIN_NAV.allAppointments} — View all appointment statuses platform-wide\n• ${ADMIN_NAV.manageUsers} — Check individual user appointment history`;
        }
        return `📋 **Tracking Your Appointments:**\n\n• Go to ${PATIENT_NAV.myAppointments} from the left sidebar\n• **Pending** — The doctor is reviewing your request\n• **Approved** — Confirmed! Attend at your scheduled time\n• **Rejected** — You can rebook with another slot or specialist\n• **Completed** — Past consultations for your records`;
    }

    // ── 8. Admin-Specific Queries ──
    if (role === 'admin' && (q.includes('doctor') || q.includes('approve') || q.includes('verify') || q.includes('block') || q.includes('pending') || q.includes('user') || q.includes('manage'))) {
        return `🛡️ **Admin Operations:**\n\n• ${ADMIN_NAV.manageDoctors} — Review pending applications, approve verified doctors, or block accounts\n• ${ADMIN_NAV.manageUsers} — Audit all registered users on the platform\n• ${ADMIN_NAV.allAppointments} — Monitor appointment activity across the platform\n\nWhat specific operation would you like help with?`;
    }

    // ── 9. Doctor-Specific Queries ──
    if (role === 'doctor' && (q.includes('patient') || q.includes('request') || q.includes('consultation') || q.includes('schedule') || q.includes('availability') || q.includes('hours'))) {
        return `👨‍⚕️ **Doctor Dashboard Help:**\n\n• ${DOCTOR_NAV.appointmentRequests} — Review and respond to patient booking requests\n• ${DOCTOR_NAV.consultationHistory} — Access complete consultation records\n• ${DOCTOR_NAV.profile} — Update your availability, fees, and professional details\n\nWhat would you like to manage?`;
    }

    // ── 10. Theme & Settings ──
    if (q.includes('theme') || q.includes('dark') || q.includes('light') || q.includes('settings') || q.includes('logout') || q.includes('sign out') || q.includes('password') || q.includes('profile')) {
        const profileNav = role === 'doctor' ? DOCTOR_NAV.profile : PATIENT_NAV.profile;
        return `⚙️ **Settings & Preferences:**\n\n• Go to ${profileNav} from the sidebar\n• Toggle between **Dark** and **Light** modes\n• Update your personal details\n• Sign out securely when needed`;
    }

    // ── 11. Health Tips ──
    if (q.includes('tip') || q.includes('health') || q.includes('diet') || q.includes('water') || q.includes('sleep') || q.includes('exercise')) {
        if (role === 'doctor') {
            return `As a healthcare professional, you're best equipped with clinical knowledge! 😊\n\nIf you need to manage your MediConnect practice:\n• ${DOCTOR_NAV.appointmentRequests}\n• ${DOCTOR_NAV.profile}`;
        }
        return `💡 **Wellness Tips:**\n\n1. **Hydration** — Drink 2.5–3 liters of water daily\n2. **Sleep** — Aim for 7–9 hours of quality sleep\n3. **Exercise** — 30 minutes of daily movement\n4. **Preventative Care** — Schedule regular check-ups\n\nFor personalized advice, consult a specialist via ${PATIENT_NAV.findDoctors}!`;
    }

    // ── 12. Default — Role-Aware Guidance ──
    if (role === 'doctor') {
        return `I'm here to help you manage your MediConnect practice, Dr. ${userName}! Here's what you can ask:\n\n• *"How do I manage appointment requests?"*\n• *"Where can I update my schedule?"*\n• *"Show my consultation history"*\n\n**Quick Navigation:**\n• ${DOCTOR_NAV.appointmentRequests}\n• ${DOCTOR_NAV.consultationHistory}\n• ${DOCTOR_NAV.profile}`;
    }
    if (role === 'admin') {
        return `I'm here to help you manage the MediConnect platform, ${userName}! Here's what you can ask:\n\n• *"How many doctors are pending approval?"*\n• *"How do I manage users?"*\n• *"Show platform appointment overview"*\n\n**Quick Navigation:**\n• ${ADMIN_NAV.manageDoctors}\n• ${ADMIN_NAV.manageUsers}\n• ${ADMIN_NAV.allAppointments}`;
    }
    return `I'm here to help you get the most out of MediConnect, ${userName}! Here's what you can ask:\n\n• *"Find a specialist for my symptoms"*\n• *"How do I book an appointment?"*\n• *"Where can I see my scheduled visits?"*\n• *"How do consultation fees work?"*\n\n**Quick Navigation:**\n• ${PATIENT_NAV.findDoctors}\n• ${PATIENT_NAV.bookAppointment}\n• ${PATIENT_NAV.myAppointments}`;
};
