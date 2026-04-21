const BASE_URL = "https://ambition-classes-backend.onrender.com";
const attStudent = document.getElementById("attStudent");
const attClass = document.getElementById("attClass");
attClass.addEventListener("change", loadStudentsDropdown);
const attDate = document.getElementById("attDate");
const attStatus = document.getElementById("attStatus");
const attendanceTable = document.getElementById("attendanceTable");
const attendanceSummary = document.getElementById("attendanceSummary");
    function checkStudentExists(studentMobile, callback){

    fetch(`${BASE_URL}/api/student/all`)
    .then(res => res.json())
    .then(data => {
        let exists = data.some(s => s.studentMobile === studentMobile);
        callback(exists);
    });

}
function addStudent(){
    

let studentName = document.getElementById("studentName")?.value;
let studentMobile = document.getElementById("studentMobile")?.value;
let parentMobile = document.getElementById("parentMobile")?.value;
let className = document.getElementById("className")?.value;
let totalFees = document.getElementById("totalFees")?.value;
let paidAmount = document.getElementById("paidAmount")?.value;

if (totalFees === "" || paidAmount === "") {
    alert("Enter total fees and paid amount");
    return;
}

// ✅ STEP 2 — CONVERT TO NUMBER
totalFees = parseFloat(totalFees);
paidAmount = parseFloat(paidAmount);

// ✅ STEP 3 — NUMBER VALIDATION
if (isNaN(totalFees) || isNaN(paidAmount)) {
    alert("Fees must be numbers");
    return;
}

console.log(studentName, studentMobile, parentMobile, className, totalFees, paidAmount);

if (!studentName || !studentMobile || !parentMobile || !className) {
    alert("Fill all fields");
    return;
}


if(studentMobile.length != 10 || isNaN(studentMobile)){
alert("Enter valid 10 digit mobile number");
return;
}

checkStudentExists(studentMobile, function(exists){


    let editId = localStorage.getItem("editId");

    if(exists && !editId){
        alert("Student with this mobile number already exists");
        return;
    }

    let student = {
    name: studentName,
    studentMobile: studentMobile,
    parentMobile: parentMobile,
    className: className,
    totalFees: Number(totalFees),
    paidAmount: Number(paidAmount)
};



   

   fetch(`${BASE_URL}/api/users/create-student`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: studentName,
        studentMobile: studentMobile,
        parentMobile: parentMobile,
        className: className,
        totalFees: Number(totalFees),
        paidAmount: Number(paidAmount)
    })
})
.then(res => {
    if(!res.ok) throw new Error("Failed ❌");
    return res.text();
})
.then(() => {
    alert("Student + User Created Successfully ✅");
    loadStudents();
})
.catch(err => {
    console.error(err);
    alert("Something failed ❌ CHECK CONSOLE");
    });
});
}

function loadStudents(){
    

    console.log("LOAD STUDENTS CALLED");
    fetch(`${BASE_URL}/api/student/all`)
    .then(res => res.json())
    .then(data => {
        console.log("DATA:", data); 
        let table = document.getElementById("studentTable");
        table.innerHTML = "";

        let search = document.getElementById("searchStudent").value.toLowerCase();
        let filterClass = document.getElementById("filterClass").value;

        data.forEach((s) => {

            let matchSearch =
    (s.name || "").toLowerCase().includes(search) ||
    (s.studentMobile || "").includes(search);

            let matchClass =
                filterClass === "" || s.className === filterClass;

            if(matchSearch && matchClass){

                table.innerHTML += `
                <tr>
                    <td>${s.name}</td>
                    <td>${s.studentMobile}</td>
                    <td>${s.parentMobile}</td>
                    <td>${s.className}</td>
                    <td>${s.totalFees} / ${s.paidAmount}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editStudent('${s.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStudent('${s.studentMobile}')">Delete</button>
                    </td>
                </tr>
                `;
            }

        });

    });

}
function loadStudentsDropdown() {
    fetch(`${BASE_URL}/api/student/all`)
        .then(res => res.json())
        .then(data => {

            console.log("Students:", data); // 🔥 CHECK THIS

            let dropdown = document.getElementById("attStudent");
            dropdown.innerHTML = '<option>Select Student</option>';

            data.forEach(s => {
                dropdown.innerHTML += `
                    <option value="${s.studentMobile}">
                        ${s.name}
                    </option>
                `;
            });
        });
}
function resetFilters(){
    document.getElementById("searchStudent").value = "";
    document.getElementById("filterClass").value = "";
}
function editStudent(id){

    fetch(`${BASE_URL}/api/student/${id}`)
    .then(res => res.json())
    .then(s => {

        document.getElementById("studentName").value = s.name;
        document.getElementById("studentMobile").value = s.studentMobile;
        document.getElementById("parentMobile").value = s.parentMobile;
        document.getElementById("className").value = s.className;
        document.getElementById("totalFees").value = s.totalFees;
        document.getElementById("paidAmount").value = s.paidAmount;

        localStorage.setItem("editId", id);
    });

}

function deleteStudent(mobile){

    if(!confirm("Are you sure you want to delete this student?")){
        return;
    }

    fetch(`${BASE_URL}/api/student/mobile/${mobile}`, {
        method: "DELETE"
    })
    .then(res => {
        if(!res.ok){
            throw new Error("Delete failed");
        }

        alert("Student Deleted Successfully");
        loadStudents();
    })
    .catch(err => {
        console.error(err);
        alert("Error deleting student");
    });

}

function loadStudentsAttendance() {

    fetch(`${BASE_URL}/api/student/all`)
        .then(res => res.json())
        .then(students => {

            attStudent.innerHTML = '<option value="">Select Student</option>';

            students.forEach(s => {
            if (!attClass.value || attClass.value === "Select Class" || s.className === attClass.value) {
                attStudent.innerHTML += `
                    <option value="${s.studentMobile}">${s.name}</option>
                `;
            }
        });

        });
}

function saveAttendance() {

    if(attStudent.value === "" || attStudent.value === "Select Student"){
        alert("Select a valid student");
        return;
    }

    if(attClass.value === "" || attDate.value === ""){
        alert("Fill all fields");
        return;
    }

    const attendanceData = {
    studentMobile: attStudent.value,
    date: attDate.value,
    status: attStatus.value
};

    console.log("FINAL DATA:", attendanceData);

    fetch(`${BASE_URL}/api/attendance`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(attendanceData)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Saved:", data);
        displayAttendance();
        calculateAttendance();
        alert("Attendance saved");
    })
    .catch(err => console.error(err));
}

function displayAttendance() {

    fetch(`${BASE_URL}/api/attendance`)
        .then(res => res.json())
        .then(attendance => {

            attendanceTable.innerHTML = "";

            attendance.forEach(a => {

                attendanceTable.innerHTML += `
                    <tr id="row-${a.id}">
                        <td>${a.name}</td>
                        <td>${a.className}</td>
                        <td>
                            <span id="date-${a.id}">${a.date}</span>
                            <input type="date" id="edit-date-${a.id}" value="${a.date}" style="display:none" class="form-control">
                        </td>
                        <td>
                            <span id="status-${a.id}">${a.status}</span>
                            <select id="edit-status-${a.id}" style="display:none" class="form-control">
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                            </select>
                        </td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="enableEdit('${a.id}')">Edit</button>
                            <button class="btn btn-success btn-sm" onclick="updateAttendance('${a.id}')" style="display:none" id="save-${a.id}">Save</button>
                            <button class="btn btn-secondary btn-sm" onclick="cancelEdit('${a.id}')" style="display:none" id="cancel-${a.id}">Cancel</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteAttendance('${a.id}')">Delete</button>
                        </td>
                    </tr>
                `;

            });

        });
}

function editAttendance(id) {

    fetch(`${BASE_URL}/api/attendance/${id}`)
        .then(res => res.json())
        .then(a => {

            let newDate = prompt("Edit Date", a.date);
            let newStatus = prompt("Edit Status", a.status);

            let updated = {
                ...a,
                date: newDate,
                status: newStatus
            };

            return fetch(`${BASE_URL}/api/attendance/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updated)
            });
        })
        .then(() => {
            alert("Updated");
            displayAttendance();
            calculateAttendance();
        });
}

function deleteAttendance(id){

    if(!confirm("Delete this attendance?")) return;

    fetch(`${BASE_URL}/api/attendance/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        alert("Deleted");
        displayAttendance();
        calculateAttendance();
    });
}

function calculateAttendance() {

    fetch(`${BASE_URL}/api/attendance`)
        .then(res => res.json())
        .then(attendance => {

            let summary = {};

            attendance.forEach(a => {

                let key = a.name + "_" + a.className;

                if (!summary[key]) {
                    summary[key] = {
                        name: a.name,
                        className: a.className,
                        total: 0,
                        present: 0
                    };
                }

                summary[key].total++;

                let status = (a.status || "").toLowerCase();

                if (status === "present") {
                    summary[key].present++;
}

            });

            attendanceSummary.innerHTML = "";

            Object.values(summary).forEach(s => {

                let percent = ((s.present / s.total) * 100).toFixed(1);

                attendanceSummary.innerHTML += `
                    <tr>
                        <td>${s.name}</td>
                        <td>${s.className}</td>
                        <td>${s.total}</td>
                        <td>${s.present}</td>
                        <td>${percent}%</td>
                    </tr>
                `;
            });

        })
        .catch(err => console.error(err));
}

function enableEdit(id){

    document.getElementById(`date-${id}`).style.display = "none";
    document.getElementById(`status-${id}`).style.display = "none";

    document.getElementById(`edit-date-${id}`).style.display = "block";
    document.getElementById(`edit-status-${id}`).style.display = "block";

    document.getElementById(`save-${id}`).style.display = "inline-block";
    document.getElementById(`cancel-${id}`).style.display = "inline-block";
}

function cancelEdit(id){
    displayAttendance();
}

function updateAttendance(id){

    let newDate = document.getElementById(`edit-date-${id}`).value;
    let newStatus = document.getElementById(`edit-status-${id}`).value;

    fetch(`${BASE_URL}/api/attendance/${id}`)
    .then(res => res.json())
    .then(a => {

        let updated = {
            ...a,
            date: newDate,
            status: newStatus
        };

        return fetch(`${BASE_URL}/api/attendance/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updated)
        });
    })
    .then(() => {
        alert("Updated Successfully");

        displayAttendance();
        calculateAttendance();
    });
}
async function markAttendance() {

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(`${BASE_URL}/api/attendance`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        studentMobile: selectedMobile, 
        date: date,
        status: status
    })
    });

    const data = await res.json();
    console.log(data);
}

function saveResult() {

    const resultClass = document.getElementById("resultClass");
    const resultStudent = document.getElementById("resultStudent");
    const testName = document.getElementById("testName");
    const marks = document.getElementById("marks");

    // ✅ STRICT VALIDATION
    if(resultClass.value === "Select Class"){
        alert("Select class");
        return;
    }

    if(resultStudent.value === ""){
        alert("Select student properly");
        return;
    }

    if(testName.value.trim() === ""){
        alert("Enter test name");
        return;
    }

    if(marks.value === "" || marks.value < 0){
        alert("Enter valid marks");
        return;
    }

    const resultData = {
    studentMobile: resultStudent.value, 
    name: resultStudent.options[resultStudent.selectedIndex].text,
    className: resultClass.value,
    testName: testName.value.trim(),   // 🔥 FIX
    marks: Number(marks.value)
};

    fetch(`${BASE_URL}/api/results`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resultData)
    })
    .then(res => {
        if(!res.ok) throw new Error("Failed to save result");
        return res.text();
    })
    .then(() => {

        alert("Result saved successfully");

        // ✅ CLEAR FORM (IMPORTANT)
        resultStudent.value = "";
        testName.value = "";
        marks.value = "";

        displayResults();

    })
    .catch(err => {
        console.error(err);
        alert("Error saving result");
    });
}

function displayResults() {

    let filter = resultFilterClass.value;
    let search = document.getElementById("searchResult").value.toLowerCase();

    fetch(`${BASE_URL}/api/results`)
        .then(res => res.json())
        .then(results => {

            resultsTable.innerHTML = "";

            results.forEach(r => {

                let matchSearch =
                    (r.name || "").toLowerCase().includes(search) ||
                    (r.testName || "").toLowerCase().includes(search);

                let matchClass =
                    filter === "" || r.className === filter;

                if (matchSearch && matchClass) {

                    resultsTable.innerHTML += `
                        <tr>
                            <td>${r.name}</td>
                            <td>${r.className}</td>
                            <td>${r.testName || "No Test"}</td>
                            <td>${r.marks}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editResult('${r.id}')">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteResult('${r.id}')">Delete</button>
                            </td>
                        </tr>
                    `;
                }

            });

        });
}

function editResult(id) {

    fetch(`${BASE_URL}/api/results/${id}`)
    .then(res => res.json())
    .then(r => {

        let newTest = prompt("Edit Test", r.testName);
        let newMarks = prompt("Edit Marks", r.marks);

        let updatedResult = {
            ...r,
            testName: newTest,
            marks: Number(newMarks)
        };

        return fetch(`${BASE_URL}/api/results/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedResult)
        });
    })
    .then(() => {
        alert("Updated");
        displayResults();
    });
}

function deleteResult(id) {

    if (!confirm("Are you sure you want to delete this result?")) {
        return;
    }

    fetch(`${BASE_URL}/api/results/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Delete failed");
        }
        return res.text();
    })
    .then(() => {
        alert("Deleted successfully");
        displayResults();
    })
    .catch(err => {
        console.error(err);
        alert("Error deleting result");
    });
}

function loadStudentsResults() {

    const resultStudent = document.getElementById("resultStudent");
    const resultClass = document.getElementById("resultClass");

    fetch(`${BASE_URL}/api/student/all`)
    .then(res => res.json())
    .then(students => {

        resultStudent.innerHTML = `<option value="">Select Student</option>`;

        students.forEach(s => {

            // filter by class
            if (resultClass.value === "All Classes" || s.className === resultClass.value) {

                resultStudent.innerHTML += `
                    <option value="${s.studentMobile}">${s.name}</option>
                `;
            }
        });
    });
}
function updateFees() {

    let studentId = document.getElementById("feesStudent").value;
    let total = document.getElementById("updateTotalFees").value;
    let paid = document.getElementById("updatePaidAmount").value;

    if (!studentId) {
        alert("Select student");
        return;
    }

    fetch(`${BASE_URL}/api/student/fees/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            totalFees: Number(total),
            paidAmount: Number(paid)
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Fees updated");
        loadStudents();
    });
}

function loadStudentsFees() {

    let feesClass = document.getElementById("feesClass").value;
    let feesStudent = document.getElementById("feesStudent");

    fetch(`${BASE_URL}/api/student/all`)
    .then(res => res.json())
    .then(students => {

        feesStudent.innerHTML = `<option value="">Select Student</option>`;

        students.forEach(s => {
            if (s.className === feesClass) {
                feesStudent.innerHTML += `
                    <option value="${s.studentMobile}">${s.name}</option>
                `;
            }
        });
    });
}

function addQuestion() {

    let testId = document.getElementById("selectedTest").value;

    if (testId === "") {
        alert("Select test first");
        return;
    }

    let questionText = document.getElementById("question").value;

    let options = [
        opt1.value,
        opt2.value,
        opt3.value,
        opt4.value
    ];

    let correct = document.getElementById("correct").value;

    if (questionText.trim() === "") {
        alert("Enter question");
        return;
    }

    let questionData = {
        question: questionText,
        options: options,
        correct: correct
    };

    fetch(`${BASE_URL}/api/tests/${testId}/questions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(questionData)
    })
    .then(res => {
        if(!res.ok) throw new Error("Failed to add question");
        return res.text();
    })
    .then(() => {

        alert("Question added");

        displayTests();

        // clear fields
        question.value = "";
        opt1.value = "";
        opt2.value = "";
        opt3.value = "";
        opt4.value = "";
    })
    .catch(err => {
        console.error(err);
        alert("Error adding question");
    });
}

function createTest(){

    let name = document.getElementById("mockTestName").value;

    if(name.trim() === ""){
        alert("Enter test name");
        return;
    }

    let test = {
        name: name,
        questions: []
    };

    fetch(`${BASE_URL}/api/tests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(test)
    })
    .then(res => {
        if(!res.ok) throw new Error("Failed to create test");
        return res.text();
    })
    .then(() => {

        alert("Test Created Successfully");

        document.getElementById("mockTestName").value = "";

        displayTests();
        loadTestDropdown();

    })
    .catch(err => {
        console.error(err);
        alert("Error creating test");
    });
}

function loadTestDropdown(){

    fetch(`${BASE_URL}/api/tests`)
    .then(res => res.json())
    .then(data => {

        let dropdown = document.getElementById("selectedTest");

        dropdown.innerHTML = "<option value=''>Select Test</option>";

        data.forEach((t) => {
            dropdown.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });

    });
}

function deleteTest(id){

    if(!confirm("Delete this test?")){
        return;
    }

    fetch(`${BASE_URL}/api/tests/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        alert("Test deleted");
        displayTests();
    });
}

function displayTests(){

    fetch(`${BASE_URL}/api/tests`)
    .then(res => res.json())
    .then(data => {

        let testTable = document.getElementById("testTable");
        testTable.innerHTML = "";

        data.forEach((t) => {

            testTable.innerHTML += `
            <tr>
                <td>${t.name}</td>
                <td>${t.questions ? t.questions.length : 0}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteTest('${t.id}')">Delete</button>
                </td>
            </tr>
            `;
        });

    });
}



let events = [];
function getFullPath(photo) {
    if (!photo) return "";

    if (photo.startsWith("/")) {
        photo = photo.substring(1);
    }

    if (!photo.startsWith("uploads/")) {
        photo = "uploads/" + photo;
    }

    return `${BASE_URL}/` + photo;
}

async function loadEvents(){

    const res = await fetch(`${BASE_URL}/api/events`);
    events = await res.json();
    const select = document.getElementById("eventSelect");
select.innerHTML = "";

events.forEach(event => {
    select.innerHTML += `
        <option value="${event.id}">
            ${event.name}
        </option>
    `;
});
    const container = document.getElementById("preview");
    container.innerHTML = "";

    events.forEach(event => {

        let html = `
            <div style="border:1px solid #ccc; padding:15px; margin:15px;">
                
                <h4>
                    ${event.name}
                    <button onclick="deleteEvent('${event.id}')" style="color:red;">
                        Delete Event
                    </button>
                </h4>
        `;

        if(event.photos){
    event.photos.forEach(photo => {


        html += `<div style="display:inline-block;margin:10px;text-align:center;">`;

        if(photo.match(/\.(mp4|webm|ogg)$/i)){
            html += `
                <video width="120" controls>
                    <source src="${getFullPath(photo)}">
                </video>
            `;
        } else {
            html += `
                <img src="${getFullPath(photo)}" width="120">
            `;
        }

        html += `
            <br>
            <button onclick="deletePhoto('${event.id}','${photo}')">Delete</button>
        `;

        html += `</div>`;
    });
}

        html += `</div>`;

        container.innerHTML += html;
    });
}
// create event
async function createNewEvent(){

    const name = document.getElementById("eventName").value;

    if(!name){
        alert("Enter event name");
        return;
    }

    // 🔥 check duplicate
    const exists = events.some(e => e.name.toLowerCase() === name.toLowerCase());

    if(exists){
        alert("Event already exists");
        return;
    }

    await fetch(`${BASE_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, photos: [] })
    });

    loadEvents();
}

// upload photo
async function uploadPhoto() {
    const fileInput = document.getElementById("galleryInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Select file first");
        return;
    }

    if (!selectedEventId) {
        alert("Select event first");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ambition_upload");

    try {
        // 🔥 Upload to Cloudinary
        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dfwmbsrne/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await res.json();
        console.log("Cloudinary response:", data);

        if (data.error) {
            alert(data.error.message);
            return;
        }

        const imageUrl = data.secure_url;

        // 🔥 SAVE TO BACKEND WITH EVENT ID
        await fetch("https://ambition-classes-backend.onrender.com/api/gallery-images", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                image: imageUrl,
                eventId: selectedEventId   // 🔥 THIS IS THE KEY FIX
            })
        });

        alert("Gallery image uploaded");

        fileInput.value = "";

    } catch (err) {
        console.error(err);
        alert("Upload failed");
    }
}

async function deletePhoto(eventId, photoPath){

    await fetch(`${BASE_URL}/api/photo?eventId=${eventId}&photoPath=${photoPath}`, {
        method: "DELETE"
    });

    alert("Photo deleted");
    loadEvents();
}

async function deleteEvent(eventId){

    if(!confirm("Delete this event?")) return;

    await fetch(`${BASE_URL}/api/event/${eventId}`, {
        method: "DELETE"
    });

    alert("Event deleted");
    loadEvents();
}

loadEvents();

async function loadGallery(){

    const res = await fetch(`${BASE_URL}/api/events`);
    const events = await res.json();

    const container = document.getElementById("galleryContainer");
    if(!container) return;
    container.innerHTML = "";
    let allEvents = [];
    allEvents = events;

    // ✅ THIS IS WHERE YOUR CODE GOES
    events.forEach((event, index) => {

        if(event.photos.length === 0) return;

        container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card shadow" 
                     style="cursor:pointer;"
                     onclick="openEvent(${index})">

                    <img src="${BASE_URL}/${event.photos[0]}" 
                         style="height:180px;object-fit:cover;">

                    <div class="p-3 text-center">
                        <h5>${event.name}</h5>
                        <p>${event.photos.length} Photos</p>
                    </div>

                </div>
            </div>
        `;
    });
}

function openEvent(index){

    const event = allEvents[index];

    let photosHtml = "";

    event.photos.forEach(photo => {

        if(photo.endsWith(".mp4")){
            photosHtml += `
                <video width="250" controls style="margin:10px;">
                    <source src="${getFullPath(photo)}">
                </video>
            `;
        } else {
            photosHtml += `
                <img src="${getFullPath(photo)}" width="250">
            `;
        }

    });

    document.getElementById("eventModalBody").innerHTML = photosHtml;
}

async function uploadResultImage() {
    const fileInput = document.getElementById("resultImageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Select file first");
        return;
    }

    if (file.size > 2000000) {
        alert("Image too large (max 2MB)");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ambition_upload");

    try {
        await new Promise(r => setTimeout(r, 1000)); // 🔥 stability

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dfwmbsrne/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await res.json();
        console.log("Cloudinary response:", data);

        if (data.error) {
            alert("Upload failed: " + data.error.message);
            return;
        }

        const imageUrl = data.secure_url;

        await fetch("https://ambition-classes-backend.onrender.com/api/result-images", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ image: imageUrl })
        });

        fileInput.value = ""; // 🔥 MUST

        alert("Upload successful");

    } catch (err) {
        console.error(err);
        alert("Upload failed");
    }
}
async function loadResultImages(){
    try{
        const res = await fetch(`${BASE_URL}/api/result-images`);
        const data = await res.json();

        console.log("IMAGES DATA:", data);

        if(!Array.isArray(data)){
            console.error("Not array:", data);
            return;
        }

        const container = document.getElementById("resultImagesContainer");
        container.innerHTML = "";

        data.forEach(img => {
    container.innerHTML += `
        <div class="image-card" style="display:inline-block; margin:10px; text-align:center;">
            <img src="${img.image}" width="150"/><br>
            <button onclick="deleteImage('${img.id}')" 
                    style="margin-top:5px; background:red; color:white; border:none; padding:5px 10px;">
                Delete
            </button>
        </div>
    `;
});

    }catch(err){
        console.error(err);
    }
}
function deleteImage(id) {
    fetch(`${BASE_URL}/api/result-images/${id}`, {
        method: "DELETE"
    }).then(() => loadResultImages());
    loadResultImages();
}

loadResultImages();

window.onload = function(){
    loadStudents();
    loadStudentsResults();
    displayAttendance();
    displayResults();
    calculateAttendance();
    displayTests();
    loadTestDropdown();

    loadGallery(); // 🔥 ADD THIS
};
