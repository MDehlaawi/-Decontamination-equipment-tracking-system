document.addEventListener('DOMContentLoaded', (event) => {
    const page = window.location.pathname.split("/").pop();
    if (page === "index.html" || page === "") {
        // Load initial content
        document.getElementById('content').innerHTML = document.getElementById('welcomePage').outerHTML;
    }
    if (page === "add-equipment.html") {
        loadEquipmentFromLocalStorage();
        setNextSerialNumber();
    }
    if (page === "decontamination.html") {
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }
});

function setNextSerialNumber() {
    const equipmentList = JSON.parse(localStorage.getItem('equipmentList')) || [];
    const nextSerialNumber = equipmentList.length + 1;
    document.getElementById('newSerialNumber').innerText = `#${nextSerialNumber.toString().padStart(5, '0')}`;
}

function showAddEquipmentModal() {
    setNextSerialNumber();
    document.getElementById('addEquipmentModal').classList.add('active');
}

function closeAddEquipmentModal() {
    document.getElementById('addEquipmentModal').classList.remove('active');
}

function addNewEquipment() {
    const type = document.getElementById('newType').value;
    const clinic = document.getElementById('newClinic').value;
    const serialNumber = document.getElementById('newSerialNumber').innerText;
    const date = new Date().toLocaleDateString();

    if (type && clinic) {
        const equipment = {
            serialNumber,
            type,
            clinic,
            date
        };

        // Save to local storage
        saveEquipmentToLocalStorage(equipment);

        const row = `<tr id="${serialNumber}">
            <td>${serialNumber}</td>
            <td>${type}</td>
            <td>${clinic}</td>
            <td>${date}</td>
            <td><button onclick="deleteEquipment('${serialNumber}')">Delete</button></td>
        </tr>`;
        document.getElementById('equipmentTableBody').insertAdjacentHTML('beforeend', row);
        closeAddEquipmentModal();
        document.getElementById('newType').value = '';
        document.getElementById('newClinic').value = '';
    }
}

function saveEquipmentToLocalStorage(equipment) {
    let equipmentList = JSON.parse(localStorage.getItem('equipmentList')) || [];
    equipmentList.push(equipment);
    localStorage.setItem('equipmentList', JSON.stringify(equipmentList));
}

function loadEquipmentFromLocalStorage() {
    let equipmentList = JSON.parse(localStorage.getItem('equipmentList')) || [];
    equipmentList.forEach(equipment => {
        const row = `<tr id="${equipment.serialNumber}">
            <td>${equipment.serialNumber}</td>
            <td>${equipment.type}</td>
            <td>${equipment.clinic}</td>
            <td>${equipment.date}</td>
            <td><button onclick="deleteEquipment('${equipment.serialNumber}')">Delete</button></td>
        </tr>`;
        document.getElementById('equipmentTableBody').insertAdjacentHTML('beforeend', row);
    });
}

function deleteEquipment(serialNumber) {
    let equipmentList = JSON.parse(localStorage.getItem('equipmentList')) || [];
    equipmentList = equipmentList.filter(equipment => equipment.serialNumber !== serialNumber);
    localStorage.setItem('equipmentList', JSON.stringify(equipmentList));
    document.getElementById(serialNumber).remove();
    setNextSerialNumber();
}

function scanEquipment() {
    let equipmentList = JSON.parse(localStorage.getItem('equipmentList')) || [];
    const tableBody = document.getElementById('decontaminationTableBody');
    tableBody.innerHTML = '';

    equipmentList.forEach(equipment => {
        const newRow = `<tr>
            <td>${equipment.serialNumber}</td>
            <td>${equipment.type}</td>
            <td>${equipment.clinic}</td>
            <td>
                <select>
                    <option value="contamination">Contamination</option>
                    <option value="decontamination">Decontamination</option>
                </select>
            </td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    });
}

function processDecontamination() {
    const rows = document.querySelectorAll('#decontaminationTableBody tr');
    rows.forEach(row => {
        const state = row.querySelector('select').value;
        console.log(`Processing equipment with serial number ${row.children[0].innerText}: ${state}`);
    });
}

function extractReports() {
    alert('Extracting reports...');
}

let patchNumber = 0;

function updateDateTime() {
    const dateTimeSpan = document.getElementById('currentDateTime');
    const now = new Date();
    dateTimeSpan.innerHTML = now.toLocaleString();
}

function createPatch() {
    // Get the patch number
    var patchNumber = document.getElementById('patchNumber').innerText;

    // Redirect to process.html with the patch number as a URL parameter
    window.location.href = 'process.html?patchNumber=' + patchNumber;
}


let currentProcess = 1;

function openProcessModal(processName, processNumber) {
    document.getElementById('processModalTitle').innerText = processName;
    document.getElementById('processModal').classList.add('active');
    document.getElementById('processInput').value = '';
    document.getElementById('processInput').dataset.processNumber = processNumber;
}

function closeProcessModal() {
    document.getElementById('processModal').classList.remove('active');
}

function completeCurrentProcess() {
    const processNumber = parseInt(document.getElementById('processInput').dataset.processNumber);
    document.getElementById(`process${processNumber}`).classList.add('completed');
    document.getElementById(`process${processNumber}`).classList.remove('in-progress');
    currentProcess++;
    if (currentProcess <= 8) {
        document.getElementById(`process${currentProcess}`).classList.remove('disabled');
        document.getElementById(`process${currentProcess}`).classList.add('in-progress');
    }
    closeProcessModal();
    updateNextButtonState();
}

function updateNextButtonState() {
    if (currentProcess > 8) {
        document.getElementById('nextButton').classList.remove('disabled');
    } else {
        document.getElementById('nextButton').classList.add('disabled');
    }
}

function createPatch() {
    // Get employee name and current date-time
    const employeeName = document.getElementById("employeeName").value;
    const currentDateTime = new Date().toLocaleString();

    // Generate a unique serial number for the patch
    const patchNumber = generatePatchNumber();

    // Gather scanned equipment data (you can dynamically add equipment data)
    const scannedEquipments = [
        // Example scanned equipment (this can be dynamically filled)
        { serialNumber: "#00001", type: "Equipment Type", clinic: "Clinic Name", state: "Scanned" }
    ];

    // Patch details to be saved
    const patchDetails = {
        patchNumber: patchNumber,
        employeeName: employeeName,
        dateTime: currentDateTime,
        equipments: scannedEquipments,
        processDetails: "Zone 1 Rinsing in process" // You can dynamically update this based on your process
    };

    // Save the patch to local storage
    savePatchToLocalStorage(patchDetails);

    // Navigate to process.html and pass the patch number via query parameters
    window.location.href = `process.html?patchNumber=${patchNumber}`;
}

function generatePatchNumber() {
    // Simple unique patch number generator (you can enhance it)
    return `#${Math.floor(Math.random() * 100000)}`;
}

function savePatchToLocalStorage(patchDetails) {
    let patches = JSON.parse(localStorage.getItem('patches')) || [];
    patches.push(patchDetails);
    localStorage.setItem('patches', JSON.stringify(patches));
}


