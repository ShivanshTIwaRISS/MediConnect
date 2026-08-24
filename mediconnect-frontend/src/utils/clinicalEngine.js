/**
 * Intelligent In-App Clinical & Platform Natural Language Engine
 * Provides instant, zero-latency clinical intelligence, specialty matching, and conversational guidance.
 */

const SPECIALISTS_DIRECTORY = [
    {
        name: "Dr. Sarah Patel",
        spec: "Cardiologist",
        exp: "7 Years",
        fee: "$90",
        desc: "Cardiovascular assessments, hypertension management, ECG evaluations, and preventative cardiac health.",
        keywords: ["heart", "cardio", "cardiology", "cardiologist", "chest pain", "blood pressure", "bp", "hypertension", "palpitation", "pulse", "ecg", "cardiac"]
    },
    {
        name: "Dr. Christopher Lee",
        spec: "Dermatologist",
        exp: "2 Years",
        fee: "$40",
        desc: "Acne therapy, chronic eczema, skin allergies, mole evaluations, and cosmetic dermatology.",
        keywords: ["skin", "derma", "dermatology", "dermatologist", "acne", "rash", "eczema", "hair", "scalp", "mole", "itch", "allergy", "psoriasis"]
    },
    {
        name: "Dr. Jennifer Garcia",
        spec: "Neurologist",
        exp: "4 Years",
        fee: "$70",
        desc: "Chronic migraines, nerve disorders, concussion management, sleep neurological tone, and cognitive wellness.",
        keywords: ["neuro", "neurology", "neurologist", "brain", "headache", "migraine", "nerve", "dizzy", "dizziness", "vertigo", "seizure", "memory", "numbness"]
    },
    {
        name: "Dr. Akriti Verma",
        spec: "Psychologist",
        exp: "6 Years",
        fee: "$65",
        desc: "Cognitive behavioral therapy (CBT), anxiety management, depressive state support, and stress resilience.",
        keywords: ["psych", "psyc", "psychologist", "psycologist", "pshychologist", "mental", "anxiety", "stress", "depress", "depression", "therapy", "therapist", "counsel", "counseling", "burnout", "sad", "mind", "panic"]
    },
    {
        name: "Dr. Andrew Williams",
        spec: "Gastroenterologist",
        exp: "8 Years",
        fee: "$80",
        desc: "Acid reflux (GERD), irritable bowel, gut microbiome health, digestive inflammation, and abdominal diagnostics.",
        keywords: ["gastro", "gastroenterology", "gastroenterologist", "stomach", "digest", "digestion", "gut", "acid", "reflux", "gerd", "belly", "nausea", "vomit", "ulcer", "constipation", "diarrhea"]
    },
    {
        name: "Dr. Emily Larson",
        spec: "Gynecologist",
        exp: "3 Years",
        fee: "$60",
        desc: "Reproductive health, prenatal counseling, menstrual irregularities, and preventative women's care.",
        keywords: ["gynecology", "gynecologist", "gynae", "obgyn", "women", "prenatal", "pregnancy", "menstrual", "period", "reproductive"]
    },
    {
        name: "Dr. Richard James",
        spec: "General Physician",
        exp: "4 Years",
        fee: "$50",
        desc: "Preventative wellness checks, viral fever management, routine screenings, and acute illness diagnostics.",
        keywords: ["physician", "doctor", "general", "fever", "cold", "cough", "flu", "sick", "infection", "weakness", "checkup", "fatigue", "body pain"]
    }
];

export const generateSmartResponse = (userQuery = '', role = 'patient', userName = 'User') => {
    const raw = (userQuery || '').trim();
    const q = raw.toLowerCase();

    // 1. Gratitude & Pleasantries (Thanks, thank you, got it, etc.)
    if (/^(thanks|thank you|thx|ty|thank u|appreciate it|awesome|great|perfect|cool|ok thanks|okay thanks|got it|understood|good)/i.test(q)) {
        return `You're very welcome, ${userName}! 😊\n\nI'm always here to assist with booking specialists, reviewing clinical appointments, or answering platform questions. Let me know if you need anything else!`;
    }

    // 2. About MediConnect / Platform Inquiries
    if (q.includes('about this platform') || q.includes('about platform') || q.includes('what is this platform') || q.includes('what is mediconnect') || q.includes('how does this work') || q.includes('how does mediconnect work') || q.includes('tell me about this') || q.includes('features') || q.includes('what can you do')) {
        return `🏥 **About MediConnect Platform**\n\nMediConnect is a next-generation digital healthcare platform designed to connect patients directly with verified clinical specialists in real time.\n\n**Core Capabilities:**\n• **Specialist Directory:** Browse credentialed providers across Cardiology, Dermatology, Neurology, Psychology, Gastroenterology, and General Practice.\n• **Instant 14-Day Slot Scheduling:** View open consultation hours and reserve your preferred 30-minute slot instantly.\n• **Role-Tailored Portals:**\n  - **Patients:** Schedule consultations, review status (Pending/Confirmed), and access care insights.\n  - **Doctors:** Manage appointment queues, approve/reject bookings, and set weekly active hours.\n  - **Admins:** Audit users, verify doctor credentials, and monitor platform activity.\n• **Modern Theme Support:** Seamless switching between Deep Obsidian (Dark) and Luminous Alabaster (Light) modes.\n\n👉 Would you like to **Find Doctors** or **Book an Appointment** now?`;
    }

    // 3. Greetings
    if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|namaste|hola|yo)\b/i.test(q)) {
        if (role === 'doctor') {
            return `Hello Dr. ${userName}! 👋\n\nI'm your MediConnect Clinical Assistant. Here is your quick navigation:\n\n• **Review Requests:** Manage pending patient bookings under **Appointment Requests**\n• **Manage Schedule:** Adjust your available hours under **Profile & Settings**\n• **Consultation Log:** Review patient history in **Consultation History**\n\nHow can I support your practice today?`;
        }
        if (role === 'admin') {
            return `Welcome Administrator ${userName}! 🛡️\n\nI'm your MediConnect Operations Assistant:\n\n• **Doctor Verification:** Review doctor credentials in **Manage Doctors**\n• **User Directory:** Audit patients and providers in **Manage Users**\n• **Platform Audits:** Inspect platform-wide consultations in **All Appointments**\n\nWhat platform operation would you like to review?`;
        }
        return `Hello ${userName}! 👋\n\nI'm your MediConnect AI Health Assistant. I can help you:\n\n• **Find Specialists:** Search verified doctors across 10+ medical fields\n• **Book Appointments:** Schedule clinical consultations in seconds\n• **Track Appointments:** Check confirmed visits and pending reviews in **My Appointments**\n\nWhat would you like to explore today?`;
    }

    // 4. Specialty & Symptom Matching (with Typo-Tolerance)
    for (const doc of SPECIALISTS_DIRECTORY) {
        const matches = doc.keywords.some(keyword => q.includes(keyword));
        if (matches) {
            return `We recommend consulting our verified **${doc.spec}**:\n\n• **Specialist:** **${doc.name}**\n• **Qualifications:** Certified ${doc.spec} · ${doc.exp} Experience\n• **Consultation Rate:** ${doc.fee}\n• **Clinical Focus:** ${doc.desc}\n\n**How to Book Dr. ${doc.name.split(' ').slice(1).join(' ')}:**\n1. Open the **Find Doctors** (or **Book Appointment**) tab on your left sidebar.\n2. Select **${doc.spec}** from the filter tabs.\n3. Choose your preferred day and available 30-minute time slot!`;
        }
    }

    // 5. Orthopedics / Bone & Joint
    if (q.includes('bone') || q.includes('joint') || q.includes('knee') || q.includes('back pain') || q.includes('spine') || q.includes('fracture') || q.includes('ortho')) {
        return `For bone, joint, or spinal concerns:\n\n• **Recommended Specialty:** **Orthopedics & Sports Medicine**\n• **Consultation Steps:** Head over to **Find Doctors** in your sidebar to browse musculoskeletal practitioners and book an in-person or video consultation.\n\n*Note:* If you are experiencing an acute injury or severe fracture, please seek immediate emergency care.`;
    }

    // 6. Pediatrics / Children
    if (q.includes('child') || q.includes('kid') || q.includes('baby') || q.includes('pediatric') || q.includes('pedia') || q.includes('infant')) {
        return `For infants, children, and adolescent health:\n\n• **Recommended Specialty:** **Pediatrics**\n• **Services:** Growth tracking, developmental screenings, viral illness care, and childhood immunizations.\n\n👉 Browse specialists under **Find Doctors** to schedule a pediatric checkup!`;
    }

    // 7. Ophthalmology / Eye Care
    if (q.includes('eye') || q.includes('vision') || q.includes('sight') || q.includes('optical') || q.includes('glasses')) {
        return `For vision checks, eye strain, or ophthalmic evaluations:\n\n• **Recommended Specialty:** **Ophthalmology**\n• **Services:** Vision acuity tests, eye strain evaluation, and prescription checks.\n\n👉 Select **Find Doctors** from the sidebar to find open consultation slots!`;
    }

    // 8. Dental Care
    if (q.includes('tooth') || q.includes('teeth') || q.includes('dentist') || q.includes('dental') || q.includes('gum')) {
        return `For dental hygiene, toothache, or oral care:\n\n• **Recommended Specialty:** **Dentistry**\n• **Services:** Routine cleaning, cavity management, tooth pain evaluation, and periodontal care.`;
    }

    // 9. Booking Assistance
    if (q.includes('book') || q.includes('schedule') || q.includes('how to book') || q.includes('appointment') || q.includes('slot')) {
        if (role === 'doctor') {
            return `📅 **Doctor Appointment Management:**\n\n• Go to **Appointment Requests** from your sidebar to approve or decline incoming patient requests.\n• To adjust your consultation hours, visit **Profile & Settings** and toggle active days.`;
        }
        return `📅 **How to Book a Consultation:**\n\n1. Click **Book Appointment** (or **Find Doctors**) from the left sidebar.\n2. Choose a specialist.\n3. Pick any date in the upcoming 14 days and click on an available time slot.\n4. Enter your symptoms or clinical reason for consultation.\n5. Click **Confirm & Request Consultation**!`;
    }

    // 10. Pricing & Fees
    if (q.includes('fee') || q.includes('cost') || q.includes('price') || q.includes('charge') || q.includes('how much') || q.includes('rate') || q.includes('rupee') || q.includes('rs') || q.includes('inr')) {
        return `💳 **MediConnect Fee Structure:**\n\n• Consultation fees range typically between **₹400 and ₹1,500** (in ₹ INR) depending on specialist qualifications, clinical department, and experience.\n• Every doctor's rate is transparently displayed on their card in **Find Doctors** and on the **Book Appointment** screen before you confirm.`;
    }

    // 11. Tracking / Canceling Appointments
    if (q.includes('my appointment') || q.includes('status') || q.includes('track') || q.includes('history') || q.includes('cancel')) {
        if (role === 'doctor') {
            return `You can review completed consultations in **Consultation History** and pending appointments in **Appointment Requests**.`;
        }
        return `📋 **Tracking Your Appointments:**\n\n• Navigate to **My Appointments** from the left sidebar.\n• **Pending:** The doctor is reviewing your request.\n• **Approved:** Confirmed! Please attend at your scheduled time.\n• **Rejected:** You may rebook with another open slot or specialist.`;
    }

    // 12. Theme & Account Settings
    if (q.includes('theme') || q.includes('dark') || q.includes('light') || q.includes('settings') || q.includes('logout') || q.includes('sign out') || q.includes('password')) {
        return `⚙️ **Profile & Appearance Settings:**\n\n• Click **Profile & Settings** from your sidebar (or click your user profile card at the bottom of the sidebar).\n• You can toggle between **Light Alabaster** and **Deep Obsidian Dark Mode** with 1 click, update your details, or sign out safely.`;
    }

    // 13. General Health Advice & Tips
    if (q.includes('tip') || q.includes('health') || q.includes('diet') || q.includes('water') || q.includes('sleep') || q.includes('exercise')) {
        return `💡 **Core Clinical Wellness Tips:**\n\n1. **Hydration:** Drink 2.5–3 liters of water daily to maintain cellular function and cognitive focus.\n2. **Circadian Sleep:** 7–9 hours of uninterrupted sleep optimizes immune recovery.\n3. **Daily Activity:** 30 minutes of moderate cardiovascular movement reduces chronic risk factors by 25%.\n4. **Preventative Care:** Schedule regular preventative screenings with a physician.\n\nNeed to consult a practitioner? Visit **Find Doctors** anytime!`;
    }

    // 14. Default Contextual Guidance
    return `I'm here to help you get the most out of MediConnect! Here are a few things you can ask me:\n\n• *"Suggest a cardiologist"* or *"I need a psychologist"*\n• *"How do I book an appointment?"*\n• *"Where can I see my scheduled visits?"*\n• *"How do consultation fees work?"*\n\nFeel free to type any health or platform question!`;
};
