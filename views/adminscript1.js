    // Mock data for teacher details and course count

    function showDashboard() {
        alert('Dashboard clicked');
        // You can load dashboard content here or navigate to another page
    }

    function showStudents() {
        window.location.href = 'adminstudent.html';
        // You can load students content here or navigate to another page
    }

    function showTeachers() {
        window.location.href = 'adminteacher.html';
        // You can load teachers content here or navigate to another page
    }

    function showSchools() {
        alert('Schools clicked');
        // You can load schools content here or navigate to another page
    }

    function showIncome() {
        alert('Income clicked');
        // You can load income content here or navigate to another page
    }

    function showHelp() {
        alert('Help clicked');
        // You can load help content here or navigate to another page
    }

    function showSettings() {
        alert('Settings clicked');
        // You can load settings content here or navigate to another page
    }

    const teacherDetails = {
        'John Doe': { info: 'John is a Math teacher with 5 years of experience.', courses: 3 },
        'Jane Smith': { info: 'Jane is a Science teacher specializing in Biology and Chemistry.', courses: 2 },
        'Emily Johnson': { info: 'Emily teaches English Literature and Language Arts.', courses: 4 },
        'Teacher 1': { info: 'Teacher 1 specializes in Mathematics, focusing on calculus and algebra.', courses: 3 },
        'Teacher 2': { info: 'Teacher 2 is a Science educator, with a focus on biology and environmental science.', courses: 5 },
        'Teacher 3': { info: 'Teacher 3 teaches History, covering world and American history.', courses: 2 },
        'Teacher 4': { info: 'Teacher 4 is a Physical Education instructor, emphasizing health and fitness.', courses: 1 },
        'Teacher 5': { info: 'Teacher 5 focuses on Art, teaching painting and sculpture.', courses: 4 },
        'Teacher 6': { info: 'Teacher 6 teaches Computer Science, including programming and information technology.', courses: 3 },
        'Teacher 7': { info: 'Teacher 7 specializes in Foreign Languages, offering Spanish and French.', courses: 2 }
    };

    function showTeacherInfo(name) {
        // Set teacher name
        document.getElementById('teacherName').textContent = name;

        // Set teacher info
        const teacherInfo = teacherDetails[name];
        document.getElementById('teacherInfo').textContent = teacherInfo.info;

        // Set course count
        document.getElementById('courseCount').textContent = `Number of courses: ${teacherInfo.courses}`;

        // Show modal
        document.getElementById('teacherInfoModal').style.display = 'block';
    }

    function closeModal() {
        // Close modal
        document.getElementById('teacherInfoModal').style.display = 'none';
    }

    function deleteTeacher() {
        // Dummy function for deleting teacher
        const teacherName = document.getElementById('teacherName').textContent;
        alert(`Deleted teacher: ${teacherName}`);

        // Find and remove the teacher from the list
        const teacherList = document.getElementById('teacherList');
        const listItems = teacherList.getElementsByTagName('li');
        for (let i = 0; i < listItems.length; i++) {
            if (listItems[i].textContent === teacherName) {
                listItems[i].remove();
                break; // Stop loop after removing the teacher
            }
        }

        closeModal();
    }
    var rtx = document.getElementById('myrhart').getContext('2d');
var myrhart = new Chart(rtx, {
    type: 'line', // Or any other type that suits your needs
    data: {
        labels: ['Teacher 1', 'Teacher 2', 'Teacher 3', 'Teacher 4', 'Teacher 5', 'Teacher 6'],
        datasets: [{
            label: '# (10 of Rating)',
            data: [7.5, 3, 9, 9.5, 7, 6.5],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 10, // Setting the maximum value to 10
                stepSize: 1
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Ratings per Teacher',
                font: {
                    size: 20 // You can adjust the size as needed
                }
            }
        }
    }
});

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line', // Or any other type that suits your needs
    data: {
        labels: ['Teacher 1', 'Teacher 2', 'Teacher 3', 'Teacher 4', 'Teacher 5', 'Teacher 6'],
        datasets: [{
            label: '# of Courses',
            data: [12, 19, 3, 15, 6, 2],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Number of Courses per Teacher',
                font: {
                    size: 20 // You can adjust the size as needed
                }
            }
        }
    }
});


    const studentDetails = {
        'Student 1': { info: 'Student 1 is in Grade 10 and excels in Mathematics.', age: 15 },
        'Student 2': { info: 'Student 2 is in Grade 12 and has a passion for literature.', age: 17 },
        'Student 3': { info: 'Student 3 is in Grade 9 and actively participates in sports.', age: 14 },
        'Student 4': { info: 'Student 4 is in Grade 11 and is interested in computer science.', age: 16 },
        'Student 5': { info: 'Student 5 is in Grade 10 and enjoys music as a hobby.', age: 15 },
        'Student 6': { info: 'Student 6 is in Grade 9 and has a keen interest in art.', age: 14 },
        'Student 7': { info: 'Student 7 is in Grade 12 and is preparing for college entrance exams.', age: 17 },
        'Student 8': { info: 'Student 8 is in Grade 11 and volunteers for community service activities.', age: 16 },
        'Student 9': { info: 'Student 9 is in Grade 10 and loves to travel and explore new cultures.', age: 15 },
        'Student 10': { info: 'Student 10 is in Grade 9 and is passionate about environmental conservation.', age: 14 }
    };

    function showStudentInfo(name) {
        // Set student name
        document.getElementById('studentName').textContent = name;

        // Set student info
        const studentInfo = studentDetails[name];
        document.getElementById('studentInfo').textContent = `Details: ${studentInfo.info}, Age: ${studentInfo.age}`;

        // Show modal
        document.getElementById('studentInfoModal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('studentInfoModal').style.display = 'none';
    }

    function deleteStudent() {
        const studentName = document.getElementById('studentName').textContent;
        alert(`Deleted student: ${studentName}`);

        // Find and remove the student from the list
        const studentList = document.getElementById('studentList');
        const listItems = studentList.getElementsByTagName('li');
        for (let i = 0; i < listItems.length; i++) {
            if (listItems[i].textContent === studentName) {
                listItems[i].remove();
                break;
            }
        }

        closeModal();
    }

    // Initialize Chart.js for student age distribution
    var studentCtx = document.getElementById('studentChart').getContext('2d'); // Rename ctx to studentCtx
    var studentChart = new Chart(studentCtx, { // Rename myChart to studentChart
        type: 'bar', // Change the chart type to bar chart
        data: {
            labels: ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5', 'Student 6', 'Student 7', 'Student 8', 'Student 9', 'Student 10'], // Use student names as labels
            datasets: [{
                label: 'Age', // Change the label to 'Age'
                data: [15, 17, 14, 16, 15, 14, 17, 16, 15, 14], // Use student ages as data
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Age'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Students'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Age Distribution of Students',
                    font: {
                        size: 20 // You can adjust the size as needed
                    }
                }
            }
        }
    });

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line', // Or any other type that suits your needs
        data: {
            labels: ['Teacher 1', 'Teacher 2', 'Teacher 3', 'Teacher 4', 'Teacher 5', 'Teacher 6'],
            datasets: [{
                label: '# of Courses',
                data: [12, 19, 3, 15, 6, 2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Number of Courses per Teacher',
                    font: {
                        size: 20 // You can adjust the size as needed
                    }
                }
            }
        }
    });


