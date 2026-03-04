const API_URL = "http://localhost:5000/api/items";

// Edit Mode එක පාලනය කිරීමට විචල්‍යයන්
let editMode = false;
let currentEditId = null;

// 1. පද්ධතියේ ඇති සියලුම දත්ත Table එකට ලබා ගැනීම
async function fetchItems() {
    try {
        const response = await fetch(`${API_URL}/all`);
        const items = await response.json();
        
        const tableBody = document.getElementById('itemTableBody');
        tableBody.innerHTML = ""; 

        items.forEach(item => {
            tableBody.innerHTML += `
                <tr>
                    <td><strong>${item.barcode}</strong></td>
                    <td>${item.institution}</td>
                    <td>${item.preservationState || 'Pending'}</td>
                    <td><span class="badge ${getPriorityClass(item.priorityLevel)}">${item.priorityLevel}</span></td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editItem('${item._id}')">Edit</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Error fetching items:", err);
    }
    updateCharts()
}

// Priority එක අනුව Badge එකේ පාට තෝරන Function එක
function getPriorityClass(priority) {
    switch(priority) {
        case 'Critical/Urgent': return 'bg-danger';
        case 'High': return 'bg-warning text-dark';
        case 'Medium': return 'bg-primary';
        case 'Low': return 'bg-secondary';
        default: return 'bg-info';
    }
}

// 2. Form එක Submit කරන විට (Save හෝ Update)
document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Form එකේ ඇති දත්ත එකතු කර ගැනීම
    const itemData = {
        barcode: document.getElementById('barcode').value,
        institution: document.getElementById('institution').value,
        institutionFileNo: document.getElementById('institutionFileNo').value,
        recordType: document.getElementById('recordType').value,
        currentCondition: document.getElementById('currentCondition').value,
        priorityLevel: document.getElementById('priorityLevel').value,
        location: document.getElementById('location').value,
        assignedConservator: document.getElementById('assignedConservator').value
    };

    // Default විදියට අලුත් Item එකක් සෑදීම (POST)
    let url = `${API_URL}/add`;
    let method = 'POST';

    // හැබැයි Edit Mode එකේ නම් තියෙන්නේ, Update (PUT) කළ යුතුයි
    if (editMode) {
        url = `${API_URL}/update/${currentEditId}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });

        if (response.ok) {
            alert(editMode ? "Record Updated Successfully! 🔄" : "Record Saved Successfully! ✅");
            resetForm(); // Form එක සාමාන්‍ය තත්ත්වයට පත් කිරීම
            fetchItems(); // Table එක update කිරීම
        } else {
            const errorData = await response.json();
            alert("Error: " + errorData.message);
        }
    } catch (err) {
        alert("Server connection failed.");
    }
});

// 3. Edit බටන් එක එබූ විට දත්ත Form එකට ලබා ගැනීම
async function editItem(id) {
    try {
        const response = await fetch(`${API_URL}/all`);
        const items = await response.json();
        const item = items.find(i => i._id === id);

        if (item) {
            // Form එකේ Fields වලට දත්ත පිරවීම
            document.getElementById('barcode').value = item.barcode;
            document.getElementById('institution').value = item.institution;
            document.getElementById('institutionFileNo').value = item.institutionFileNo || "";
            document.getElementById('recordType').value = item.recordType || "";
            document.getElementById('currentCondition').value = item.currentCondition || "";
            document.getElementById('priorityLevel').value = item.priorityLevel || "Low";
            document.getElementById('location').value = item.location || "";
            document.getElementById('assignedConservator').value = item.assignedConservator || "";

            editMode = true;
            currentEditId = id;
            
            // බටන් එකේ පෙනුම වෙනස් කිරීම
            const submitBtn = document.querySelector("#itemForm button");
            submitBtn.innerText = "Update Record";
            submitBtn.classList.replace("btn-primary", "btn-success");
            
            window.scrollTo(0, 0); // පිටුව ඉහළට (Form එක වෙත) ගෙන යාම
        }
    } catch (err) {
        console.error("Error loading item for edit:", err);
    }
}

// Form එක මුල් තත්ත්වයට පත් කරන Function එක
function resetForm() {
    document.getElementById('itemForm').reset();
    editMode = false;
    currentEditId = null;
    
    const submitBtn = document.querySelector("#itemForm button");
    submitBtn.innerText = "Save Record";
    if (submitBtn.classList.contains("btn-success")) {
        submitBtn.classList.replace("btn-success", "btn-primary");
    }
}

// Barcode හෝ Institution අනුව සෙවීම
async function searchItem() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/all`);
        const items = await response.json();
        
        const filteredItems = items.filter(item => 
            item.barcode.toLowerCase().includes(query) || 
            item.institution.toLowerCase().includes(query)
        );

        const tableBody = document.getElementById('itemTableBody');
        tableBody.innerHTML = ""; 

        if (filteredItems.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5' class='text-center text-danger'>No results found.</td></tr>";
            return;
        }

        filteredItems.forEach(item => {
            tableBody.innerHTML += `
                <tr>
                    <td><strong>${item.barcode}</strong></td>
                    <td>${item.institution}</td>
                    <td>${item.preservationState || 'Pending'}</td>
                    <td><span class="badge ${getPriorityClass(item.priorityLevel)}">${item.priorityLevel}</span></td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editItem('${item._id}')">Edit</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Search failed:", err);
    }
}

// Enter Key එක එබූ විට සෙවුම ක්‍රියාත්මක වීමට
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchItem();
    }
});

// පිටුව Load වන විටම දත්ත පෙන්වන්න
fetchItems();

let conditionChart, priorityChart; // Chart objects තබා ගැනීමට

async function updateCharts() {
    const response = await fetch(`${API_URL}/all`);
    const items = await response.json();

    // 1. තත්ත්වය (Condition) අනුව දත්ත ගණනය කිරීම
    const conditions = {};
    items.forEach(item => {
        const c = item.currentCondition || "Unknown";
        conditions[c] = (conditions[c] || 0) + 1;
    });

    // 2. ප්‍රමුඛතාවය (Priority) අනුව දත්ත ගණනය කිරීම
    const priorities = {};
    items.forEach(item => {
        const p = item.priorityLevel || "Low";
        priorities[p] = (priorities[p] || 0) + 1;
    });

    // Condition Chart එක ඇඳීම
    const ctx1 = document.getElementById('conditionChart').getContext('2d');
    if (conditionChart) conditionChart.destroy(); // පරණ chart එක මකන්න
    conditionChart = new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: Object.keys(conditions),
            datasets: [{
                data: Object.values(conditions),
                backgroundColor: ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6']
            }]
        }
    });

    // Priority Chart එක ඇඳීම (Bar Chart එකක් ලෙස ගමු)
    const ctx2 = document.getElementById('priorityChart').getContext('2d');
    if (priorityChart) priorityChart.destroy();
    priorityChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: Object.keys(priorities),
            datasets: [{
                label: 'No. of Items',
                data: Object.values(priorities),
                backgroundColor: '#2c3e50'
            }]
        }
    });
}

async function exportToExcel() {
    try {
        // 1. Backend එකෙන් සියලුම දත්ත ලබා ගැනීම
        const response = await fetch(`${API_URL}/all`);
        const items = await response.json();

        if (items.length === 0) {
            alert("No data available to export.");
            return;
        }

        // 2. Excel එකට අවශ්‍ය විදියට දත්ත සකස් කර ගැනීම (Mapping)
        const excelData = items.map(item => ({
            "Barcode": item.barcode,
            "Institution": item.institution,
            "File No": item.institutionFileNo,
            "Record Type": item.recordType,
            "Condition": item.currentCondition,
            "Priority": item.priorityLevel,
            "Location": item.location,
            "Conservator": item.assignedConservator,
            "Created Date": new Date(item.createdAt).toLocaleDateString()
        }));

        // 3. XLSX Library එක පාවිච්චි කර File එක සෑදීම
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Archive_Records");

        // 4. File එක Download කිරීම
        XLSX.writeFile(workbook, "Archive_Conservation_Report.xlsx");

    } catch (err) {
        console.error("Export failed:", err);
        alert("Failed to export data.");
    }
}

function logout() {
    localStorage.removeItem('token'); // සේව් කර තිබූ Token එක මකා දමන්න
    window.location.href = "login.html"; // Login පිටුවට යන්න
}