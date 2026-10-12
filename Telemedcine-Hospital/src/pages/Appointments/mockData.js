export const DOCTORS = [
  { name: 'DR. Yinusa Grace', specialty: 'General Physician', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120' },
  { name: 'DR. Favour Ayodele', specialty: 'Pediatrician', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120' },
  { name: 'DR. Sophia Akiheme', specialty: 'Neurologist', avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=120' },
  { name: 'Dr. Akeem Taiwo', specialty: 'Psychiatrist', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=120' }
];

export const INITIAL_APPOINTMENTS = [
  // Wednesday, Nov 6, 2024 - DR. Yinusa Grace
  {
    id: 'apt-1',
    patientName: 'Cassidy James',
    patientInitial: 'CJ',
    date: '2024-11-06',
    startTime: '09:00',
    endTime: '10:00',
    doctorName: 'DR. Yinusa Grace',
    tag: 'General Checkup',
    status: 'Finished',
    ehrNumber: '293841A',
    payment: { billNo: '#1011', amount: 'NGN 12,500.00', status: 'PAID' },
    bioData: {
      fullName: 'Cassidy James',
      phone: '+234 812 345 6789',
      age: 28,
      email: 'cassidy.james@gmail.com',
      gender: 'Male',
      address: '22 Garki Area, Abuja, Nigeria'
    },
    medicalRecord: {
      treatments: [
        {
          id: 't-1',
          name: 'Routine Checkup',
          readings: [
            { id: 'r-1', name: 'Blood Pressure 120/80', done: true },
            { id: 'r-2', name: 'Weight & BMI calculation', done: true }
          ],
          reason: 'Periodic clinical assessment'
        }
      ],
      pharmacy: [
        { id: 'p-1', name: 'Multivitamin supplements', done: true }
      ]
    }
  },
  {
    id: 'apt-2',
    patientName: 'George Bright',
    patientInitial: 'GB',
    date: '2024-11-06',
    startTime: '10:00',
    endTime: '11:00',
    doctorName: 'DR. Yinusa Grace',
    tag: 'Cardiology Prep',
    status: 'Finished',
    ehrNumber: '839210C',
    payment: { billNo: '#1012', amount: 'NGN 25,000.00', status: 'PAID' },
    bioData: {
      fullName: 'George Bright',
      phone: '+234 905 443 1122',
      age: 45,
      email: 'george.bright@yahoo.com',
      gender: 'Male',
      address: 'Plot 44, Victoria Island, Lagos, Nigeria'
    }
  },
  {
    id: 'apt-3',
    patientName: 'Brew Anderson',
    patientInitial: 'BA',
    date: '2024-11-06',
    startTime: '12:00',
    endTime: '13:00',
    doctorName: 'DR. Yinusa Grace',
    tag: 'Asthma Followup',
    status: 'Unfinished',
    ehrNumber: '445210H',
    payment: { billNo: '#1015', amount: 'NGN 15,000.00', status: 'UNPAID' },
    bioData: {
      fullName: 'Brew Anderson',
      phone: '+234 809 112 3344',
      age: 34,
      email: 'brewanderson@outlook.com',
      gender: 'Male',
      address: '15 Admiralty Way, Lekki Phase 1, Lagos, Nigeria'
    }
  },
  {
    id: 'apt-4',
    patientName: 'George Bright',
    patientInitial: 'GB',
    date: '2024-11-06',
    startTime: '15:00',
    endTime: '16:00',
    doctorName: 'DR. Yinusa Grace',
    tag: 'General Checkup',
    status: 'Registered',
    ehrNumber: '839210C',
    payment: { billNo: '#1020', amount: 'NGN 12,500.00', status: 'UNPAID' },
    bioData: {
      fullName: 'George Bright',
      phone: '+234 905 443 1122',
      age: 45,
      email: 'george.bright@yahoo.com',
      gender: 'Male',
      address: 'Plot 44, Victoria Island, Lagos, Nigeria'
    }
  },
  {
    id: 'apt-5',
    patientName: 'Beatrice Morgan',
    patientInitial: 'BM',
    date: '2024-11-06',
    startTime: '16:00',
    endTime: '17:00',
    doctorName: 'DR. Yinusa Grace',
    tag: 'General Checkup',
    status: 'Registered',
    ehrNumber: '192837L',
    payment: { billNo: '#1022', amount: 'NGN 12,500.00', status: 'UNPAID' },
    bioData: {
      fullName: 'Beatrice Morgan',
      phone: '+234 703 998 8877',
      age: 29,
      email: 'beatrice_morgan@google.com',
      gender: 'Female',
      address: '6 Wuse II Crescent, Abuja, Nigeria'
    }
  },

  // Wednesday, Nov 6, 2024 - DR. Favour Ayodele
  {
    id: 'apt-6',
    patientName: 'Adekoya Ifeoluwa',
    patientInitial: 'AI',
    date: '2024-11-06',
    startTime: '10:00',
    endTime: '11:00',
    doctorName: 'Dr. Akeem Taiwo',
    tag: 'Brain seizures',
    status: 'Finished',
    ehrNumber: '100235B',
    payment: { billNo: '#1024', amount: 'NGN 16,600.00', status: 'UNPAID' },
    bioData: {
      fullName: 'Adekoya J. Ifeoluwa',
      phone: '+234 704 384 9829',
      age: 19,
      email: 'adekoyajosep123@gmail.com',
      gender: 'Female',
      address: '4337 lynn garden, brooks, GA 21110, Nigeria.'
    },
    medicalRecord: {
      treatments: [
        {
          id: 't-eeg',
          name: 'E.E.G',
          readings: [
            { id: 'r-e-1', name: 'E.E.G Reading 1', done: true },
            { id: 'r-e-2', name: 'E.E.G Reading 2', done: false }
          ],
          reason: 'Patient experienced focal seizures with secondary generalization last night. Need EEG amplitude verification.'
        }
      ],
      pharmacy: [
        { id: 'p-teg', name: 'Tegretol (Carbamazepine)', done: true }
      ]
    }
  },
  {
    id: 'apt-7',
    patientName: 'Olanrewaju Mireille',
    patientInitial: 'OM',
    date: '2024-11-06',
    startTime: '11:00',
    endTime: '12:00',
    doctorName: 'DR. Favour Ayodele',
    tag: 'General Checkup',
    status: 'Registered',
    ehrNumber: '554321K',
    payment: { billNo: '#1023', amount: 'NGN 12,500.00', status: 'PAID' },
    bioData: {
      fullName: 'Olanrewaju Mireille',
      phone: '+234 815 000 9999',
      age: 24,
      email: 'm.olanrewaju@outlook.com',
      gender: 'Female',
      address: '32 Isaac John Street, Ikeja, Lagos, Nigeria'
    }
  },
  {
    id: 'apt-8',
    patientName: 'Halimat Ogbomosho',
    patientInitial: 'HO',
    date: '2024-11-06',
    startTime: '14:00',
    endTime: '15:00',
    doctorName: 'DR. Favour Ayodele',
    tag: 'General Checkup',
    status: 'Registered',
    ehrNumber: '908127D',
    payment: { billNo: '#1025', amount: 'NGN 12,500.00', status: 'UNPAID' },
    bioData: {
      fullName: 'Halimat Ogbomosho',
      phone: '+234 802 334 5566',
      age: 31,
      email: 'halimat.og@gmail.com',
      gender: 'Female',
      address: 'Apartment 4B, Ikoyi Heights, Lagos, Nigeria'
    }
  },
  {
    id: 'apt-9',
    patientName: 'Adeniran Ogunsanya',
    patientInitial: 'AO',
    date: '2024-11-06',
    startTime: '16:00',
    endTime: '17:00',
    doctorName: 'DR. Favour Ayodele',
    tag: 'General Checkup',
    status: 'Finished',
    ehrNumber: '312890J',
    payment: { billNo: '#1027', amount: 'NGN 12,500.00', status: 'PAID' },
    bioData: {
      fullName: 'Adeniran Ogunsanya',
      phone: '+234 803 777 5544',
      age: 41,
      email: 'a.ogunsanya@yahoo.com',
      gender: 'Male',
      address: '88 Bode Thomas, Surulere, Lagos, Nigeria'
    }
  },

  // Wednesday, Nov 6, 2024 - DR. Sophia Akiheme
  {
    id: 'apt-10',
    patientName: 'Chukwuemeka Phidel',
    patientInitial: 'CP',
    date: '2024-11-06',
    startTime: '09:00',
    endTime: '10:00',
    doctorName: 'DR. Sophia Akiheme',
    tag: 'General Checkup',
    status: 'Unfinished',
    ehrNumber: '112233Y',
    payment: { billNo: '#1016', amount: 'NGN 12,500.00', status: 'UNPAID' },
    bioData: {
      fullName: 'Chukwuemeka Phidel',
      phone: '+234 706 555 4433',
      age: 26,
      email: 'phidel.chukwu@gmail.com',
      gender: 'Male',
      address: '12 Nza Street, Independence Layout, Enugu, Nigeria'
    }
  },
  {
    id: 'apt-11',
    patientName: 'Sophia Wingston',
    patientInitial: 'SW',
    date: '2024-11-06',
    startTime: '11:00',
    endTime: '12:00',
    doctorName: 'DR. Sophia Akiheme',
    tag: 'Registered',
    status: 'Registered',
    ehrNumber: '998811M',
    payment: { billNo: '#1021', amount: 'NGN 14,000.00', status: 'PAID' },
    bioData: {
      fullName: 'Sophia Wingston',
      phone: '+234 814 667 8899',
      age: 33,
      email: 'sophia.wingston@outlook.com',
      gender: 'Female',
      address: '42 GRA Phase 2, Port Harcourt, Rivers, Nigeria'
    }
  },
  {
    id: 'apt-12',
    patientName: 'James Okechukwu',
    patientInitial: 'JO',
    date: '2024-11-06',
    startTime: '15:00',
    endTime: '16:00',
    doctorName: 'DR. Sophia Akiheme',
    tag: 'General Checkup',
    status: 'Finished',
    ehrNumber: '665544W',
    payment: { billNo: '#1026', amount: 'NGN 12,500.00', status: 'PAID' },
    bioData: {
      fullName: 'James Okechukwu',
      phone: '+234 805 111 2222',
      age: 50,
      email: 'james.oke@gmail.com',
      gender: 'Male',
      address: '5 Hospital Road, Aba, Abia, Nigeria'
    }
  }
];
