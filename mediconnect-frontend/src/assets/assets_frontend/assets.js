import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Rajesh Sharma',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS, MD',
        experience: '8 Years',
        about: 'Dr. Rajesh Sharma is a trusted General Physician in New Delhi dedicated to preventive healthcare, comprehensive diagnostic evaluations, and evidence-based personalized medicine.',
        fees: 600,
        address: {
            line1: '12 Barakhamba Road',
            line2: 'Connaught Place, New Delhi'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Priya Patel',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS, MS (OB-GYN)',
        experience: '7 Years',
        about: 'Dr. Priya Patel provides specialized reproductive health, maternity care, and advanced obstetric consultations with extensive clinical experience.',
        fees: 800,
        address: {
            line1: 'B-4, South Extension Part II',
            line2: 'Ring Road, New Delhi'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Sneha Iyer',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS, MD (Dermatology)',
        experience: '5 Years',
        about: 'Dr. Sneha Iyer specializes in clinical dermatology, allergy diagnostics, and dermatological therapies with a compassionate patient-first approach.',
        fees: 700,
        address: {
            line1: 'C-18, Defence Colony',
            line2: 'Lajpat Nagar, New Delhi'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Vikram Malhotra',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS, MD (Pediatrics)',
        experience: '9 Years',
        about: 'Dr. Vikram Malhotra is a distinguished pediatrician focusing on child immunization, growth monitoring, and pediatric wellness programs.',
        fees: 650,
        address: {
            line1: 'E-42, Saket District Centre',
            line2: 'Press Enclave Marg, New Delhi'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Ananya Mukherjee',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS, DM (Neurology)',
        experience: '12 Years',
        about: 'Dr. Ananya Mukherjee provides advanced diagnostic evaluations for neurological disorders, migraines, neuromuscular conditions, and cerebrovascular health.',
        fees: 1200,
        address: {
            line1: 'Institutional Area, Vasant Kunj',
            line2: 'Nelson Mandela Marg, New Delhi'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Alok Verma',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS, MD, DM',
        experience: '10 Years',
        about: 'Dr. Alok Verma is a senior neurologist committed to individualized neurological treatment planning, neuro-rehabilitation, and acute clinical interventions.',
        fees: 1100,
        address: {
            line1: 'A-21, Green Park Main',
            line2: 'Hauz Khas, New Delhi'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Amit Sengupta',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS, DNB (Medicine)',
        experience: '6 Years',
        about: 'Dr. Amit Sengupta offers proactive routine screenings, infectious disease management, and metabolic health follow-ups.',
        fees: 500,
        address: {
            line1: 'Plot 7, Sector 12 Dwarka',
            line2: 'Dwarka, New Delhi'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Meera Nambiar',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS, DGO, DNB',
        experience: '8 Years',
        about: 'Dr. Meera Nambiar brings dedicated expertise in women’s preventive healthcare, hormonal wellness, and family planning consultations.',
        fees: 750,
        address: {
            line1: '24 Janpath Road',
            line2: 'Central Secretariat, New Delhi'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Ritu Deshmukh',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS, DVD',
        experience: '4 Years',
        about: 'Dr. Ritu Deshmukh focuses on holistic skin treatments, chronic eczema care, and advanced cosmetic dermatology.',
        fees: 600,
        address: {
            line1: 'Shop 14, Greater Kailash I',
            line2: 'M-Block Market, New Delhi'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Kunal Kapoor',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS, DCH',
        experience: '5 Years',
        about: 'Dr. Kunal Kapoor is a friendly pediatrician committed to newborn care, adolescent health guidance, and seasonal pediatric infections.',
        fees: 550,
        address: {
            line1: 'Block C, Preet Vihar',
            line2: 'Vikas Marg, New Delhi'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Nandini Rao',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS, MD, DM',
        experience: '11 Years',
        about: 'Dr. Nandini Rao specializes in movement disorders, epilepsy management, and cognitive wellness assessments.',
        fees: 1150,
        address: {
            line1: '16 Community Centre',
            line2: 'New Friends Colony, New Delhi'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Siddharth Joshi',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS, DM',
        experience: '9 Years',
        about: 'Dr. Siddharth Joshi brings extensive experience in neuro-diagnostics and neuromuscular therapeutic interventions.',
        fees: 1000,
        address: {
            line1: '58 Pusa Road',
            line2: 'Karol Bagh, New Delhi'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Pooja Bhatia',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS, MD',
        experience: '7 Years',
        about: 'Dr. Pooja Bhatia provides comprehensive primary care, lifestyle disease management, and preventative check-ups.',
        fees: 550,
        address: {
            line1: '8 Ring Road',
            line2: 'Lajpat Nagar IV, New Delhi'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Rohan Mehra',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS, MS',
        experience: '6 Years',
        about: 'Dr. Rohan Mehra specializes in advanced gynecology consultations and minimally invasive clinical solutions.',
        fees: 850,
        address: {
            line1: 'D-9, Hauz Khas Enclave',
            line2: 'Aurobindo Marg, New Delhi'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Kriti Singhania',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS, MD',
        experience: '6 Years',
        about: 'Dr. Kriti Singhania provides individualized skincare regimens and clinical management of complex dermatological issues.',
        fees: 700,
        address: {
            line1: '33 Basant Lok',
            line2: 'Vasant Vihar, New Delhi'
        }
    },
]