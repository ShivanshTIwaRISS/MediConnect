/**
 * Offline Clinical & Platform Navigation Engine
 * 
 * This is the LAST-RESORT fallback when the backend AI service is unreachable.
 * It provides role-aware platform navigation guidance WITHOUT mentioning any
 * specific doctor names, fees, or data — because it has NO database access.
 * 
 * Now with Hinglish (Hindi + English mix) keyword support.
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
    // Fever / Cold / General
    'bukhar': 'fever', 'bukhaar': 'fever', 'buhaar': 'fever',
    'sardi': 'cold', 'sardee': 'cold',
    'khansi': 'cough', 'khaansi': 'cough',
    'zukaaam': 'cold', 'zukaam': 'cold',
    'tabiyat kharab': 'unwell', 'tabiyat': 'unwell',
    'accha nhi': 'unwell', 'acha nhi': 'unwell', 'achha nahi': 'unwell',
    'theek nahi': 'unwell', 'thik nahi': 'unwell',
    'bimar': 'sick', 'bimaar': 'sick', 'beemaar': 'sick',

    // Head
    'sir dard': 'headache', 'sar dard': 'headache', 'sir me dard': 'headache',
    'chakkar': 'dizziness', 'chakker': 'dizziness',

    // Stomach / Digestion
    'pet dard': 'stomach pain', 'pet me dard': 'stomach pain',
    'gas': 'acidity', 'acidity': 'acidity',
    'ulti': 'nausea', 'ultee': 'nausea',
    'dast': 'diarrhea', 'loose motion': 'diarrhea',

    // Skin
    'khujli': 'itching', 'khujlee': 'itching',
    'daag': 'skin marks', 'daane': 'pimples',
    'chamdi': 'skin',

    // Bone / Joint
    'haddi': 'bone pain', 'haddee': 'bone pain',
    'jodon': 'joint', 'jodon ka dard': 'joint pain', 'jodon me dard': 'joint pain',
    'kamar dard': 'back pain', 'kamar me dard': 'back pain',
    'ghutne': 'knee', 'ghutne me dard': 'knee pain',

    // Eyes
    'aankh': 'eye', 'aankhon': 'eye', 'aankh me': 'eye problem',
    'nazar': 'vision',

    // Dental
    'daant': 'tooth', 'daant me dard': 'toothache', 'dant': 'tooth',

    // Mental health
    'tension': 'stress', 'neend nahi': 'insomnia', 'neend nhi': 'insomnia',
    'ghabrahat': 'anxiety', 'dar': 'anxiety',
    'udaas': 'depression', 'udaasi': 'depression',

    // Women health
    'mahila rog': 'gynecology', 'periods': 'gynecology',

    // Children
    'bachche': 'pediatric', 'bachche ki': 'pediatric', 'bacche': 'pediatric',

    // ENT
    'kaan': 'ear', 'naak': 'nose', 'gala': 'throat', 'gale me dard': 'sore throat',

    // Heart
    'dil': 'heart', 'seene me dard': 'chest pain', 'chest': 'chest pain',
    'bp': 'blood pressure',

    // General queries
    'doctor chahiye': 'need doctor', 'doctor dikhao': 'find doctor',
    'specialist chahiye': 'need specialist',
};

// ─── Main response generator ─────────────────────────────────────────────────

export const generateSmartResponse = (userQuery = '', role = 'patient', userName = 'User') => {
    const raw = (userQuery || '').trim();
    const q = raw.toLowerCase();

    // ── 0. Detect Hinglish and normalize ──
    let isHinglish = false;
    let normalizedQuery = q;
    
    for (const [hinglish, english] of Object.entries(HINGLISH_SYMPTOM_MAP)) {
        if (q.includes(hinglish)) {
            normalizedQuery = normalizedQuery.replace(hinglish, english);
            isHinglish = true;
        }
    }

    // ── 1. Gratitude & Pleasantries ──
    if (/^(thanks|thank you|thx|ty|thank u|appreciate|awesome|great|perfect|cool|ok thanks|okay thanks|got it|understood|good|shukriya|dhanyavaad|dhanyawad|bahut accha)/i.test(q)) {
        if (role === 'doctor') return `You're welcome, Dr. ${userName}! 😊 Jab bhi zaroorat ho, main yahaan hoon aapki help ke liye.`;
        if (role === 'admin') return `You're welcome, ${userName}! 😊 Platform management mein koi bhi help chahiye toh poochiye.`;
        return `Koi baat nahi ${userName}! 😊 Jab bhi koi sawal ho, main yahaan hoon. Apna khayal rakhiye! 💙`;
    }

    // ── 2. Greetings ──
    if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|namaste|hola|yo|kya haal|kaise ho|namaskar)\b/i.test(q)) {
        if (role === 'doctor') {
            return `Namaste Dr. ${userName}! 👋\n\nMain aapka MediConnect Clinical Assistant hoon. Yeh raha aapka quick menu:\n\n• ${DOCTOR_NAV.appointmentRequests}\n• ${DOCTOR_NAV.consultationHistory}\n• ${DOCTOR_NAV.profile}\n\nKya help chahiye?`;
        }
        if (role === 'admin') {
            return `Welcome Administrator ${userName}! 🛡️\n\nMain aapka MediConnect Operations Assistant hoon:\n\n• ${ADMIN_NAV.manageDoctors}\n• ${ADMIN_NAV.manageUsers}\n• ${ADMIN_NAV.allAppointments}\n\nKis platform operation mein help chahiye?`;
        }
        return `Hello ${userName}! 👋\n\nMain aapka MediConnect Health Assistant hoon. Main Hindi, English aur Hinglish sab samajhta hoon!\n\n• ${PATIENT_NAV.findDoctors}\n• ${PATIENT_NAV.bookAppointment}\n• ${PATIENT_NAV.myAppointments}\n\nBatao, kya help chahiye aaj?`;
    }

    // ── 3. About MediConnect / Platform Inquiries ──
    if (q.includes('about this platform') || q.includes('about platform') || q.includes('what is this') || q.includes('what is mediconnect') || q.includes('how does this work') || q.includes('how does mediconnect work') || q.includes('tell me about this') || q.includes('features') || q.includes('what can you do') || q.includes('kya kar sakta') || q.includes('kya kya kar sakte')) {
        return `🏥 **MediConnect ke baare mein**\n\nMediConnect ek digital healthcare platform hai jo patients ko verified medical specialists se connect karta hai.\n\n**Key Features:**\n• **Specialist Directory** — Verified doctors browse karo multiple medical fields mein\n• **Instant Booking** — Available time slots select karke consultation schedule karo\n• **Role-Based Portals:**\n  - **Patients:** Doctors dhundho, appointments book karo, visit history dekho\n  - **Doctors:** Appointment requests manage karo, availability set karo\n  - **Admins:** Doctors verify karo, users manage karo, platform monitor karo\n• **Theme Support** — Dark aur Light mode mein switch karo\n\nKisi specific feature ke baare mein jaanna hai?`;
    }

    // ── 4. Symptom / Doctor / Specialist Queries ──
    const symptomKeywords = ['heart', 'cardio', 'chest pain', 'blood pressure', 'skin', 'acne', 'rash', 'eczema', 'brain', 'headache', 'migraine', 'nerve', 'mental', 'anxiety', 'stress', 'depress', 'therapy', 'stomach', 'digest', 'acid', 'nausea', 'bone', 'joint', 'knee', 'back pain', 'spine', 'eye', 'vision', 'tooth', 'dental', 'child', 'pediatric', 'fever', 'cold', 'cough', 'flu', 'infection', 'gynecology', 'women', 'pregnancy', 'doctor', 'specialist', 'suggest', 'recommend', 'need a', 'unwell', 'sick', 'dizziness', 'itching', 'insomnia', 'ear', 'nose', 'throat', 'need doctor', 'find doctor', 'need specialist'];
    
    const isSymptomQuery = symptomKeywords.some(kw => normalizedQuery.includes(kw));
    
    if (isSymptomQuery) {
        if (role === 'doctor') {
            return `Doctor sahab, aap khud medical professional hain! 😊\n\nAapke MediConnect tools:\n• ${DOCTOR_NAV.appointmentRequests} — Patient requests dekho\n• ${DOCTOR_NAV.consultationHistory} — Past consultations review karo\n\nClinical references ke liye apne professional resources check karo.`;
        }
        if (role === 'admin') {
            return `Admin sahab, aap ${ADMIN_NAV.manageDoctors} mein saare doctors aur unki specializations dekh sakte hain.\n\nSpecific doctor listings ke liye patient account se platform check karo.`;
        }
        
        const hinglishNote = isHinglish ? '\n\n🗣️ *Main aapki Hinglish samajh gaya!*' : '';
        return `Chinta mat karo ${userName}, main aapko sahi specialist dhundhne mein help karta hoon! 🩺${hinglishNote}\n\n👉 Left sidebar mein ${PATIENT_NAV.findDoctors} pe jao — wahaan saare **verified specialists** milenge. Specialization ke hisaab se filter kar sakte ho.\n\nDoctor mil jaaye toh ${PATIENT_NAV.bookAppointment} se consultation schedule karo.\n\n💡 *Abhi main offline mode mein hoon, toh specific doctor details nahi dikha sakta. Find Doctors page pe complete directory hai.*`;
    }

    // ── 5. Booking & Appointment Queries ──
    if (q.includes('book') || q.includes('schedule') || q.includes('how to book') || q.includes('appointment') || q.includes('slot') || q.includes('appointment kaise') || q.includes('book kaise') || q.includes('book karna')) {
        if (role === 'doctor') {
            return `📅 **Appointments Manage karo:**\n\n• ${DOCTOR_NAV.appointmentRequests} — Patient bookings approve/decline karo\n• ${DOCTOR_NAV.profile} — Available consultation days aur hours adjust karo\n• ${DOCTOR_NAV.consultationHistory} — Past consultations review karo`;
        }
        if (role === 'admin') {
            return `📅 **Platform Appointment Management:**\n\n• ${ADMIN_NAV.allAppointments} — Saare appointments monitor karo\n• ${ADMIN_NAV.manageDoctors} — Ensure doctors verified hain before they receive bookings`;
        }
        return `📅 **Appointment Book kaise karein:**\n\n1. Left sidebar mein ${PATIENT_NAV.findDoctors} click karo\n2. Apni zaroorat ke hisaab se specialist choose karo\n3. Date aur available time slot pick karo\n4. Consultation ka reason likho\n5. **Confirm & Request Consultation** click karo\n\nBooking ka status ${PATIENT_NAV.myAppointments} mein track karo.`;
    }

    // ── 6. Pricing & Fees ──
    if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('charge') || q.includes('how much') || q.includes('rate') || q.includes('kitni') || q.includes('kitna') || q.includes('paisa') || q.includes('fees')) {
        if (role === 'doctor') {
            return `Aap apni consultation fees ${DOCTOR_NAV.profile} mein update kar sakte hain. Aapki current fee patients ko doctor profile card pe dikhti hai.`;
        }
        return `💳 **Consultation Fees:**\n\nHar doctor apni consultation fee khud set karta hai. ${PATIENT_NAV.findDoctors} mein har doctor ke card pe exact fee dikhayi deti hai — booking se pehle!\n\nFees transparent hain, koi hidden charges nahi! 😊`;
    }

    // ── 7. Tracking / Status / Cancel ──
    if (q.includes('my appointment') || q.includes('status') || q.includes('track') || q.includes('history') || q.includes('cancel') || q.includes('mera appointment') || q.includes('kab hai') || q.includes('cancel karna')) {
        if (role === 'doctor') {
            return `📋 **Aapke Appointments:**\n\n• ${DOCTOR_NAV.appointmentRequests} — Pending patient requests\n• ${DOCTOR_NAV.consultationHistory} — Past completed consultations`;
        }
        if (role === 'admin') {
            return `📋 **Platform Monitoring:**\n\n• ${ADMIN_NAV.allAppointments} — Saare appointment statuses dekho\n• ${ADMIN_NAV.manageUsers} — Individual user ka history check karo`;
        }
        return `📋 **Appointments Track karo:**\n\n• ${PATIENT_NAV.myAppointments} pe jao sidebar se\n• **Pending** — Doctor aapki request review kar raha hai\n• **Approved** — Confirmed! Scheduled time pe attend karo\n• **Rejected** — Doosre slot ya specialist se rebook karo\n• **Completed** — Past consultations record ke liye`;
    }

    // ── 8. Admin-Specific Queries ──
    if (role === 'admin' && (q.includes('doctor') || q.includes('approve') || q.includes('verify') || q.includes('block') || q.includes('pending') || q.includes('user') || q.includes('manage') || q.includes('kitne'))) {
        return `🛡️ **Admin Operations:**\n\n• ${ADMIN_NAV.manageDoctors} — Pending applications review karo, verified doctors approve karo, ya accounts block karo\n• ${ADMIN_NAV.manageUsers} — Platform ke saare registered users audit karo\n• ${ADMIN_NAV.allAppointments} — Appointment activity monitor karo\n\nKaunsi specific operation mein help chahiye?`;
    }

    // ── 9. Doctor-Specific Queries ──
    if (role === 'doctor' && (q.includes('patient') || q.includes('request') || q.includes('consultation') || q.includes('schedule') || q.includes('availability') || q.includes('hours') || q.includes('mera') || q.includes('kitne'))) {
        return `👨‍⚕️ **Doctor Dashboard Help:**\n\n• ${DOCTOR_NAV.appointmentRequests} — Patient booking requests review karo\n• ${DOCTOR_NAV.consultationHistory} — Complete consultation records access karo\n• ${DOCTOR_NAV.profile} — Availability, fees, aur professional details update karo\n\nKya manage karna hai?`;
    }

    // ── 10. Theme & Settings ──
    if (q.includes('theme') || q.includes('dark') || q.includes('light') || q.includes('settings') || q.includes('logout') || q.includes('sign out') || q.includes('password') || q.includes('profile') || q.includes('setting')) {
        const profileNav = role === 'doctor' ? DOCTOR_NAV.profile : PATIENT_NAV.profile;
        return `⚙️ **Settings & Preferences:**\n\n• Sidebar se ${profileNav} pe jao\n• **Dark** aur **Light** mode ke beech toggle karo\n• Apni personal details update karo\n• Jab chahein securely sign out karo`;
    }

    // ── 11. Health Tips ──
    if (q.includes('tip') || q.includes('health') || q.includes('diet') || q.includes('water') || q.includes('sleep') || q.includes('exercise') || q.includes('sehat') || q.includes('pani') || q.includes('neend')) {
        if (role === 'doctor') {
            return `Doctor sahab, aap khud health expert hain! 😊\n\nMediConnect practice manage karne ke liye:\n• ${DOCTOR_NAV.appointmentRequests}\n• ${DOCTOR_NAV.profile}`;
        }
        return `💡 **Health Tips:**\n\n1. **Paani** — Roz 2.5–3 litre paani peeyo 💧\n2. **Neend** — 7–9 ghante ki quality sleep lo 😴\n3. **Exercise** — Roz 30 minute movement karo 🏃\n4. **Check-ups** — Regular health check-ups karwao 🏥\n\nPersonalized advice ke liye ${PATIENT_NAV.findDoctors} se specialist se milo!`;
    }

    // ── 12. Default — Role-Aware Guidance ──
    if (role === 'doctor') {
        return `Dr. ${userName}, main aapki MediConnect practice manage karne mein help karta hoon! Yeh pooch sakte hain:\n\n• *"Appointment requests dikhao"*\n• *"Schedule kaise update karein?"*\n• *"Consultation history dikha"*\n\n**Quick Navigation:**\n• ${DOCTOR_NAV.appointmentRequests}\n• ${DOCTOR_NAV.consultationHistory}\n• ${DOCTOR_NAV.profile}`;
    }
    if (role === 'admin') {
        return `${userName}, main MediConnect platform manage karne mein help karta hoon! Yeh pooch sakte hain:\n\n• *"Kitne doctors pending approval mein hain?"*\n• *"Users kaise manage karein?"*\n• *"Platform appointments ka overview dikhao"*\n\n**Quick Navigation:**\n• ${ADMIN_NAV.manageDoctors}\n• ${ADMIN_NAV.manageUsers}\n• ${ADMIN_NAV.allAppointments}`;
    }
    return `${userName}, main aapko MediConnect se best care dilane mein help karta hoon! 😊 Yeh pooch sakte hain:\n\n• *"Mujhe bukhar hai, doctor chahiye"*\n• *"Appointment kaise book karein?"*\n• *"Mera appointment kab hai?"*\n• *"Doctor ki fees kitni hai?"*\n\n**Quick Navigation:**\n• ${PATIENT_NAV.findDoctors}\n• ${PATIENT_NAV.bookAppointment}\n• ${PATIENT_NAV.myAppointments}`;
};
