const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const now = new Date();
document.getElementById('week').textContent = weekday[now.getDay()];
document.getElementById('date').textContent = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
document.querySelector('.time').textContent = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

const name1 = localStorage.getItem('username') || 'khushi';
const role = 'Admin';
document.getElementById('TeacherName').textContent = `${name1} (${role})`;

// =========================
// SECTION SWITCHING
// =========================
const sections = {
  timetable: document.getElementById('timetable-content'),
  addLecture: document.getElementById('AddLectureContent'),
  approveLeave: document.getElementById('ApproveLeaveContent'),
  adjustment: document.getElementById('AdjustmentContent')
};

function showSection(sectionName) {
  Object.values(sections).forEach(sec => sec.style.display = 'none');
  sections[sectionName].style.display = 'block';
}

document.getElementById('AddLecture').addEventListener('click', () => showSection('addLecture'));
document.getElementById('ApproveLeave').addEventListener('click', () => {
  showSection('approveLeave');
  loadLeaveRequests();
});
document.getElementById('Adjustment').addEventListener('click', () => showSection('adjustment'));
document.querySelector('a[href="#"]').addEventListener('click', () => showSection('timetable'));

// =========================
// LOAD TEACHERS INTO SELECT
// =========================
async function loadTeachers() {
  const res = await fetch('/teachers');
  const teachers = await res.json();
  const select = document.getElementById('teacherSelect');

  teachers.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.email;
    opt.textContent = `${t.username} (${t.email})`;
    select.appendChild(opt);
  });
}

loadTeachers();

// =========================
// ADD LECTURE TO SELECTED TEACHER
// =========================
document.getElementById('timetableForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const rawPeriod = document.getElementById('lecture').value;
  const periodNumber = rawPeriod.replace('period', '');
  const formattedPeriod = `Period ${periodNumber}`;
  const email = document.getElementById('teacherSelect').value;

  if (email === "Select Teacher") {
    alert("Please select a teacher!");
    return;
  }

  const timetable = [{
    period: formattedPeriod,
    subject: document.getElementById('subject').value,
    day: document.getElementById('day').value,
    room: document.getElementById('room').value,
    time: document.getElementById('start').value + ' - ' + document.getElementById('end').value,
    date: new Date()
  }];

  try {
    const res = await fetch('/lecture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, timetable })
    });

    const response = await res.json();
    if (res.ok) {
      alert('Lecture added successfully!');
      document.getElementById('timetableForm').reset();
    } else {
      alert('Error: ' + response.message);
    }
  } catch (error) {
    console.log('Error saving timetable:', error);
  }
});

// =========================
// LOAD TIMETABLE FOR SELECTED TEACHER
// =========================
document.getElementById("teacherSelect").addEventListener("change", async (e) => {
  const email = e.target.value;

  // Clear old timetable data
  document.querySelectorAll("tbody td").forEach(td => td.textContent = "");

  if (!email) return;

  const res = await fetch(`/timetable/${email}`);
  if (!res.ok) {
    console.error("Error fetching timetable");
    return;
  }

  const timetable = await res.json(); // ✅ This is now an array
  timetable.forEach(entry => {
    const cellId = `${entry.day}-${entry.period}`;
    const cell = document.getElementById(cellId);
    if (cell) {
      cell.textContent = `${entry.subject} (${entry.room})`;
    }
  });
});


