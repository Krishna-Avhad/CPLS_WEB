// Chavan-Podar Jumbo Kids Admin Dashboard JavaScript Integration

let supabaseClient = null;
let allEnquiries = [];
let filteredEnquiries = [];
let selectedEnquiryId = null;
let selectedStatus = 'pending';

// Initialize immediately
initSupabase();
if (supabaseClient) {
  fetchEnquiries();
} else {
  // Show configuration warning if client couldn't be created
  document.getElementById('config-status-warning').style.display = 'block';
  hideLoader();
}

// Setup Supabase Client
function initSupabase() {
  const isConfigured = 
    typeof SUPABASE_URL !== 'undefined' && 
    typeof SUPABASE_ANON_KEY !== 'undefined' &&
    SUPABASE_URL && 
    SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' && 
    SUPABASE_ANON_KEY && 
    SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

  if (isConfigured) {
    try {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      document.getElementById('config-status-warning').style.display = 'none';
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err);
      alert("Error initializing Supabase client. Please check your credentials config.");
    }
  }
}

// Fetch Enquiries from Supabase Database
async function fetchEnquiries() {
  if (!supabaseClient) return;
  showLoader();

  try {
    const { data, error } = await supabaseClient
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    allEnquiries = data || [];
    calculateMetrics();
    filterData();

  } catch (error) {
    console.error("Error loading enquiries:", error);
    alert("Could not load data from Supabase. Make sure your schema is set up and tables exist.");
  } finally {
    hideLoader();
  }
}

// Calculate Dashboard Metric Stats
function calculateMetrics() {
  const total = allEnquiries.length;
  const pending = allEnquiries.filter(e => e.status === 'pending').length;
  const called = allEnquiries.filter(e => e.status === 'called' || e.status === 'visited').length;
  const admitted = allEnquiries.filter(e => e.status === 'admitted').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-called').textContent = called;
  document.getElementById('stat-admitted').textContent = admitted;
}

// Search & Filter Logic
function filterData() {
  const searchVal = document.getElementById('search-input').value.toLowerCase().trim();
  const programVal = document.getElementById('filter-program').value;
  const statusVal = document.getElementById('filter-status').value;

  filteredEnquiries = allEnquiries.filter(e => {
    // 1. Text Search match
    const parentMatch = e.parent_name ? e.parent_name.toLowerCase().includes(searchVal) : false;
    const childMatch = e.child_name ? e.child_name.toLowerCase().includes(searchVal) : false;
    const mobileMatch = e.mobile ? e.mobile.includes(searchVal) : false;
    const emailMatch = e.email ? e.email.toLowerCase().includes(searchVal) : false;
    const searchMatch = !searchVal || parentMatch || childMatch || mobileMatch || emailMatch;

    // 2. Program Filter match
    const programMatch = programVal === 'all' || e.program === programVal || (e.program && e.program.startsWith(programVal));

    // 3. Status Filter match
    const statusMatch = statusVal === 'all' || e.status === statusVal;

    return searchMatch && programMatch && statusMatch;
  });

  renderList();
}

// Render filtered enquiries in the table
function renderList() {
  const listContainer = document.getElementById('enquiries-list');
  const noResults = document.getElementById('no-results');
  
  listContainer.innerHTML = '';

  if (filteredEnquiries.length === 0) {
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  filteredEnquiries.forEach(e => {
    const row = document.createElement('tr');
    
    // Format Date
    const submitDate = new Date(e.created_at);
    const dateStr = submitDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = submitDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    row.innerHTML = `
      <td>
        <div class="row-date">${dateStr}</div>
        <div style="font-size:0.75rem;color:var(--text-light);">${timeStr}</div>
      </td>
      <td class="bold-text">${escapeHTML(e.parent_name)}</td>
      <td>${escapeHTML(e.child_name)}</td>
      <td><span class="program-tag">${escapeHTML(e.program)}</span></td>
      <td><a href="tel:${e.mobile}" style="color:inherit;text-decoration:none;font-weight:600;">📞 ${escapeHTML(e.mobile)}</a></td>
      <td><span class="status-badge status-${e.status}">${e.status}</span></td>
      <td>
        <button class="btn-view" onclick="openDetails('${e.id}')">👁️ View</button>
      </td>
    `;
    listContainer.appendChild(row);
  });
}

// Open Detail Modal
function openDetails(id) {
  const enquiry = allEnquiries.find(e => e.id === id);
  if (!enquiry) return;

  selectedEnquiryId = id;
  selectedStatus = enquiry.status;

  // Set standard details
  const submitDate = new Date(enquiry.created_at);
  document.getElementById('modal-date').textContent = "Submitted on " + submitDate.toLocaleString('en-IN');
  document.getElementById('modal-parent').textContent = enquiry.parent_name;
  document.getElementById('modal-mobile').textContent = enquiry.mobile;
  document.getElementById('modal-child').textContent = enquiry.child_name;
  document.getElementById('modal-program').textContent = enquiry.program;
  document.getElementById('modal-email').textContent = enquiry.email || 'N/A';
  document.getElementById('modal-message').textContent = enquiry.message || 'No custom message left.';
  document.getElementById('modal-notes').value = enquiry.notes || '';

  // Setup Call Link
  document.getElementById('modal-call-link').href = `tel:${enquiry.mobile}`;

  // Highlight active status pill
  updateStatusPillsUI(enquiry.status);

  // Show Modal
  const modal = document.getElementById('detailModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Change status selection in UI pills
function updateStatus(status) {
  selectedStatus = status;
  updateStatusPillsUI(status);
}

// Helper to color and toggle active class on status selection
function updateStatusPillsUI(activeStatus) {
  const pills = document.querySelectorAll('.status-selector-pills .pill-btn');
  pills.forEach(pill => {
    pill.classList.remove('active');
    
    // Check classes to determine if match
    if (pill.classList.contains(`status-${activeStatus}`)) {
      pill.classList.add('active');
    }
  });
}

// Close Modal
function closeModal() {
  document.getElementById('detailModal').classList.remove('open');
  document.body.style.overflow = '';
  selectedEnquiryId = null;
}

// Save Changes (Status, Notes) to Supabase
async function saveEnquiryChanges() {
  if (!supabaseClient || !selectedEnquiryId) return;

  const notesText = document.getElementById('modal-notes').value;
  showLoader();

  try {
    const { error } = await supabaseClient
      .from('enquiries')
      .update({
        status: selectedStatus,
        notes: notesText
      })
      .eq('id', selectedEnquiryId);

    if (error) throw error;

    // Update locally
    const idx = allEnquiries.findIndex(e => e.id === selectedEnquiryId);
    if (idx !== -1) {
      allEnquiries[idx].status = selectedStatus;
      allEnquiries[idx].notes = notesText;
    }

    calculateMetrics();
    filterData();
    closeModal();

  } catch (err) {
    console.error("Error saving updates:", err);
    alert("Could not update database: " + err.message);
  } finally {
    hideLoader();
  }
}

// Delete Enquiry from Supabase
async function deleteEnquiry() {
  if (!supabaseClient || !selectedEnquiryId) return;

  const confirmed = confirm("Are you sure you want to permanently delete this enquiry? This action cannot be undone.");
  if (!confirmed) return;

  showLoader();

  try {
    const { error } = await supabaseClient
      .from('enquiries')
      .delete()
      .eq('id', selectedEnquiryId);

    if (error) throw error;

    // Remove locally
    allEnquiries = allEnquiries.filter(e => e.id !== selectedEnquiryId);

    calculateMetrics();
    filterData();
    closeModal();

  } catch (err) {
    console.error("Error deleting entry:", err);
    alert("Could not delete record: " + err.message);
  } finally {
    hideLoader();
  }
}

// Export Enquiries as CSV
function exportToCSV() {
  if (allEnquiries.length === 0) {
    alert("No enquiries to export.");
    return;
  }

  const headers = ['Submission Date', 'Parent Name', 'Mobile', 'Child Name', 'Program', 'Email', 'Message', 'Status', 'Notes'];
  
  const csvRows = [headers.join(',')];

  allEnquiries.forEach(e => {
    const submitDate = new Date(e.created_at).toLocaleString('en-IN');
    const values = [
      submitDate,
      e.parent_name,
      e.mobile,
      e.child_name,
      e.program,
      e.email || '',
      e.message || '',
      e.status,
      e.notes || ''
    ];

    // Clean strings for CSV (wrap in quotes, escape double quotes)
    const escapedValues = values.map(val => {
      const cleanVal = String(val).replace(/"/g, '""');
      return `"${cleanVal}"`;
    });

    csvRows.push(escapedValues.join(','));
  });

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `CPLS_Admissions_Enquiries_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
}

// Loader Utilities
function showLoader() {
  document.getElementById('admin-loader').classList.remove('hidden');
}

function hideLoader() {
  document.getElementById('admin-loader').classList.add('hidden');
}

// HTML Escaping Utility
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
