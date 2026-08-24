/**
 * Intelligent In-App Clinical & Platform Knowledge Engine
 * Provides instant, zero-latency clinical navigation & guidance when remote AI services are unreachable.
 */

const SPECIALISTS_DATA = [
    { name: "Dr. Richard James", spec: "General Physician", exp: "4 Years", fee: "$50", desc: "Routine health checkups, preventative care, and acute symptom management." },
    { name: "Dr. Emily Larson", spec: "Gynecologist", exp: "3 Years", fee: "$60", desc: "Women's reproductive health, prenatal consultations, and wellness checks." },
    { name: "Dr. Christopher Lee", spec: "Dermatologist", exp: "2 Years", fee: "$40", desc: "Skin disorders, acne, allergies, and dermatological evaluations." },
    { name: "Dr. Christopher Davis", spec: "General Physician", exp: "5 Years", fee: "$50", desc: "Comprehensive adult medical care and chronic disease management." },
    { name: "Dr. Jennifer Garcia", spec: "Neurologist", exp: "4 Years", fee: "$70", desc: "Neurological evaluations, migraines, nerve conditions, and cognitive health." },
    { name: "Dr. Andrew Williams", spec: "Gastroenterologist", exp: "8 Years", fee: "$80", desc: "Digestive system health, GERD, abdominal care, and gut diagnostics." },
    { name: "Dr. Sarah Patel", spec: "Cardiologist", exp: "7 Years", fee: "$90", desc: "Heart health evaluations, blood pressure control, and cardiac care." },
    { name: "Dr. Akriti Verma", spec: "Psychologist", exp: "6 Years", fee: "$65", desc: "Mental health counseling, anxiety management, and cognitive therapy." }
];

export const generateSmartResponse = (userQuery, role = 'patient', userName = 'User') => {
    const q = (userQuery || '').toLowerCase();

    // 1. Greetings
    if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|namaste|hola)/i.test(q)) {
        if (role === 'doctor') {
            return `Hello Dr. ${userName}! 👋\n\nI'm your MediConnect Clinical Assistant. Here's what you can do today:\n\n• **Review Requests:** Check incoming patient consultation requests in **Appointment Requests**\n• **Manage Schedule:** Adjust your weekly availability hours under **Profile & Settings**\n• **Patient History:** Inspect previous consultations in **Consultation History**\n\nHow may I assist your practice right now?`;
        }
        if (role === 'admin') {
            return `Welcome Administrator ${userName}! 🛡️\n\nI'm your MediConnect Operations Assistant. Here's how I can help:\n\n• **Verify Doctors:** Review credential submissions in **Manage Doctors**\n• **Audit Accounts:** Monitor active patients and practitioners in **Manage Users**\n• **Appointments Audit:** Inspect platform consultations in **All Appointments**\n\nWhat platform operation would you like to review?`;
        }
        return `Hello ${userName}! 👋\n\nI'm your MediConnect AI Health Assistant. I can help you:\n\n• **Find Specialists:** Search certified doctors across 10+ medical fields\n• **Book Appointments:** Schedule video or in-person clinical consultations\n• **Track Health Care:** Review confirmed visits and pending reviews in **My Appointments**\n\nWhat can I assist you with today?`;
    }

    // 2. Doctor Search & Specific Medical Fields
    if (q.includes('heart') || q.includes('cardio') || q.includes('chest pain') || q.includes('blood pressure')) {
        const doc = SPECIALISTS_DATA.find(d => d.spec === 'Cardiologist') || SPECIALISTS_DATA[6];
        return `For cardiovascular health and heart checkups, we recommend scheduling with a certified **Cardiologist**:\n\n• **Recommended Specialist:** **${doc.name}** (${doc.spec})\n• **Experience:** ${doc.exp} · **Rate:** ${doc.fee}\n• **Focus:** ${doc.desc}\n\n**Next Steps to Book:**\n1. Open the **Find Doctors** tab from the left sidebar.\n2. Select the **Cardiologist** specialty filter.\n3. Click on the doctor card and choose an available consultation slot!`;
    }

    if (q.includes('skin') || q.includes('derma') || q.includes('acne') || q.includes('rash') || q.includes('hair')) {
        const doc = SPECIALISTS_DATA.find(d => d.spec === 'Dermatologist') || SPECIALISTS_DATA[2];
        return `For skin health, rashes, or dermatological care, we recommend consulting our verified **Dermatologist**:\n\n• **Specialist:** **${doc.name}** (${doc.spec})\n• **Experience:** ${doc.exp} · **Rate:** ${doc.fee}\n• **Focus:** ${doc.desc}\n\n👉 Head to **Find Doctors** in your sidebar and filter by *Dermatologist* to book!`;
    }

    if (q.includes('brain') || q.includes('headache') || q.includes('migraine') || q.includes('neuro') || q.includes('nerve')) {
        const doc = SPECIALISTS_DATA.find(d => d.spec === 'Neurologist') || SPECIALISTS_DATA[4];
        return `For persistent headaches, neurological issues, or nerve health, you can consult our **Neurologist**:\n\n• **Specialist:** **${doc.name}** (${doc.spec})\n• **Experience:** ${doc.exp} · **Rate:** ${doc.fee}\n• **Focus:** ${doc.desc}\n\n👉 Go to **Find Doctors** > select **Neurologist** to schedule an evaluation.`;
    }

    if (q.includes('stomach') || q.includes('digest') || q.includes('acid') || q.includes('gut') || q.includes('gastro')) {
        const doc = SPECIALISTS_DATA.find(d => d.spec === 'Gastroenterologist') || SPECIALISTS_DATA[5];
        return `For digestive issues, acid reflux, or stomach discomfort, please consult our **Gastroenterologist**:\n\n• **Specialist:** **${doc.name}** (${doc.spec})\n• **Experience:** ${doc.exp} · **Rate:** ${doc.fee}\n\n👉 Head to **Find Doctors** and filter by *Gastroenterologist* to choose a slot.`;
    }

    if (q.includes('mental') || q.includes('anxiety') || q.includes('stress') || q.includes('depress') || q.includes('psycho') || q.includes('therapy')) {
        const doc = SPECIALISTS_DATA.find(d => d.spec === 'Psychologist') || SPECIALISTS_DATA[7];
        return `For emotional well-being, anxiety management, and therapy, we have certified **Psychologists**:\n\n• **Specialist:** **${doc.name}** (${doc.spec})\n• **Experience:** ${doc.exp} · **Rate:** ${doc.fee}\n• **Focus:** ${doc.desc}\n\n👉 You can privately schedule a session from **Find Doctors** > *Psychologist*.`;
    }

    if (q.includes('find doctor') || q.includes('search doctor') || q.includes('specialist') || q.includes('who are the doctors') || q.includes('doctor list')) {
        return `Here are some of the certified specialist categories available on MediConnect:\n\n• **General Physicians:** Routine health, viral fever, preventative screenings\n• **Cardiologists:** Heart health, hypertension, ECG evaluations\n• **Dermatologists:** Skin conditions, acne, eczema, allergies\n• **Neurologists:** Migraines, nerve disorders, cognitive checks\n• **Gastroenterologists:** Digestive disorders, gut health\n• **Psychologists:** Mental health, counseling, anxiety management\n\n👉 Tap **Find Doctors** on your sidebar to browse full profiles, verified degrees, and consultation fees!`;
    }

    // 3. Booking Workflow
    if (q.includes('book') || q.includes('schedule') || q.includes('appointment') || q.includes('consult')) {
        if (role === 'doctor') {
            return `To manage consultation bookings as a Doctor:\n\n1. Open **Appointment Requests** from your sidebar.\n2. Review pending patient requests and click **Approve** or **Reject**.\n3. Keep your active hours updated in **Profile & Settings** so patients only book when you are available.`;
        }
        return `📅 **How to Book an Appointment on MediConnect:**\n\n1. Click **Book Appointment** (or **Find Doctors**) from the left sidebar.\n2. Select your preferred medical practitioner.\n3. Choose an available date and a convenient 30-minute time slot.\n4. Enter your symptoms or clinical reason for the visit and confirm!\n\nYou can track the status anytime under **My Appointments**.`;
    }

    // 4. Appointments / Status Tracking
    if (q.includes('my appointment') || q.includes('status') || q.includes('history') || q.includes('cancel')) {
        if (role === 'doctor') {
            return `You can review all historical consultations under **Consultation History** and pending appointments under **Appointment Requests**.`;
        }
        return `📋 **Tracking Your Appointments:**\n\n• Go to **My Appointments** from your sidebar navigation.\n• **Pending:** The doctor is reviewing your request.\n• **Approved:** Your appointment is confirmed! Please attend at your scheduled time.\n• **Rejected / Cancelled:** You may reschedule with another available slot or specialist.`;
    }

    // 5. Theme & Settings
    if (q.includes('theme') || q.includes('dark') || q.includes('light') || q.includes('settings') || q.includes('logout') || q.includes('sign out')) {
        return `⚙️ **Profile & Appearance Settings:**\n\n• To switch between **Dark Obsidian** and **Light Alabaster** themes, or to sign out safely, go to **Profile & Settings** from your sidebar (or click your user card at the bottom of the sidebar).\n• You can toggle your interface theme with a single click in the **Interface Appearance** card.`;
    }

    // 6. Admin Actions
    if (role === 'admin' || q.includes('admin') || q.includes('approve') || q.includes('user') || q.includes('verification')) {
        return `🛡️ **Admin Command Operations:**\n\n• **Manage Doctors:** Approve new physician registrations, inspect clinical credentials, or manage active practitioners.\n• **Manage Users:** View registered patients and doctors, or deactivate accounts.\n• **All Appointments:** Platform-wide clinical audit log.\n• **Settings:** Manage admin account security and interface appearance.`;
    }

    // 7. General Health Tips & Questions
    if (q.includes('tip') || q.includes('health') || q.includes('diet') || q.includes('water') || q.includes('sleep') || q.includes('exercise')) {
        return `💡 **Core Health Recommendations for Daily Vitality:**\n\n1. **Hydration:** Drink 2.5–3 liters of water daily to maintain cellular function and cognitive focus.\n2. **Circadian Sleep:** Aim for 7–8 hours of consistent sleep to optimize immune recovery.\n3. **Daily Movement:** At least 30 minutes of moderate activity reduces cardiovascular risks by 25%.\n4. **Preventative Screenings:** Schedule an annual general health checkup with a physician.\n\nNeed to consult a doctor? Visit **Find Doctors** to schedule a checkup!`;
    }

    // 8. Default Contextual Fallback
    return `I can help you navigate MediConnect, locate specialists, book clinical appointments, and manage health records.\n\n• **Find Specialists:** Browse credentialed cardiologists, dermatologists, psychologists, and physicians.\n• **Book Consultations:** Schedule an open date & time slot in **Book Appointment**.\n• **View Records:** Track your appointments under **My Appointments**.\n\nFeel free to ask a specific question or select one of the suggested prompts below!`;
};
