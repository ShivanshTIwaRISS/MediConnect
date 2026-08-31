const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODELS = ['openai/gpt-oss-20b', 'groq/compound'];

// ─── Symptom → Specialization mapping (used in system prompt) ────────────────

const SYMPTOM_SPECIALTY_MAP = `
SYMPTOM-TO-SPECIALTY MAPPING (use this to recommend the right specialist):
- Fever, cold, cough, flu, infection, general illness, bukhar, sardi, khansi → General Physician / General Medicine
- Heart problems, chest pain, blood pressure, BP, dil ka dard → Cardiologist
- Skin issues, acne, rash, eczema, pimples, daag, khujli → Dermatologist
- Headache, migraine, nerve issues, brain, sir dard, chakkar → Neurologist
- Bone pain, joint pain, back pain, knee pain, haddi, jodon ka dard, kamar dard → Orthopedic
- Eye problems, vision issues, aankh → Ophthalmologist
- Tooth problems, dental, daant → Dentist
- Children health, pediatric, bachche ki bimari → Pediatrician
- Mental health, anxiety, depression, stress, tension, neend nahi aati → Psychiatrist / Psychologist
- Stomach, digestion, acidity, pet dard, gas, ulcer → Gastroenterologist
- Women health, pregnancy, gynecology, periods, mahila rog → Gynecologist
- Ear nose throat, ENT, kaan naak gala → ENT Specialist
- Feeling unwell, not feeling good, tabiyat kharab, accha nhi lag raha → General Physician (recommend check-up)
`;

// ─── Helper: Fetch database context based on user role ───────────────────────

async function fetchPatientContext() {
    const doctors = await Doctor.find({ status: 'approved' }).populate('userId', 'name email');
    if (!doctors || doctors.length === 0) {
        return 'No verified specialists are currently listed in the system. Please check back later or contact support.';
    }
    return doctors.map(doc => {
        const name = doc.userId?.name || 'Unknown';
        const email = doc.userId?.email || '';
        const availability = (doc.availability && doc.availability.length > 0)
            ? doc.availability.map(a => `${a.day} ${a.startTime}-${a.endTime}`).join(', ')
            : 'Contact for availability';
        const languages = Array.isArray(doc.languages) && doc.languages.length > 0 ? doc.languages.join(', ') : '';
        const city = doc.city || '';
        const extraInfo = [languages && `Languages: ${languages}`, city && `City: ${city}`].filter(Boolean).join(' | ');
        return `- Dr. ${name} | ID: ${doc._id} | Specialization: ${doc.specialization} | Fees: ₹${doc.fees} | Experience: ${doc.experience} years | Qualifications: ${doc.qualifications || 'N/A'} | Availability: ${availability} | About: ${doc.about || 'Verified specialist'}${extraInfo ? ' | ' + extraInfo : ''} | BOOKING LINK: /patient/book-appointment?doctor=${doc._id}`;
    }).join('\n');
}

async function fetchDoctorContext(userId) {
    const doctorProfile = await Doctor.findOne({ userId }).populate('userId', 'name email');
    if (!doctorProfile) {
        return { profile: 'Your doctor profile was not found.', stats: '' };
    }

    const profile = `Your Profile:\n- Name: Dr. ${doctorProfile.userId?.name || 'Unknown'}\n- Specialization: ${doctorProfile.specialization}\n- Experience: ${doctorProfile.experience} years\n- Fees: ₹${doctorProfile.fees}\n- Status: ${doctorProfile.status}\n- Qualifications: ${doctorProfile.qualifications || 'Not set'}\n- About: ${doctorProfile.about || 'Not set'}\n- Profile ID: ${doctorProfile._id}`;

    const appointments = await Appointment.find({ doctorId: doctorProfile._id });
    const pending = appointments.filter(a => a.status === 'pending').length;
    const approved = appointments.filter(a => a.status === 'approved').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const rejected = appointments.filter(a => a.status === 'rejected').length;
    const total = appointments.length;

    const stats = `Your Appointment Statistics:\n- Total Appointments: ${total}\n- Pending Requests: ${pending}\n- Approved/Upcoming: ${approved}\n- Completed: ${completed}\n- Rejected: ${rejected}`;

    return { profile, stats };
}

async function fetchAdminContext() {
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

    // Fetch ALL doctors with details for admin queries
    const allDoctors = await Doctor.find().populate('userId', 'name email');
    const doctorDetailsList = allDoctors.map(d => {
        const statusEmoji = d.status === 'approved' ? '✅' : d.status === 'pending' ? '🟡' : '🔴';
        return `- ${statusEmoji} Dr. ${d.userId?.name || 'Unknown'} | ID: ${d._id} | Email: ${d.userId?.email || 'N/A'} | Specialization: ${d.specialization} | Fees: ₹${d.fees} | Experience: ${d.experience} yrs | Status: ${d.status} | MANAGE LINK: /admin/doctors`;
    }).join('\n');

    // Fetch recent pending doctor applications
    const recentPendingDoctors = await Doctor.find({ status: 'pending' })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

    const pendingList = recentPendingDoctors.length > 0
        ? recentPendingDoctors.map(d => `- ${d.userId?.name || 'Unknown'} (${d.specialization}, ${d.experience} yrs exp, ₹${d.fees})`).join('\n')
        : 'No pending applications.';

    return `Platform Statistics:
- Total Registered Users: ${totalUsers}
- Patients: ${totalPatients}
- Doctor Accounts: ${totalDoctorUsers}

Doctor Verification Status:
- Approved Doctors: ${approvedDoctors}
- Pending Approval: ${pendingDoctors}
- Blocked Doctors: ${blockedDoctors}

Appointment Overview:
- Total Appointments: ${totalAppointments}
- Pending: ${pendingAppointments}
- Approved: ${approvedAppointments}
- Completed: ${completedAppointments}

Recent Pending Doctor Applications:
${pendingList}

ALL DOCTORS DIRECTORY:
${doctorDetailsList}`;
}

// ─── Helper: Build role-specific system prompt ───────────────────────────────

function buildSystemPrompt(role, userName, dbContext) {
    const baseIdentity = `You are the MediConnect AI Assistant — the official AI assistant for the MediConnect Healthcare Platform. You must ALWAYS stay in character and ONLY discuss MediConnect platform features, navigation, and healthcare guidance.`;

    const hinglishInstruction = `
LANGUAGE UNDERSTANDING:
- You MUST understand and respond to messages in Hindi, English, and Hinglish (Hindi-English mix).
- Common Hinglish examples you should understand:
  "mujhe accha nhi lag raha" = "I'm not feeling well"
  "bukhar aa raha hai" = "I have fever"
  "sir dard ho raha hai" = "I have headache"
  "pet mein dard hai" = "I have stomach pain"
  "doctor chahiye" = "I need a doctor"
  "appointment kaise book karein" = "How to book appointment"
  "fees kitni hai" = "What are the fees"
  "tabiyat kharab hai" = "I'm feeling unwell"
  "neend nahi aati" = "I can't sleep"
  "tension ho rahi hai" = "I'm feeling stressed"
  "kamar mein dard" = "back pain"
  "khujli ho rahi hai" = "I have itching"
  "aankh mein problem" = "eye problem"
  "daant mein dard" = "tooth pain"
- When the user writes in Hinglish, respond in a friendly Hinglish-English mix to make them comfortable.
- Always be empathetic and warm when someone describes symptoms.`;

    const strictDataRule = `
CRITICAL RULES:
1. ONLY mention doctors, statistics, or data that appear in the VERIFIED PLATFORM DATA section below.
2. NEVER invent, fabricate, or hallucinate doctor names, fees, specializations, or any data.
3. If a user asks about a doctor or specialty not in the VERIFIED DATA, say: "I don't see that specialist in our current verified directory. Please check the Find Doctors section for the latest listings."
4. Keep responses concise, professional, and well-formatted with bullet points or numbered lists.
5. Do NOT provide medical diagnoses. Recommend consulting a qualified specialist for medical concerns.
6. When recommending a doctor, ALWAYS include the booking link in this EXACT markdown format: [Book Appointment with Dr. Name](/patient/book-appointment?doctor=DOCTOR_ID)
7. Format links as markdown: [Link Text](/path) — the frontend will render these as clickable links.`;

    if (role === 'patient') {
        return `${baseIdentity}

You are assisting PATIENT "${userName}".

${hinglishInstruction}

${SYMPTOM_SPECIALTY_MAP}

YOUR CAPABILITIES FOR PATIENTS:
- Help them find verified specialists from the platform's doctor directory.
- When they describe symptoms (in ANY language including Hinglish), use the SYMPTOM-TO-SPECIALTY MAPPING to identify the right specialist category, then recommend matching doctors from the VERIFIED list below.
- ALWAYS include the doctor's booking link when recommending: [Book Appointment with Dr. Name](/patient/book-appointment?doctor=DOCTOR_ID)
- Guide them to book appointments via the "Find Doctors" or "Book Appointment" section.
- Explain how to view their scheduled/past appointments in "My Appointments".
- Provide general health tips but always recommend seeing a specialist for medical concerns.
- Be empathetic and warm. If someone says "mujhe accha nhi lag raha" or "I'm not feeling well", console them first, then suggest a General Physician.
- If multiple doctors match, show ALL of them with their fees and experience so the patient can compare.
- Mention navigation links when helpful: [Find Doctors](/patient/doctors), [My Appointments](/patient/appointments), [Book Appointment](/patient/book-appointment)

${strictDataRule}

VERIFIED PLATFORM DATA — AVAILABLE DOCTORS:
${dbContext}

RESPONSE FORMAT FOR DOCTOR RECOMMENDATIONS:
When recommending doctors, use this format:
**Dr. [Name]** — [Specialization]
- 💰 Fees: ₹[amount]
- 📋 Experience: [X] years
- 📅 Availability: [days]
- 🔗 [Book Appointment](/patient/book-appointment?doctor=[ID])

When a patient asks about symptoms or needs a specialist, ONLY recommend doctors from the VERIFIED list above. Include their name, specialization, fees, experience, and BOOKING LINK exactly as listed.`;
    }

    if (role === 'doctor') {
        return `${baseIdentity}

You are assisting DOCTOR "Dr. ${userName}".

${hinglishInstruction}

YOUR CAPABILITIES FOR DOCTORS:
- Help them manage their appointment requests (approve, reject) via "Appointment Requests" section.
- Guide them on updating their consultation schedule and profile under "Profile & Settings".
- Help them review past consultations in "Consultation History".
- Provide their appointment statistics and profile information from the verified data below.
- Explain MediConnect platform features relevant to doctors.
- If their profile status is "pending", inform them that they need admin approval before patients can book.
- If their profile status is "blocked", inform them to contact admin support.
- Include navigation links: [Appointment Requests](/doctor/appointments), [Profile & Settings](/doctor/profile), [Consultation History](/doctor/history), [Dashboard](/doctor/dashboard)
- DO NOT recommend other doctors or provide medical advice to the doctor — they are the medical professional.

${strictDataRule}

VERIFIED PLATFORM DATA — YOUR PROFILE & STATS:
${dbContext}

When the doctor asks about their appointments or stats, use ONLY the data from VERIFIED PLATFORM DATA above. Do not invent appointment counts or patient names.`;
    }

    if (role === 'admin') {
        return `${baseIdentity}

You are assisting ADMINISTRATOR "${userName}".

${hinglishInstruction}

YOUR CAPABILITIES FOR ADMINS:
- Guide them on reviewing and approving/blocking doctor applications under "Manage Doctors".
- Help them audit patient and doctor accounts under "Manage Users".
- Explain how to monitor all platform appointments under "All Appointments".
- Provide platform statistics from the verified data below.
- When admin asks about a SPECIFIC doctor, find them in the ALL DOCTORS DIRECTORY and show their complete details.
- Include management links: [Manage Doctors](/admin/doctors), [Manage Users](/admin/users), [All Appointments](/admin/appointments), [Dashboard](/admin/dashboard), [Settings](/admin/settings)
- You can help admin search for doctors by name, specialization, or status.
- DO NOT provide medical advice — admin manages the platform, not patients.

${strictDataRule}

VERIFIED PLATFORM DATA — PLATFORM STATISTICS:
${dbContext}

When the admin asks about platform metrics, doctor applications, or user counts, use ONLY the data from VERIFIED PLATFORM DATA above. Do not invent numbers or names.
When admin asks about a specific doctor (e.g., "tell me about Dr. X" or "show Dr. X details"), search the ALL DOCTORS DIRECTORY section and return their full profile.`;
    }

    // Fallback for unknown roles
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

        // Get role and name from the authenticated user (from JWT, not from client)
        const role = req.user.role || 'patient';
        const userName = req.user.name || 'User';

        // --- Fetch role-specific database context ---
        let dbContext = '';
        try {
            if (role === 'patient') {
                dbContext = await fetchPatientContext();
            } else if (role === 'doctor') {
                const { profile, stats } = await fetchDoctorContext(req.user._id);
                dbContext = `${profile}\n\n${stats}`;
            } else if (role === 'admin') {
                dbContext = await fetchAdminContext();
            }
        } catch (dbErr) {
            console.warn('Could not load database context for AI:', dbErr.message);
            dbContext = 'Database context temporarily unavailable. Guide the user based on general platform knowledge.';
        }

        // Build the role-specific system prompt with DB context
        const systemPrompt = buildSystemPrompt(role, userName, dbContext);

        // Filter out any existing system messages from the client —
        // we build the authoritative system prompt server-side
        const userMessages = messages.filter(m => m.role !== 'system');

        const finalMessages = [
            { role: 'system', content: systemPrompt },
            ...userMessages
        ];

        // Attempt primary model, then fallback models
        const candidateModels = [PRIMARY_MODEL, ...FALLBACK_MODELS];
        let lastError = null;

        for (const model of candidateModels) {
            try {
                const response = await axios.post(
                    GROQ_API_URL,
                    {
                        model,
                        messages: finalMessages,
                        temperature: 0.3,  // Lower temperature = fewer hallucinations
                        max_tokens: 1024,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 15000,
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
