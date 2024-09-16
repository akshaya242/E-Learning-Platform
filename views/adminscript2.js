
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


