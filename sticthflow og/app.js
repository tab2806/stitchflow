/* ==========================================================================
   StitchFlow - Core Application Logic
   ========================================================================== */

// --- Application State ---
let state = {
  customers: [],
  orders: [],
  currentView: 'dashboard',
  searchQuery: '',
};

// --- Configured Measurement Fields ---
const MEASUREMENT_FIELDS = {
  shirt: [
    { key: 'collar', label: 'Collar (inch)', placeholder: '15.5' },
    { key: 'chest', label: 'Chest (inch)', placeholder: '40' },
    { key: 'waist', label: 'Waist (inch)', placeholder: '36' },
    { key: 'hip', label: 'Hip (inch)', placeholder: '41' },
    { key: 'sleeve', label: 'Sleeve Length (inch)', placeholder: '25' },
    { key: 'length', label: 'Shirt Length (inch)', placeholder: '30' },
    { key: 'shoulder', label: 'Shoulder (inch)', placeholder: '18' }
  ],
  pants: [
    { key: 'waist', label: 'Waist (inch)', placeholder: '34' },
    { key: 'hip', label: 'Hip (inch)', placeholder: '40' },
    { key: 'inseam', label: 'Inseam (inch)', placeholder: '32' },
    { key: 'outseam', label: 'Outseam (inch)', placeholder: '42' },
    { key: 'thigh', label: 'Thigh (inch)', placeholder: '23' },
    { key: 'bottom', label: 'Bottom/Cuff (inch)', placeholder: '15' }
  ],
  suit: [
    { key: 'chest', label: 'Chest (inch)', placeholder: '42' },
    { key: 'waist', label: 'Waist (inch)', placeholder: '38' },
    { key: 'shoulder', label: 'Shoulder (inch)', placeholder: '18.5' },
    { key: 'sleeve', label: 'Sleeve (inch)', placeholder: '25.5' },
    { key: 'length', label: 'Jacket Length (inch)', placeholder: '29' },
    { key: 'neck', label: 'Neck (inch)', placeholder: '16' }
  ],
  kurta: [
    { key: 'neck', label: 'Neck/Collar (inch)', placeholder: '16' },
    { key: 'chest', label: 'Chest (inch)', placeholder: '42' },
    { key: 'waist', label: 'Waist (inch)', placeholder: '38' },
    { key: 'hip', label: 'Hip (inch)', placeholder: '44' },
    { key: 'shoulder', label: 'Shoulder (inch)', placeholder: '19' },
    { key: 'sleeve', label: 'Sleeve Length (inch)', placeholder: '25' },
    { key: 'length', label: 'Kurta Length (inch)', placeholder: '40' }
  ],
  sherwani: [
    { key: 'neck', label: 'Neck (inch)', placeholder: '16.5' },
    { key: 'chest', label: 'Chest (inch)', placeholder: '44' },
    { key: 'waist', label: 'Waist (inch)', placeholder: '40' },
    { key: 'hip', label: 'Hip (inch)', placeholder: '46' },
    { key: 'shoulder', label: 'Shoulder (inch)', placeholder: '19.5' },
    { key: 'sleeve', label: 'Sleeve Length (inch)', placeholder: '25.5' },
    { key: 'length', label: 'Sherwani Length (inch)', placeholder: '44' }
  ],
  salwar: [
    { key: 'kchest', label: 'Kameez Chest (inch)', placeholder: '36' },
    { key: 'kwaist', label: 'Kameez Waist (inch)', placeholder: '32' },
    { key: 'khip', label: 'Kameez Hip (inch)', placeholder: '38' },
    { key: 'ksleeve', label: 'Kameez Sleeve (inch)', placeholder: '18' },
    { key: 'klength', label: 'Kameez Length (inch)', placeholder: '38' },
    { key: 'swaist', label: 'Salwar Waist (inch)', placeholder: '34' },
    { key: 'slength', label: 'Salwar Length (inch)', placeholder: '39' },
    { key: 'sbottom', label: 'Salwar Bottom (inch)', placeholder: '12' }
  ],
  lehenga: [
    { key: 'bchest', label: 'Choli Chest (inch)', placeholder: '34' },
    { key: 'bwaist', label: 'Choli Waist (inch)', placeholder: '28' },
    { key: 'bshoulder', label: 'Choli Shoulder (inch)', placeholder: '14' },
    { key: 'bsleeve', label: 'Choli Sleeve (inch)', placeholder: '12' },
    { key: 'blength', label: 'Choli Length (inch)', placeholder: '14.5' },
    { key: 'lwaist', label: 'Lehenga Waist (inch)', placeholder: '30' },
    { key: 'lhip', label: 'Lehenga Hip (inch)', placeholder: '38' },
    { key: 'llength', label: 'Lehenga Length (inch)', placeholder: '40' }
  ],
  custom: [
    { key: 'notes', label: 'Custom Sizing Details', placeholder: 'Enter sizing specs here...', isTextarea: true }
  ]
};

// Helper to map apparel types to HTML field prefix ids
function getApparelPrefix(apparelType) {
  const mapping = {
    shirt: 's',
    pants: 'p',
    suit: 'u',
    kurta: 'k',
    sherwani: 'w',
    salwar: 'a',
    lehenga: 'l'
  };
  return mapping[apparelType] || apparelType.substring(0, 1);
}

// --- Mock Initial Data (if storage empty) ---
const MOCK_CUSTOMERS = [
  {
    id: "cust-1",
    name: "Alex Mercer",
    phone: "+1 (555) 019-2834",
    email: "alex@mercer.com",
    address: "742 Evergreen Terrace, Springfield",
    notes: "Prefers slim tailoring and light fabrics. Allergic to wool blends.",
    measurements: {
      shirt: { collar: "15.5", chest: "39", waist: "34", hip: "38", sleeve: "24.5", length: "29.5", shoulder: "17.5" },
      pants: { waist: "32", hip: "38", inseam: "30", outseam: "40", thigh: "22", bottom: "14" }
    },
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000
  },
  {
    id: "cust-2",
    name: "Sarah Jenkins",
    phone: "+1 (555) 014-9988",
    email: "sarah.j@outlook.com",
    address: "109 Baker Street, Flat B, London",
    notes: "Prefers high-waisted cuts and double stitching.",
    measurements: {
      suit: { chest: "36", waist: "28", shoulder: "15.5", sleeve: "23", length: "26.5", neck: "14" }
    },
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000
  },
  {
    id: "cust-3",
    name: "Vikram Singh",
    phone: "+91 98765 43210",
    email: "vikram@singh.in",
    address: "Plot 42, Sector 17, Chandigarh",
    notes: "Prefers traditional fit. Needs extra fabric margins in shirt sleeves.",
    measurements: {
      shirt: { collar: "16.5", chest: "44", waist: "40", hip: "44", sleeve: "26", length: "31", shoulder: "19.5" },
      kurta: { neck: "16.5", chest: "44", waist: "41", hip: "45", shoulder: "19.5", sleeve: "26", length: "42" }
    },
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id: "cust-4",
    name: "Priya Sharma",
    phone: "+91 91234 56789",
    email: "priya@sharma.com",
    address: "A-12, Green Park, New Delhi",
    notes: "Prefers designer embroidery details. Blouse neck deep cut.",
    measurements: {
      lehenga: { bchest: "34", bwaist: "28", bshoulder: "14", bsleeve: "10", blength: "14", lwaist: "30", lhip: "38", llength: "39" }
    },
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000
  }
];

const MOCK_ORDERS = [
  {
    id: "ord-101",
    customerId: "cust-1",
    apparelType: "shirt",
    measurements: { collar: "15.5", chest: "39", waist: "34", hip: "38", sleeve: "24.5", length: "29.5", shoulder: "17.5" },
    status: "pending",
    price: 1500.00,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: "Linen fabric, light blue. Chinese collar design.",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id: "ord-102",
    customerId: "cust-2",
    apparelType: "suit",
    measurements: { chest: "36", waist: "28", shoulder: "15.5", sleeve: "23", length: "26.5", neck: "14" },
    status: "in_progress",
    price: 12000.00,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: "Navy blue tweed fabric. Silk inner lining, gold buttons.",
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000
  },
  {
    id: "ord-103",
    customerId: "cust-3",
    apparelType: "kurta",
    measurements: { neck: "16.5", chest: "44", waist: "41", hip: "45", shoulder: "19.5", sleeve: "26", length: "42" },
    status: "done",
    price: 3500.00,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: "Cream raw silk kurta. Mandarin collar with embroidered placket.",
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000
  },
  {
    id: "ord-104",
    customerId: "cust-4",
    apparelType: "lehenga",
    measurements: { bchest: "34", bwaist: "28", bshoulder: "14", bsleeve: "10", blength: "14", lwaist: "30", lhip: "38", llength: "39" },
    status: "pending",
    price: 45000.00,
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: "Crimson red silk lehenga. Heavy zardozi work, net dupatta.",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000
  }
];

// Safe localStorage wrapper to prevent crashes on file:// protocol
const safeStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage access failed, using session memory:", e);
      return this.fallbackStore[key] || null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage access failed, using session memory:", e);
      this.fallbackStore[key] = value;
    }
  },
  fallbackStore: {}
};

// --- Database Helpers ---
function loadDatabase() {
  const localCustomers = safeStorage.getItem('stitchflow_customers');
  const localOrders = safeStorage.getItem('stitchflow_orders');
  
  if (localCustomers && localOrders) {
    state.customers = JSON.parse(localCustomers);
    state.orders = JSON.parse(localOrders);
  } else {
    // Populate with mock data for first-time use
    state.customers = [...MOCK_CUSTOMERS];
    state.orders = [...MOCK_ORDERS];
    saveDatabase();
  }
  
  // Ensure we seed 50 additional customers programmatically if not seeded yet
  if (!safeStorage.getItem('stitchflow_seeded_50')) {
    generateFiftyCustomers();
    safeStorage.setItem('stitchflow_seeded_50', 'true');
  }
}

function generateFiftyCustomers() {
  const firstNames = [
    "Amit", "Rahul", "Priya", "Sneha", "Rohan", "Neha", "Vikram", "Ananya", "Rajesh", "Sunita",
    "Sanjay", "Deepa", "Aditya", "Pooja", "Arjun", "Kavita", "Manish", "Swati", "Kunal", "Ritu",
    "Suresh", "Meera", "Harish", "Divya", "Vivek", "Anjali", "Abhay", "Geeta", "Nitin", "Kiran",
    "Alok", "Shreya", "Varun", "Riya", "Sandeep", "Shruti", "Gaurav", "Aarti", "Ishaan", "Tanvi",
    "Pranav", "Aditi", "Yash", "Shalini", "Karan", "Payal", "Akash", "Rekha", "Siddharth", "Jyoti"
  ];
  
  const lastNames = [
    "Sharma", "Patel", "Verma", "Iyer", "Reddy", "Sen", "Rao", "Mehta", "Kumar", "Singh",
    "Gupta", "Joshi", "Nair", "Kulkarni", "Das", "Bose", "Banerjee", "Roy", "Dutta", "Mishra",
    "Pandey", "Trivedi", "Kapoor", "Khanna", "Malhotra", "Gill", "Bhatia", "Deshmukh", "Patil", "Shinde"
  ];
  
  const cities = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad"];
  const preferences = [
    "Prefers slim fit, double stitching.",
    "Needs loose fit around chest.",
    "Prefers designer cotton and linen fabrics.",
    "Needs heavy embroidery on sleeves.",
    "Prefers modern cuts and low neck designs.",
    "Wants extra margins inside sleeves for future alteration.",
    "Prefers breathable fabrics only.",
    "Always requests fast delivery."
  ];

  for (let i = 1; i <= 50; i++) {
    const fName = firstNames[(i - 1) % firstNames.length];
    const lName = lastNames[(i * 7) % lastNames.length];
    const name = `${fName} ${lName}`;
    const phone = `+91 ${90000 + i * 137} ${50000 + i * 73}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${10 + i}@gmail.com`;
    const city = cities[i % cities.length];
    const address = `Flat No. ${100 + i * 3}, Block B, Sector ${i % 15 + 1}, ${city}`;
    const note = preferences[i % preferences.length];
    
    const measurements = {};
    const types = ['shirt', 'pants', 'kurta', 'sherwani', 'salwar', 'lehenga'];
    const assignedType = types[i % types.length];
    
    if (assignedType === 'shirt') {
      measurements.shirt = {
        collar: (14.5 + (i % 5) * 0.5).toFixed(1),
        chest: (36 + (i % 6) * 2).toFixed(1),
        waist: (32 + (i % 6) * 2).toFixed(1),
        hip: (37 + (i % 5) * 2).toFixed(1),
        sleeve: (23 + (i % 4) * 0.5).toFixed(1),
        length: (28 + (i % 4) * 0.5).toFixed(1),
        shoulder: (16.5 + (i % 5) * 0.5).toFixed(1)
      };
    } else if (assignedType === 'kurta') {
      measurements.kurta = {
        neck: (15 + (i % 4) * 0.5).toFixed(1),
        chest: (38 + (i % 5) * 2).toFixed(1),
        waist: (34 + (i % 5) * 2).toFixed(1),
        hip: (40 + (i % 5) * 2).toFixed(1),
        shoulder: (17 + (i % 4) * 0.5).toFixed(1),
        sleeve: (24 + (i % 4) * 0.5).toFixed(1),
        length: (38 + (i % 6) * 1).toFixed(1)
      };
    } else if (assignedType === 'lehenga') {
      measurements.lehenga = {
        bchest: (32 + (i % 5) * 2).toFixed(1),
        bwaist: (26 + (i % 4) * 2).toFixed(1),
        bshoulder: (13.5 + (i % 3) * 0.5).toFixed(1),
        bsleeve: (8 + (i % 5) * 1).toFixed(1),
        blength: (13.5 + (i % 4) * 0.5).toFixed(1),
        lwaist: (28 + (i % 5) * 2).toFixed(1),
        lhip: (36 + (i % 5) * 2).toFixed(1),
        llength: (38 + (i % 4) * 1).toFixed(1)
      };
    } else if (assignedType === 'pants') {
      measurements.pants = {
        waist: (30 + (i % 6) * 2).toFixed(1),
        hip: (36 + (i % 6) * 2).toFixed(1),
        inseam: (29 + (i % 4) * 1).toFixed(1),
        outseam: (39 + (i % 4) * 1).toFixed(1),
        thigh: (21 + (i % 4) * 1).toFixed(1),
        bottom: (13 + (i % 3) * 1).toFixed(1)
      };
    } else if (assignedType === 'sherwani') {
      measurements.sherwani = {
        neck: (15.5 + (i % 4) * 0.5).toFixed(1),
        chest: (40 + (i % 5) * 2).toFixed(1),
        waist: (36 + (i % 5) * 2).toFixed(1),
        hip: (42 + (i % 5) * 2).toFixed(1),
        shoulder: (18 + (i % 4) * 0.5).toFixed(1),
        sleeve: (24.5 + (i % 4) * 0.5).toFixed(1),
        length: (42 + (i % 4) * 1).toFixed(1)
      };
    } else if (assignedType === 'salwar') {
      measurements.salwar = {
        kchest: (34 + (i % 5) * 2).toFixed(1),
        kwaist: (30 + (i % 5) * 2).toFixed(1),
        khip: (36 + (i % 5) * 2).toFixed(1),
        ksleeve: (16 + (i % 4) * 1).toFixed(1),
        klength: (36 + (i % 4) * 1).toFixed(1),
        swaist: (32 + (i % 4) * 2).toFixed(1),
        slength: (38 + (i % 4) * 1).toFixed(1),
        sbottom: (11 + (i % 3) * 1).toFixed(1)
      };
    }

    const newCust = {
      id: `cust-seeded-${100 + i}`,
      name,
      phone,
      email,
      address,
      notes: note,
      measurements,
      createdAt: Date.now() - i * 12 * 60 * 60 * 1000,
      updatedAt: Date.now() - i * 12 * 60 * 60 * 1000
    };
    
    state.customers.push(newCust);
  }
  
  saveDatabase();
}

function saveDatabase() {
  safeStorage.setItem('stitchflow_customers', JSON.stringify(state.customers));
  safeStorage.setItem('stitchflow_orders', JSON.stringify(state.orders));
}

// --- Toast Notifications ---
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Icon based on type
  let icon = '';
  if (type === 'success') {
    icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon-sm"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon-sm"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon-sm"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  }
  
  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);
  
  // Auto dismiss
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3500);
}

// --- Modal Helper Actions ---
function openModal(modalId) {
  document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

function resetForm(formId) {
  document.getElementById(formId).reset();
  const hiddenInputs = document.getElementById(formId).querySelectorAll('input[type="hidden"]');
  hiddenInputs.forEach(input => input.value = '');
}

// --- View Router & Rendering ---
function switchView(viewName) {
  state.currentView = viewName;
  
  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.getAttribute('data-view') === viewName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Update Title and Subtitle based on active view
  const title = document.getElementById('page-title');
  const subtitle = document.getElementById('page-subtitle');
  
  if (viewName === 'dashboard') {
    title.textContent = 'Dashboard';
    subtitle.textContent = 'Track and manage orders, statuses and customer profiles.';
  } else if (viewName === 'customers') {
    title.textContent = 'Customers';
    subtitle.textContent = 'Add and edit tailor clients, and update measurement profiles.';
  } else if (viewName === 'orders') {
    title.textContent = 'Tailoring Orders';
    subtitle.textContent = 'Create and edit orders, specify customer sizing records.';
  }
  
  renderView();
}

function renderView() {
  const container = document.getElementById('content-body');
  container.innerHTML = ''; // Clear container
  
  if (state.currentView === 'dashboard') {
    renderDashboard(container);
  } else if (state.currentView === 'customers') {
    renderCustomers(container);
  } else if (state.currentView === 'orders') {
    renderOrders(container);
  }
}

// --- Dashboard View Rendering ---
// --- Dashboard View Rendering ---
function renderDashboard(container) {
  // Count Metrics
  const pendingOrders = state.orders.filter(o => o.status === 'pending');
  const progressOrders = state.orders.filter(o => o.status === 'in_progress');
  const doneOrders = state.orders.filter(o => o.status === 'done');
  
  // Adorable dynamic greeting based on system time
  const hour = new Date().getHours();
  let greeting = "Namaste! 🧵";
  if (hour < 12) greeting = "Good morning, Master Tailor! ☀️";
  else if (hour < 17) greeting = "Good afternoon, Master Tailor! ☀️";
  else greeting = "Good evening, Master Tailor! 🌙";
  
  const metricsHTML = `
    <!-- Adorable Greeting Bar -->
    <div class="dashboard-greeting-bar" style="margin-bottom: 24px; padding: 20px 24px; background: linear-gradient(135deg, rgba(129, 140, 248, 0.08) 0%, rgba(244, 114, 182, 0.08) 100%); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-sm);">
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
          ${greeting}
        </h2>
        <p style="font-size: 13px; color: var(--text-secondary);">"Every stitch you sew is a thread of love and care." Let's create some fashion magic today! ✨</p>
      </div>
      <div style="font-size: 28px; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));">🪡✂️🧣</div>
    </div>
    
    <div class="metrics-row">
      <div class="metric-card" style="border-left: 4px solid var(--accent-indigo); position: relative; overflow: hidden;">
        <div class="metric-icon-wrapper indigo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lg" style="width:24px;height:24px;">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
        </div>
        <div class="metric-info">
          <h3>Happy Clients 💖</h3>
          <p>${state.customers.length}</p>
          <span style="font-size: 11px; color: var(--text-muted); display: block; margin-top: 2px;">Your tailoring family</span>
        </div>
      </div>
      <div class="metric-card" style="border-left: 4px solid var(--status-pending-text); position: relative; overflow: hidden;">
        <div class="metric-icon-wrapper yellow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lg" style="width:24px;height:24px;">
            <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="metric-info">
          <h3>New Requests ⏳</h3>
          <p>${pendingOrders.length}</p>
          <span style="font-size: 11px; color: var(--text-muted); display: block; margin-top: 2px;">Awaiting measurement touch</span>
        </div>
      </div>
      <div class="metric-card" style="border-left: 4px solid var(--status-progress-text); position: relative; overflow: hidden;">
        <div class="metric-icon-wrapper blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lg" style="width:24px;height:24px;">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
        </div>
        <div class="metric-info">
          <h3>On the Machine 🪡</h3>
          <p>${progressOrders.length}</p>
          <span style="font-size: 11px; color: var(--text-muted); display: block; margin-top: 2px;">Needles & steam whirring</span>
        </div>
      </div>
      <div class="metric-card" style="border-left: 4px solid var(--status-done-text); position: relative; overflow: hidden;">
        <div class="metric-icon-wrapper green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lg" style="width:24px;height:24px;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="metric-info">
          <h3>Ready for Trial 🎉</h3>
          <p>${doneOrders.length}</p>
          <span style="font-size: 11px; color: var(--text-muted); display: block; margin-top: 2px;">Stitched & waiting to shine</span>
        </div>
      </div>
    </div>
    
    <!-- Kanban Board Section -->
    <div class="kanban-board">
      
      <!-- Pending Column -->
      <div class="kanban-column" id="col-pending">
        <div class="kanban-header">
          <div class="kanban-title pending">
            <span class="status-indicator"></span>
            Requests Pending
          </div>
          <span class="kanban-count">${pendingOrders.length}</span>
        </div>
        <div class="kanban-cards-container" data-status="pending"></div>
      </div>
      
      <!-- In Progress Column -->
      <div class="kanban-column" id="col-progress">
        <div class="kanban-header">
          <div class="kanban-title progress">
            <span class="status-indicator"></span>
            In Progress
          </div>
          <span class="kanban-count">${progressOrders.length}</span>
        </div>
        <div class="kanban-cards-container" data-status="in_progress"></div>
      </div>
      
      <!-- Done Column -->
      <div class="kanban-column" id="col-done">
        <div class="kanban-header">
          <div class="kanban-title done">
            <span class="status-indicator"></span>
            Done / Ready
          </div>
          <span class="kanban-count">${doneOrders.length}</span>
        </div>
        <div class="kanban-cards-container" data-status="done"></div>
      </div>
      
    </div>
  `;
  
  container.innerHTML = metricsHTML;
  
  // Render cards in columns
  renderKanbanCards('pending', pendingOrders);
  renderKanbanCards('in_progress', progressOrders);
  renderKanbanCards('done', doneOrders);
}

function renderKanbanCards(status, orders) {
  const columnContainer = document.querySelector(`.kanban-cards-container[data-status="${status}"]`);
  columnContainer.innerHTML = '';
  
  if (orders.length === 0) {
    let emptyIcon = '📂';
    let emptyTitle = 'No items';
    let emptySub = 'No orders found.';
    
    if (status === 'pending') {
      emptyIcon = '☕';
      emptyTitle = 'All caught up!';
      emptySub = 'Time for a hot cup of masala chai!';
    } else if (status === 'in_progress') {
      emptyIcon = '✂️';
      emptyTitle = 'Workshop is quiet';
      emptySub = 'No clothes are currently being cut or stitched.';
    } else if (status === 'done') {
      emptyIcon = '📦';
      emptyTitle = 'Hangers are empty!';
      emptySub = 'All finished outfits have been picked up.';
    }
    
    columnContainer.innerHTML = `
      <div class="empty-state" style="padding: 32px 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
        <span style="font-size: 32px; margin-bottom: 12px; display: block; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));">${emptyIcon}</span>
        <h3 style="font-size:13px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">${emptyTitle}</h3>
        <p style="font-size:11px; color: var(--text-secondary); max-width: 160px; line-height: 1.4;">${emptySub}</p>
      </div>
    `;
    return;
  }
  
  orders.forEach(order => {
    const customer = state.customers.find(c => c.id === order.customerId);
    const customerName = customer ? customer.name : 'Unknown Customer';
    
    // Check if due date is soon or passed
    const isUrgent = order.status !== 'done' && (new Date(order.dueDate) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
    
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.innerHTML = `
      <div class="card-header">
        <span class="order-number">${order.id}</span>
        <span class="apparel-badge ${order.apparelType}">${order.apparelType}</span>
      </div>
      <div class="customer-name">${customerName}</div>
      <div class="card-details">
        <span class="due-date ${isUrgent ? 'urgent' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sm">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          ${formatDateString(order.dueDate)}
        </span>
        <div class="card-actions">
          ${status !== 'pending' ? `
            <button class="action-btn-mini move-left-btn" title="Move back">
              &larr;
            </button>
          ` : ''}
          <button class="action-btn-mini edit-order-btn" title="Edit Order">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sm">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          ${status !== 'done' ? `
            <button class="action-btn-mini move-right-btn" title="Move forward">
              &rarr;
            </button>
          ` : ''}
        </div>
      </div>
    `;
    
    // Add Click action to open order details/edit
    card.addEventListener('click', (e) => {
      // Avoid modal opening if clicking small buttons
      if (e.target.closest('.action-btn-mini')) return;
      openEditOrderModal(order.id);
    });
    
    // Wire up mini buttons
    const leftBtn = card.querySelector('.move-left-btn');
    const rightBtn = card.querySelector('.move-right-btn');
    const editBtn = card.querySelector('.edit-order-btn');
    
    if (leftBtn) {
      leftBtn.addEventListener('click', () => changeOrderStatus(order.id, status === 'done' ? 'in_progress' : 'pending'));
    }
    if (rightBtn) {
      rightBtn.addEventListener('click', () => changeOrderStatus(order.id, status === 'pending' ? 'in_progress' : 'done'));
    }
    if (editBtn) {
      editBtn.addEventListener('click', () => openEditOrderModal(order.id));
    }
    
    columnContainer.appendChild(card);
  });
}

function changeOrderStatus(orderId, newStatus) {
  const orderIdx = state.orders.findIndex(o => o.id === orderId);
  if (orderIdx !== -1) {
    state.orders[orderIdx].status = newStatus;
    state.orders[orderIdx].updatedAt = Date.now();
    saveDatabase();
    renderView();
    showToast(`Order status updated to: ${newStatus.replace('_', ' ')}`);
    
    if (newStatus === 'done') {
      triggerOrderCompletionNotification(orderId);
    }
  }
}

function triggerOrderCompletionNotification(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  const customer = state.customers.find(c => c.id === order.customerId);
  if (!customer) return;

  document.getElementById('notif-customer-name').textContent = `Notify ${customer.name}`;
  document.getElementById('notif-customer-phone').textContent = `Phone: ${customer.phone}`;
  
  const message = `Namaste ${customer.name}!\n\nYour order of ${order.apparelType.toUpperCase()} (${order.id}) has been completed successfully! 🧵✨\n\nYou can collect it from our shop at your convenience.\n\nThank you for choosing StitchFlow!`;
  document.getElementById('notif-message-preview').textContent = message;
  
  // Setup WhatsApp Button
  const waBtn = document.getElementById('notif-send-whatsapp-btn');
  const newWaBtn = waBtn.cloneNode(true);
  waBtn.parentNode.replaceChild(newWaBtn, waBtn);
  
  newWaBtn.addEventListener('click', () => {
    const cleanPhone = cleanPhoneNumberForWhatsapp(customer.phone);
    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
    closeModal('notification-modal');
    showToast("WhatsApp Web opened in a new tab!", "success");
  });
  
  // Setup SMS Simulation Button
  const smsBtn = document.getElementById('notif-simulate-sms-btn');
  const newSmsBtn = smsBtn.cloneNode(true);
  smsBtn.parentNode.replaceChild(newSmsBtn, smsBtn);
  
  newSmsBtn.addEventListener('click', () => {
    closeModal('notification-modal');
    showToast(`Carrier SMS dispatched successfully to: ${customer.phone}`, "success");
  });
  
  openModal('notification-modal');
}

function cleanPhoneNumberForWhatsapp(phone) {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

// --- Customer View Rendering ---
function renderCustomers(container) {
  // Search and Add layout
  const headerHTML = `
    <div class="control-bar">
      <div class="search-box-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" class="search-input" id="customer-search" placeholder="Search customers by name or phone..." value="${state.searchQuery}">
      </div>
      <button class="btn btn-primary" id="add-customer-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sm">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Customer
      </button>
    </div>
    
    <!-- Table wrapper -->
    <div class="table-responsive">
      <table class="data-table" id="customers-table">
        <thead>
          <tr>
            <th>Customer Info</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Measurements</th>
            <th>Total Orders</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Customers rendered here -->
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = headerHTML;
  
  // Wire up event listeners
  document.getElementById('customer-search').addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase();
    filterAndRenderCustomers();
  });
  
  document.getElementById('add-customer-btn').addEventListener('click', () => {
    resetForm('customer-form');
    document.getElementById('customer-modal-title').textContent = 'Add New Customer';
    openModal('customer-modal');
  });
  
  filterAndRenderCustomers();
}

function filterAndRenderCustomers() {
  const tbody = document.querySelector('#customers-table tbody');
  tbody.innerHTML = '';
  
  const filtered = state.customers.filter(c => {
    return c.name.toLowerCase().includes(state.searchQuery) || 
           c.phone.includes(state.searchQuery);
  });
  
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <h3>No Customers Found</h3>
            <p>Try searching for a different name or add a new customer.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  filtered.forEach(customer => {
    const custOrders = state.orders.filter(o => o.customerId === customer.id);
    
    // Active sizing profiles
    const savedTypes = Object.keys(customer.measurements || {});
    const sizingBadges = savedTypes.length > 0 
      ? savedTypes.map(t => `<span class="apparel-badge ${t}">${t}</span>`).join(' ')
      : `<span style="font-size:12px;color:var(--text-muted);">None saved</span>`;
      
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="customer-meta-info">
          <span class="customer-meta-name">${customer.name}</span>
          <span class="customer-meta-id">ID: ${customer.id.substring(0, 8)}</span>
        </div>
      </td>
      <td>${customer.phone}</td>
      <td>${customer.email || '<span style="color:var(--text-muted)">-</span>'}</td>
      <td><div style="display:flex;gap:4px;flex-wrap:wrap;">${sizingBadges}</div></td>
      <td style="font-weight:600;padding-left:45px;">${custOrders.length}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-secondary btn-sm view-details-btn" data-id="${customer.id}" title="Customer Profile">
            Details
          </button>
          <button class="btn btn-secondary btn-sm edit-measurements-btn" data-id="${customer.id}" title="Edit Sizing Record">
            Sizing
          </button>
          <button class="btn btn-secondary btn-sm edit-customer-btn" data-id="${customer.id}">
            Edit
          </button>
          <button class="btn btn-danger btn-sm delete-customer-btn" data-id="${customer.id}">
            Remove
          </button>
        </div>
      </td>
    `;
    
    // Event wiring
    tr.querySelector('.view-details-btn').addEventListener('click', () => openCustomerDetailModal(customer.id));
    tr.querySelector('.edit-measurements-btn').addEventListener('click', () => openMeasurementsModal(customer.id));
    tr.querySelector('.edit-customer-btn').addEventListener('click', () => openEditCustomerModal(customer.id));
    tr.querySelector('.delete-customer-btn').addEventListener('click', () => removeCustomer(customer.id));
    
    tbody.appendChild(tr);
  });
}

function openEditCustomerModal(customerId) {
  const customer = state.customers.find(c => c.id === customerId);
  if (!customer) return;
  
  resetForm('customer-form');
  document.getElementById('customer-id').value = customer.id;
  document.getElementById('c-name').value = customer.name;
  document.getElementById('c-phone').value = customer.phone;
  document.getElementById('c-email').value = customer.email || '';
  document.getElementById('c-address').value = customer.address || '';
  document.getElementById('c-notes').value = customer.notes || '';
  
  document.getElementById('customer-modal-title').textContent = 'Edit Customer Details';
  openModal('customer-modal');
}

function removeCustomer(customerId) {
  const customer = state.customers.find(c => c.id === customerId);
  if (!customer) return;
  
  if (confirm(`Are you sure you want to remove customer "${customer.name}"? This will delete all their historical measurements and linked orders.`)) {
    // Delete customer
    state.customers = state.customers.filter(c => c.id !== customerId);
    // Delete their orders
    state.orders = state.orders.filter(o => o.customerId !== customerId);
    
    saveDatabase();
    renderView();
    showToast(`Customer "${customer.name}" removed successfully.`, 'warning');
  }
}

// --- Measurements Profile Modal actions ---
function openMeasurementsModal(customerId) {
  const customer = state.customers.find(c => c.id === customerId);
  if (!customer) return;
  
  resetForm('measurement-form');
  document.getElementById('m-customer-id').value = customer.id;
  document.getElementById('measurement-modal-subtitle').textContent = `Update measurements for ${customer.name}`;
  
  // Set tab active based on first available or shirt
  const activeTabBtn = document.querySelector('#measurement-modal .tab-btn.active');
  const apparelType = activeTabBtn ? activeTabBtn.getAttribute('data-apparel') : 'shirt';
  
  loadApparelSizingFields(customer, apparelType);
  openModal('measurement-modal');
}

function loadApparelSizingFields(customer, apparelType) {
  document.getElementById('m-apparel-type').value = apparelType;
  
  // Hide all sections, show active
  document.querySelectorAll('.apparel-fields-section').forEach(s => s.classList.add('hidden'));
  document.getElementById(`fields-${apparelType}`).classList.remove('hidden');
  
  // Fill values from customer's profile if they exist
  const savedVals = customer.measurements && customer.measurements[apparelType] 
    ? customer.measurements[apparelType] 
    : {};
    
  if (apparelType === 'custom') {
    document.getElementById('m-c-notes').value = savedVals.notes || '';
  } else {
    // Standard numerical fields
    MEASUREMENT_FIELDS[apparelType].forEach(field => {
      const input = document.getElementById(`m-${getApparelPrefix(apparelType)}-${field.key}`);
      if (input) {
        input.value = savedVals[field.key] || '';
      }
    });
  }
}

// --- Customer Detail Modal Rendering ---
function openCustomerDetailModal(customerId) {
  const customer = state.customers.find(c => c.id === customerId);
  if (!customer) return;
  
  document.getElementById('detail-customer-name').textContent = customer.name;
  document.getElementById('detail-customer-contact').textContent = `Phone: ${customer.phone} | Email: ${customer.email || 'None'}`;
  document.getElementById('detail-customer-address').textContent = customer.address || 'No address stored';
  document.getElementById('detail-customer-notes').textContent = customer.notes || 'No customer preference notes stored';
  
  // Sizing tabs
  const chipsContainer = document.getElementById('detail-active-profiles');
  chipsContainer.innerHTML = '';
  
  const savedTypes = Object.keys(customer.measurements || {});
  
  if (savedTypes.length === 0) {
    chipsContainer.innerHTML = '<span style="font-size:12.5px;color:var(--text-muted)">No sizing profiles created yet.</span>';
    document.getElementById('detail-sizing-display').innerHTML = '<p class="placeholder-text">Save measurements to view sizes here.</p>';
  } else {
    savedTypes.forEach((type, idx) => {
      const chip = document.createElement('span');
      chip.className = `profile-chip ${idx === 0 ? 'active' : ''}`;
      chip.textContent = type;
      chip.addEventListener('click', () => {
        document.querySelectorAll('.profile-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderSizingSnapshot(customer.measurements[type], type);
      });
      chipsContainer.appendChild(chip);
    });
    
    // Render first sizing profile snapshot
    renderSizingSnapshot(customer.measurements[savedTypes[0]], savedTypes[0]);
  }
  
  // Render order history
  const orderList = document.getElementById('detail-customer-orders');
  orderList.innerHTML = '';
  
  const custOrders = state.orders.filter(o => o.customerId === customer.id)
    .sort((a,b) => b.createdAt - a.createdAt); // Newest first
    
  if (custOrders.length === 0) {
    orderList.innerHTML = '<div class="placeholder-text">No order history for this customer.</div>';
  } else {
    custOrders.forEach(order => {
      const div = document.createElement('div');
      div.className = 'detail-order-item';
      div.innerHTML = `
        <div>
          <div class="order-badge-row">
            <h4>${order.id}</h4>
            <span class="apparel-badge ${order.apparelType}">${order.apparelType}</span>
            <span class="status-badge ${order.status}">${order.status.replace('_', ' ')}</span>
          </div>
          <div class="order-subtext">Due: ${formatDateString(order.dueDate)} ${order.price ? `| Price: ₹${order.price.toFixed(2)}` : ''}</div>
        </div>
        <button class="btn btn-secondary btn-sm edit-order-btn-direct" data-order-id="${order.id}">
          Edit
        </button>
      `;
      div.querySelector('.edit-order-btn-direct').addEventListener('click', () => {
        closeModal('customer-detail-modal');
        openEditOrderModal(order.id);
      });
      orderList.appendChild(div);
    });
  }
  
  // Set up Edit profile button inside details modal
  const editMeasBtn = document.getElementById('detail-edit-measurements-btn');
  // Remove old event listeners by cloning
  const newEditMeasBtn = editMeasBtn.cloneNode(true);
  editMeasBtn.parentNode.replaceChild(newEditMeasBtn, editMeasBtn);
  newEditMeasBtn.addEventListener('click', () => {
    closeModal('customer-detail-modal');
    openMeasurementsModal(customer.id);
  });
  
  openModal('customer-detail-modal');
}

function renderSizingSnapshot(measValues, type) {
  const container = document.getElementById('detail-sizing-display');
  container.innerHTML = '';
  
  if (type === 'custom') {
    container.innerHTML = `
      <div style="font-size: 13px; line-height: 1.5; white-space: pre-wrap;" class="text-secondary">
        ${measValues.notes || 'No detailed specifications recorded.'}
      </div>
    `;
    return;
  }
  
  const fields = MEASUREMENT_FIELDS[type];
  fields.forEach(f => {
    const div = document.createElement('div');
    div.className = 'sizing-item-row';
    div.innerHTML = `
      <span class="sizing-label">${f.label.split(' ')[0]}</span>
      <span class="sizing-value">${measValues[f.key] ? measValues[f.key] + '"' : '-'}</span>
    `;
    container.appendChild(div);
  });
}

// --- Orders View Rendering ---
function renderOrders(container) {
  const layoutHTML = `
    <div class="control-bar">
      <div style="display:flex;gap:12px;flex-grow:1;max-width:550px;">
        <div class="search-box-wrapper" style="max-width:320px;">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" class="search-input" id="order-search" placeholder="Search by Order ID or Client Name...">
        </div>
        <select id="order-filter-status" style="width:160px;">
          <option value="all">All Statuses</option>
          <option value="pending">Request Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Completed / Done</option>
        </select>
      </div>
      <button class="btn btn-primary" id="add-order-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sm">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Order
      </button>
    </div>
    
    <div class="table-responsive">
      <table class="data-table" id="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Apparel</th>
            <th>Due Date</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Orders list will go here -->
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = layoutHTML;
  
  // Wire filters
  document.getElementById('order-search').addEventListener('input', filterAndRenderOrders);
  document.getElementById('order-filter-status').addEventListener('change', filterAndRenderOrders);
  document.getElementById('add-order-btn').addEventListener('click', openNewOrderModal);
  
  filterAndRenderOrders();
}

function filterAndRenderOrders() {
  const tbody = document.querySelector('#orders-table tbody');
  tbody.innerHTML = '';
  
  const searchVal = document.getElementById('order-search').value.toLowerCase();
  const statusFilter = document.getElementById('order-filter-status').value;
  
  const filtered = state.orders.filter(order => {
    const customer = state.customers.find(c => c.id === order.customerId);
    const clientName = customer ? customer.name.toLowerCase() : '';
    
    const matchesSearch = order.id.toLowerCase().includes(searchVal) || clientName.includes(searchVal);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a,b) => b.createdAt - a.createdAt);
  
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            </svg>
            <h3>No Orders Found</h3>
            <p>Try refining filters or create a new stitching order.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  filtered.forEach(order => {
    const customer = state.customers.find(c => c.id === order.customerId);
    const customerName = customer ? customer.name : 'Unknown';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700;">${order.id}</td>
      <td>${customerName}</td>
      <td><span class="apparel-badge ${order.apparelType}">${order.apparelType}</span></td>
      <td>${formatDateString(order.dueDate)}</td>
      <td>${order.price ? `₹${order.price.toFixed(2)}` : '<span style="color:var(--text-muted)">-</span>'}</td>
      <td><span class="status-badge ${order.status}">${order.status.replace('_', ' ')}</span></td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-secondary btn-sm edit-order-btn-row" data-id="${order.id}">
            Edit
          </button>
          <button class="btn btn-danger btn-sm delete-order-btn-row" data-id="${order.id}">
            Remove
          </button>
        </div>
      </td>
    `;
    
    tr.querySelector('.edit-order-btn-row').addEventListener('click', () => openEditOrderModal(order.id));
    tr.querySelector('.delete-order-btn-row').addEventListener('click', () => removeOrder(order.id));
    tbody.appendChild(tr);
  });
}

// --- Order Creation Modal Setup ---
function populateCustomerDropdown(selectId, selectedId = null) {
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="" disabled selected>Choose a customer...</option>';
  
  // Sort alphabetically
  const sorted = [...state.customers].sort((a,b) => a.name.localeCompare(b.name));
  
  sorted.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = `${c.name} (${c.phone})`;
    if (selectedId && c.id === selectedId) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}

function renderOrderMeasurementFields(customer, apparelType, existingValues = null) {
  const container = document.getElementById('order-measurements-fields');
  container.innerHTML = '';
  
  if (!customer) {
    container.innerHTML = '<p class="placeholder-text">Please select a customer to load measurement profiles.</p>';
    return;
  }
  
  const fields = MEASUREMENT_FIELDS[apparelType];
  // Determine if customer has saved measurements for this apparel
  const savedProfile = customer.measurements && customer.measurements[apparelType] 
    ? customer.measurements[apparelType] 
    : {};
    
  if (apparelType === 'custom') {
    const savedNotes = existingValues ? existingValues.notes : (savedProfile.notes || '');
    container.style.gridTemplateColumns = '1fr';
    container.innerHTML = `
      <div class="form-group" style="margin-bottom:0;">
        <label for="o-m-notes">Stitching details / Custom Sizes</label>
        <textarea id="o-m-notes" rows="4" placeholder="e.g. Length: 40'', Shoulder: 18''">${savedNotes}</textarea>
      </div>
    `;
  } else {
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(110px, 1fr))';
    fields.forEach(field => {
      const val = existingValues ? existingValues[field.key] : (savedProfile[field.key] || '');
      const div = document.createElement('div');
      div.className = 'form-group';
      div.style.marginBottom = '0';
      div.innerHTML = `
        <label for="o-m-${field.key}" style="font-size:11px; margin-bottom:4px;">${field.label.split(' ')[0]}</label>
        <input type="number" step="0.1" id="o-m-${field.key}" value="${val}" placeholder="${field.placeholder}" style="padding: 6px 10px; font-size:13px;">
      `;
      container.appendChild(div);
    });
  }
}

function openNewOrderModal() {
  resetForm('order-form');
  document.getElementById('order-modal-title').textContent = 'Create New Tailoring Order';
  
  populateCustomerDropdown('o-customer-id');
  document.getElementById('o-apparel').value = 'shirt';
  document.getElementById('o-status').value = 'pending';
  document.getElementById('o-due-date').value = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default: 7 days
  
  const fieldsContainer = document.getElementById('order-measurements-fields');
  fieldsContainer.innerHTML = '<p class="placeholder-text">Select a customer above to pre-load measurement data.</p>';
  
  openModal('order-modal');
}

function openEditOrderModal(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  
  resetForm('order-form');
  document.getElementById('order-modal-title').textContent = `Edit Order: ${order.id}`;
  document.getElementById('order-id').value = order.id;
  
  populateCustomerDropdown('o-customer-id', order.customerId);
  document.getElementById('o-apparel').value = order.apparelType;
  document.getElementById('o-price').value = order.price || '';
  document.getElementById('o-due-date').value = order.dueDate;
  document.getElementById('o-status').value = order.status;
  document.getElementById('o-notes').value = order.notes || '';
  
  // Render snapshot sizing fields
  const customer = state.customers.find(c => c.id === order.customerId);
  renderOrderMeasurementFields(customer, order.apparelType, order.measurements);
  
  openModal('order-modal');
}

function removeOrder(orderId) {
  if (confirm(`Are you sure you want to delete order "${orderId}"?`)) {
    state.orders = state.orders.filter(o => o.id !== orderId);
    saveDatabase();
    renderView();
    showToast(`Order "${orderId}" deleted.`, 'warning');
  }
}

// --- Date Formatter ---
function formatDateString(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d)) return isoString;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// --- Import & Export Controller ---
function exportData() {
  const backup = {
    version: '1.0',
    exportedAt: Date.now(),
    customers: state.customers,
    orders: state.orders
  };
  
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href",     dataStr     );
  dlAnchorElem.setAttribute("download", `stitchflow_backup_${new Date().toISOString().split('T')[0]}.json`);
  dlAnchorElem.click();
  showToast('Database backup downloaded successfully.');
}

function handleImportData(e) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);
      if (data.customers && data.orders) {
        state.customers = data.customers;
        state.orders = data.orders;
        saveDatabase();
        renderView();
        showToast('Backup restored successfully!', 'success');
      } else {
        showToast('Invalid backup file structure.', 'error');
      }
    } catch(err) {
      showToast('Error reading database file.', 'error');
    }
  };
  if (e.target.files[0]) {
    fileReader.readAsText(e.target.files[0]);
  }
}

// --- Initialize Event Wiring ---
document.addEventListener('DOMContentLoaded', () => {
  // Load local database
  loadDatabase();
  
  // Welcome Splash Screen transition handler
  const enterBtn = document.getElementById('enter-app-btn');
  const splash = document.getElementById('splash-screen');
  if (enterBtn && splash) {
    enterBtn.addEventListener('click', () => {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
      }, 600); // Match CSS transition duration
    });
  }
  
  // Navigation sidebar buttons routing
  document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', () => {
      const view = button.getAttribute('data-view');
      switchView(view);
    });
  });
  
  // Quick Order button in Top Header
  document.getElementById('quick-order-btn').addEventListener('click', openNewOrderModal);
  
  // Backups Import/Export actions
  document.getElementById('export-db-btn').addEventListener('click', exportData);
  const importTrigger = document.getElementById('import-db-trigger');
  const importInput = document.getElementById('import-db-input');
  importTrigger.addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', handleImportData);
  
  // Modal closer wiring
  document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', () => {
      const targetModal = button.getAttribute('data-close');
      closeModal(targetModal);
    });
  });
  
  // Close modal when clicking dark overlay outside card
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  // --- Dynamic measurement tabs in sizing profile modal ---
  document.querySelectorAll('#measurement-modal .tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('#measurement-modal .tab-btn').forEach(btn => btn.classList.remove('active'));
      tabBtn.classList.add('active');
      
      const apparelType = tabBtn.getAttribute('data-apparel');
      const customerId = document.getElementById('m-customer-id').value;
      const customer = state.customers.find(c => c.id === customerId);
      
      if (customer) {
        loadApparelSizingFields(customer, apparelType);
      }
    });
  });

  // --- Order form reactive behaviors ---
  const orderCustSelect = document.getElementById('o-customer-id');
  const orderApparelSelect = document.getElementById('o-apparel');
  
  const updateOrderFormFields = () => {
    const custId = orderCustSelect.value;
    const apparelType = orderApparelSelect.value;
    const customer = state.customers.find(c => c.id === custId);
    
    if (customer) {
      renderOrderMeasurementFields(customer, apparelType);
    }
  };
  
  orderCustSelect.addEventListener('change', updateOrderFormFields);
  orderApparelSelect.addEventListener('change', updateOrderFormFields);

  // --- Forms submissions handlers ---
  
  // 1. Customer Add/Edit Submit
  document.getElementById('customer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('customer-id').value;
    const name = document.getElementById('c-name').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const address = document.getElementById('c-address').value.trim();
    const notes = document.getElementById('c-notes').value.trim();
    
    if (id) {
      // Edit Customer Mode
      const customerIdx = state.customers.findIndex(c => c.id === id);
      if (customerIdx !== -1) {
        state.customers[customerIdx] = {
          ...state.customers[customerIdx],
          name, phone, email, address, notes,
          updatedAt: Date.now()
        };
        showToast('Customer details updated.');
      }
    } else {
      // Add Customer Mode
      const newCustomer = {
        id: 'cust-' + Date.now(),
        name, phone, email, address, notes,
        measurements: {},
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      state.customers.push(newCustomer);
      showToast('Customer added successfully!');
    }
    
    saveDatabase();
    closeModal('customer-modal');
    renderView();
  });
  
  // 2. Customer Measurements Profile Submit
  document.getElementById('measurement-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const customerId = document.getElementById('m-customer-id').value;
    const apparelType = document.getElementById('m-apparel-type').value;
    const customerIdx = state.customers.findIndex(c => c.id === customerId);
    
    if (customerIdx === -1) return;
    
    const measurements = { ...state.customers[customerIdx].measurements };
    const values = {};
    
    if (apparelType === 'custom') {
      values.notes = document.getElementById('m-c-notes').value.trim();
    } else {
      MEASUREMENT_FIELDS[apparelType].forEach(field => {
        const input = document.getElementById(`m-${getApparelPrefix(apparelType)}-${field.key}`);
        if (input && input.value !== '') {
          values[field.key] = input.value;
        }
      });
    }
    
    measurements[apparelType] = values;
    state.customers[customerIdx].measurements = measurements;
    state.customers[customerIdx].updatedAt = Date.now();
    
    saveDatabase();
    closeModal('measurement-modal');
    renderView();
    showToast(`Saved sizing profile for: ${apparelType.toUpperCase()}`);
  });
  
  // 3. Order Add/Edit Submit
  document.getElementById('order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('order-id').value;
    const customerId = document.getElementById('o-customer-id').value;
    const apparelType = document.getElementById('o-apparel').value;
    const priceVal = document.getElementById('o-price').value;
    const dueDate = document.getElementById('o-due-date').value;
    const status = document.getElementById('o-status').value;
    const notes = document.getElementById('o-notes').value.trim();
    
    const price = priceVal !== '' ? parseFloat(priceVal) : undefined;
    
    // Gather sizing snapshot values from the form inputs
    const measurements = {};
    if (apparelType === 'custom') {
      const textarea = document.getElementById('o-m-notes');
      if (textarea) measurements.notes = textarea.value.trim();
    } else {
      MEASUREMENT_FIELDS[apparelType].forEach(field => {
        const input = document.getElementById(`o-m-${field.key}`);
        if (input && input.value !== '') {
          measurements[field.key] = input.value;
        }
      });
    }
    
    if (id) {
      // Edit Order Mode
      const orderIdx = state.orders.findIndex(o => o.id === id);
      if (orderIdx !== -1) {
        const oldStatus = state.orders[orderIdx].status;
        state.orders[orderIdx] = {
          ...state.orders[orderIdx],
          customerId, apparelType, measurements, price, dueDate, status, notes,
          updatedAt: Date.now()
        };
        showToast(`Order details for "${id}" updated.`);
        if (status === 'done' && oldStatus !== 'done') {
          triggerOrderCompletionNotification(id);
        }
      }
    } else {
      // New Order Mode
      const nextIdNum = state.orders.length > 0 
        ? Math.max(...state.orders.map(o => parseInt(o.id.split('-')[1]) || 100)) + 1
        : 101;
      
      const newOrder = {
        id: `ord-${nextIdNum}`,
        customerId,
        apparelType,
        measurements,
        status,
        price,
        dueDate,
        notes,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      state.orders.push(newOrder);
      showToast(`Stitching order ${newOrder.id} created.`);
      if (status === 'done') {
        triggerOrderCompletionNotification(newOrder.id);
      }
    }
    
    saveDatabase();
    closeModal('order-modal');
    renderView();
  });
  
  // Default routing render
  switchView('dashboard');
});
