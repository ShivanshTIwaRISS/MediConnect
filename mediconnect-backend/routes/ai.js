const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// Models available with high reliability on Groq
const CANDIDATE_MODELS = [
    'groq/compound-mini',
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.8-27b'
];

// ─── Symptom → Specialization mapping ────────────────────────────────────────

const SYMPTOM_SPECIALTY_MAP = `
SYMPTOM-TO-SPECIALTY MAPPING:
- Fever, cold, cough, flu, infection, general illness, bukhar, sardi, khansi, tabiyat kharab, accha nhi lag raha → General Physician / General Medicine
- Heart problems, chest pain, blood pressure, BP, dil ka dard → Cardiologist / Cardiology
- Skin issues, acne, rash, eczema, pimples, daag, khujli → Dermatologist / Dermatology
- Headache, migraine, nerve issues, brain, sir dard, chakkar → Neurologist / Neurology
- Bone pain, joint pain, back pain, knee pain, haddi, jodon ka dard, kamar dard → Orthopedic / Orthopedics
- Eye problems, vision issues, aankh → Ophthalmologist / Ophthalmology
- Tooth problems, dental, daant → Dentist / Dentistry
- Children health, pediatric, bachche ki bimari → Pediatrician / Pediatrics
- Mental health, anxiety, depression, stress, tension, neend nahi aati, udaas → Psychiatrist / Psychiatry
- Stomach, digestion, acidity, pet dard, gas, ulcer, ulti → Gastroenterologist / Gastroenterology
- Women health, pregnancy, gynecology, periods, mahila rog → Gynecologist / Gynecology
- Ear nose throat, ENT, kaan naak gala → ENT Specialist
- Diabetes, thyroid, hormonal → Endocrinologist / Endocrinology
`;

// ─── Smart Context Filters to prevent TPM Rate Limits ─────────────────────────

function filterRelevantDoctors(query = '', allDocs = []) {
    const q = query.toLowerCase();

    const matchers = [
        { keywords: ['fever', 'cold', 'cough', 'bukhar', 'sardi', 'khansi', 'tabiyat', 'accha nhi', 'acha nhi', 'unwell', 'flu', 'general', 'physician', 'headache', 'sir dard', 'sar dard', 'bimar'], spec: ['General Medicine', 'General Physician'] },
        { keywords: ['heart', 'chest', 'dil', 'bp', 'pressure', 'cardio', 'seene'], spec: ['Cardiology'] },
        { keywords: ['skin', 'acne', 'rash', 'khujli', 'daag', 'pimples', 'derma', 'chamdi'], spec: ['Dermatology'] },
        { keywords: ['brain', 'nerve', 'migraine', 'chakkar', 'neuro', 'sir'], spec: ['Neurology'] },
        { keywords: ['bone', 'joint', 'knee', 'back', 'haddi', 'jodon', 'kamar', 'ghutne', 'ortho'], spec: ['Orthopedics'] },
        { keywords: ['eye', 'vision', 'aankh', 'nazar', 'ophthal'], spec: ['Ophthalmology'] },
        { keywords: ['child', 'baby', 'kid', 'pediatric', 'bachche', 'bacche'], spec: ['Pediatrics'] },
        { keywords: ['mental', 'stress', 'depression', 'anxiety', 'tension', 'neend', 'ghabrahat', 'psychiat', 'psycholog'], spec: ['Psychiatry'] },
        { keywords: ['stomach', 'digest', 'acid', 'pet', 'gas', 'gastro', 'ulti', 'dast'], spec: ['Gastroenterology'] },
        { keywords: ['women', 'period', 'pregnancy', 'mahila', 'gynec'], spec: ['Gynecology'] },
        { keywords: ['ent', 'ear', 'nose', 'throat', 'kaan', 'naak', 'gala'], spec: ['ENT Specialist'] },
        { keywords: ['diabetes', 'hormone', 'thyroid', 'sugar', 'endo'], spec: ['Endocrinology'] }
    ];

    let targetSpecs = [];
    for (const m of matchers) {
        if (m.keywords.some(k => q.includes(k))) {
            targetSpecs.push(...m.spec);
        }
    }

    let relevant = [];
    if (targetSpecs.length > 0) {
        relevant = allDocs.filter(d => targetSpecs.some(ts => d.specialization?.toLowerCase().includes(ts.toLowerCase())));
    }

    // Also match by doctor name if user mentioned a specific doctor
    const byName = allDocs.filter(d => {
        const name = d.userId?.name?.toLowerCase();
        return name && q.includes(name);
    });
    relevant = [...relevant, ...byName];

    // Deduplicate
    const uniqueIds = new Set();
    const result = [];
    for (const d of relevant) {
        if (!uniqueIds.has(d._id.toString())) {
            uniqueIds.add(d._id.toString());
            result.push(d);
        }
    }

    // If fewer than 6, include top doctors from diverse specialties
    if (result.length < 6) {
        for (const d of allDocs) {
            if (!uniqueIds.has(d._id.toString())) {
                uniqueIds.add(d._id.toString());
                result.push(d);
                if (result.length >= 8) break;
            }
        }
    }

    return result.slice(0, 10);
}

// ─── Helper: Fetch database context based on user role ───────────────────────

async function fetchPatientContext(userQuery = '') {
    const doctors = await Doctor.find({ status: 'approved' }).populate('userId', 'name email');
    if (!doctors || doctors.length === 0) {
        return 'No verified specialists are currently listed in the system. Please check back later or contact support.';
    }

    const relevantDoctors = filterRelevantDoctors(userQuery, doctors);

    return relevantDoctors.map(doc => {
        const name = doc.userId?.name || 'Unknown';
        const availability = (doc.availability && doc.availability.length > 0)
            ? doc.availability.map(a => `${a.day.slice(0, 3)} ${a.startTime}-${a.endTime}`).join(', ')
            : 'Available Mon-Sat';
        return `- Dr. ${name} | ID: ${doc._id} | Specialization: ${doc.specialization} | Fees: ₹${doc.fees} | Experience: ${doc.experience} yrs | Availability: ${availability} | BOOKING LINK: /patient/book-appointment?doctor=${doc._id}`;
    }).join('\n');
}

async function fetchDoctorContext(userId) {
    const doctorProfile = await Doctor.findOne({ userId }).populate('userId', 'name email');
    if (!doctorProfile) {
        return { profile: 'Your doctor profile was not found.', stats: '' };
    }

    const profile = `Your Profile:\n- Name: Dr. ${doctorProfile.userId?.name || 'Unknown'}\n- Specialization: ${doctorProfile.specialization}\n- Experience: ${doctorProfile.experience} years\n- Fees: ₹${doctorProfile.fees}\n- Status: ${doctorProfile.status}\n- Qualifications: ${doctorProfile.qualifications || 'Not set'}\n- Profile ID: ${doctorProfile._id}`;

    const appointments = await Appointment.find({ doctorId: doctorProfile._id });
    const pending = appointments.filter(a => a.status === 'pending').length;
    const approved = appointments.filter(a => a.status === 'approved').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const rejected = appointments.filter(a => a.status === 'rejected').length;
    const total = appointments.length;

    const stats = `Your Appointment Statistics:\n- Total Appointments: ${total}\n- Pending Requests: ${pending}\n- Approved/Upcoming: ${approved}\n- Completed: ${completed}\n- Rejected: ${rejected}`;

    return { profile, stats };
}

async function fetchAdminContext(userQuery = '') {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctorUsers = await User.countDocuments({ role: 'doctor' });

    const approvedDoctors = await Doctor.countDocuments({ status: 'approved' });
    const pendingDoctors = await Doctor.countDocuments({ status: 'pending' });
    const blockedDoctors = await Doctor.countDocuments({ status: 'blocked' });

    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const approvedAppointments = await Appointment.countDocuments({ status: 'approved' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });

    // Fetch doctors (filtered or top 15)
    const allDoctors = await Doctor.find().populate('userId', 'name email').limit(15);
    const doctorDetailsList = allDoctors.map(d => {
        const statusEmoji = d.status === 'approved' ? '✅' : d.status === 'pending' ? '🟡' : '🔴';
        return `- ${statusEmoji} Dr. ${d.userId?.name || 'Unknown'} | ID: ${d._id} | Specialization: ${d.specialization} | Fees: ₹${d.fees} | Exp: ${d.experience} yrs | Status: ${d.status}`;
    }).join('\n');

    return `Platform Statistics:
- Total Registered Users: ${totalUsers} (Patients: ${totalPatients}, Doctors: ${totalDoctorUsers})
- Doctor Verification: Approved: ${approvedDoctors}, Pending: ${pendingDoctors}, Blocked: ${blockedDoctors}
- Appointments: Total: ${totalAppointments}, Pending: ${pendingAppointments}, Approved: ${approvedAppointments}, Completed: ${completedAppointments}

Doctors Directory Snapshot:
${doctorDetailsList}`;
}

// ─── Helper: Build role-specific system prompt ───────────────────────────────

function buildSystemPrompt(role, userName, dbContext) {
    const baseIdentity = `You are the MediConnect AI Assistant — the official healthcare assistant for the MediConnect Healthcare Platform. You must ALWAYS stay in character and ONLY discuss MediConnect platform features, navigation, doctor recommendations, and healthcare guidance.`;

    const hinglishInstruction = `
LANGUAGE UNDERSTANDING & TONE:
- You MUST understand and naturally reply in Hindi, English, and Hinglish (Hindi-English mix).
- When a user writes in Hinglish (e.g. "yrr bukhar hai", "tabiyat kharab hai", "doctor chahiye"), reply in a warm, conversational Hinglish-English tone.
- When someone describes symptoms, console them empathetically, explain basic care tips, and recommend verified specialists from the list below.`;

    const strictDataRule = `
CRITICAL RULES:
1. ONLY mention doctors that appear in the VERIFIED PLATFORM DOCTORS list below.
2. NEVER invent doctor names, fees, or specializations.
3. When recommending a doctor, ALWAYS provide their booking link in this EXACT markdown format:
   [Book Appointment with Dr. Name](/patient/book-appointment?doctor=DOCTOR_ID)
4. Format: State the doctor name in bold, their specialization, fees (₹), experience, and the clickable booking link.
5. Do NOT give medical prescriptions. Suggest seeing a specialist.`;

    if (role === 'patient') {
        return `${baseIdentity}

You are assisting PATIENT "${userName}".

${hinglishInstruction}

${SYMPTOM_SPECIALTY_MAP}

${strictDataRule}

VERIFIED PLATFORM DOCTORS (Use these exact names, IDs and fees):
${dbContext}

RESPONSE FORMAT FOR DOCTOR RECOMMENDATIONS:
When recommending doctors, use this clean format:
**Dr. [Name]** – [Specialization]
- Fees: ₹[amount]
- Experience: [X] years
[Book Appointment with Dr. [Name]](/patient/book-appointment?doctor=[ID])`;
    }

    if (role === 'doctor') {
        return `${baseIdentity}

You are assisting DOCTOR "Dr. ${userName}".

${hinglishInstruction}

YOUR CAPABILITIES FOR DOCTORS:
- Help manage appointment requests: [Appointment Requests](/doctor/appointments)
- Update schedule & fees: [Profile & Settings](/doctor/profile)
- Review past consultations: [Consultation History](/doctor/history)
- Provide their appointment statistics from below.

VERIFIED PLATFORM DATA — YOUR PROFILE & STATS:
${dbContext}`;
    }

    if (role === 'admin') {
        return `${baseIdentity}

You are assisting ADMINISTRATOR "${userName}".

${hinglishInstruction}

YOUR CAPABILITIES FOR ADMINS:
- Review & approve doctors: [Manage Doctors](/admin/doctors)
- Manage users: [Manage Users](/admin/users)
- Monitor appointments: [All Appointments](/admin/appointments)
- Platform stats: [Dashboard](/admin/dashboard)

VERIFIED PLATFORM DATA — PLATFORM STATISTICS:
${dbContext}`;
    }

    return `${baseIdentity}\n\nYou are assisting user "${userName}".\n${hinglishInstruction}\n${strictDataRule}\n\nVERIFIED PLATFORM DATA:\n${dbContext}`;
}

// ─── Main AI Chat Route (Auth Protected) ─────────────────────────────────────

router.post('/chat', protect, async (req, res) => {
    try {
        const { messages } = req.body;
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ success: false, message: 'Groq API key not configured on server' });
        }

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid messages array provided' });
        }

        const role = req.user?.role || 'patient';
        const userName = req.user?.name || 'User';

        // Extract last user message for smart context filtering
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';

        // Fetch role-specific database context
        let dbContext = '';
        try {
            if (role === 'patient') {
                dbContext = await fetchPatientContext(lastUserMsg);
            } else if (role === 'doctor') {
                const { profile, stats } = await fetchDoctorContext(req.user._id);
                dbContext = `${profile}\n\n${stats}`;
            } else if (role === 'admin') {
                dbContext = await fetchAdminContext(lastUserMsg);
            }
        } catch (dbErr) {
            console.warn('Could not load database context for AI:', dbErr.message);
            dbContext = 'Database context temporarily unavailable.';
        }

        // Build system prompt
        const systemPrompt = buildSystemPrompt(role, userName, dbContext);

        // Filter out system messages from client
        const userMessages = messages.filter(m => m.role !== 'system');

        // Only take the last 6 messages to keep tokens low and prevent rate limits
        const recentMessages = userMessages.slice(-6);

        const finalMessages = [
            { role: 'system', content: systemPrompt },
            ...recentMessages
        ];

        let lastError = null;

        for (const model of CANDIDATE_MODELS) {
            try {
                const response = await axios.post(
                    GROQ_API_URL,
                    {
                        model,
                        messages: finalMessages,
                        temperature: 0.3,
                        max_tokens: 800,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 12000,
                    }
                );

                const content = response.data?.choices?.[0]?.message?.content;
                if (content) {
                    return res.json({ success: true, content });
                }
            } catch (err) {
                lastError = err;
                console.warn(`Groq model ${model} failed:`, err.response?.data?.error?.message || err.message);
            }
        }

        console.error('All Groq candidate models failed:', lastError?.response?.data || lastError?.message);
        res.status(500).json({
            success: false,
            message: lastError?.response?.data?.error?.message || 'Failed to connect to AI service'
        });
    } catch (error) {
        console.error('AI Chat Error:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: 'Internal server error processing AI request' });
    }
});

module.exports = router;
