  var weekday = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();

  var dateEl = document.querySelector('#week');
  dateEl.innerHTML = `${weekday[d.getDay()]}`;
  var dateText = document.querySelector('#date');
  dateText.innerHTML = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  var timeEl = document.querySelector('.time');
  timeEl.innerHTML = `${h}:${m}:${s}`;
  var teacherNameEl = document.querySelector('#TeacherName');

  const name = localStorage.getItem('username') || 'khushi';
  const role = localStorage.getItem('role') || 'Teacher';
  document.getElementById('TeacherName').textContent = `${name} (${role})`;



  const timetableButton = document.getElementById('timetable');
  timetableButton.addEventListener('click', function () {
    const div1 = document.querySelector('#dashboard-content');
    const div3 = document.querySelector('#timetable-content');
    const div2 = document.querySelector('#AppealLeaveContent');
    const div4 = document.querySelector('#showleave');
    div1.style.display = 'none';
    div3.style.display = 'block';
    div2.style.display = 'none';
    div4.style.display='none';
    loadLecturesIntoTable();
  });
async function loadLecturesIntoTable() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("User not logged in");
    return;
  }

  try {
   const response = await fetch('/teacher/timetable', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

    if (!response.ok) {
      throw new Error('Failed to fetch timetable');
    }

    const timetable = await response.json();

    // Clear existing timetable cells
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const periods = [
      "Period 1", "Period 2", "Period 3", "Period 4",
      "Period 5", "Period 6", "Period 7", "Period 8"
    ];

    days.forEach(day => {
      periods.forEach(period => {
        const cell = document.getElementById(`${day}-${period}`);
        if (cell) {
          cell.innerHTML = ""; // Clear previous content
        }
      });
    });

    // Populate new timetable data
    timetable.forEach(lecture => {
      const day = lecture.day;
      const period = lecture.period;
      const subject = lecture.subject;
      const room = lecture.room;
      const time = lecture.time; // Optional: for showing time too

      const cellId = `${day}-${period}`;
      const cell = document.getElementById(cellId);

      if (cell) {
        cell.innerHTML = `
          <strong>${subject}</strong><br>
          <small>Room: ${room}</small><br>
          <small>${time}</small>
        `;
      }
    });

  } catch (err) {
    console.error("Error loading timetable:", err);
    alert("Could not load timetable");
  }
}






document.getElementById('logoutButton').addEventListener('click', async () => {
  const token = localStorage.getItem('token'); // Ensure this is set during login
  if (!token) {
    alert("You are not logged in.");
    return;
  }

  try {
    const response = await fetch('/Logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    alert(data.message);

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    // Redirect to login or home page
    window.location.href = '/login.html';
  } catch (err) {
    console.error("Logout error:", err);
    alert("Error logging out");
  }
});



