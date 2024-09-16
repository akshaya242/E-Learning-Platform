// Sample courses data
const courses = [
    { title: "Web Development Fundamentals", category: "Computer Science", description: "Get started with web development.", link: "./fullstackcourse.html", image: "./images/course5.jpeg" },
    { title: "Introduction to Programming", category: "Computer Science", description: "Learn the basics of programming.", link: "https://example.com/webdev",image: "./images/course1.jpeg" },
    { title: "Algebra Basics", category: "Maths", description: "Explore fundamental concepts in algebra.", link: "https://example.com/algebra", image: "./images/course2.jpeg" },
    { title: "English Literature", category: "English", description: "Dive into classic works of English literature.", link: "https://example.com/literature", image: "./images/course3.jpg" },
    { title: "Management Principles", category: "Management", description: "Understand key principles of management.", link: "https://example.com/management", image: "./images/course4.jpg" },
    { title: "Web Development Fundamentals", category: "Computer Science", description: "Get started with web development.", link: "https://example.com/webdev", image: "./images/course5.jpeg" },
    { title: "Statistics for Beginners", category: "Maths", description: "Learn basic statistical concepts and analysis.", link: "https://example.com/statistics", image: "./images/course6.jpeg"},
    { title: "Creative Writing", category: "English", description: "Express yourself through creative writing.", link: "https://example.com/creativewriting", image: "./images/course7.jpg" },
    { title: "Project Management Essentials", category: "Management", description: "Essential skills for effective project management.", link: "https://example.com/projectmanagement", image: "./images/course8.jpeg" },
    
];

// Display initial courses
displayCourses(courses);

function displayCourses(coursesToShow) {
    const coursesContainer = document.getElementById("courses-container");
    coursesContainer.innerHTML = '';

    coursesToShow.forEach(course => {
        const courseContainer = document.createElement("div");
        courseContainer.classList.add("course-container");

        const courseImage = document.createElement("img");
        courseImage.classList.add("course-image");
        courseImage.src = course.image;
        courseContainer.appendChild(courseImage);

        const courseName = document.createElement("p");
        courseName.innerText = course.title;
        courseContainer.appendChild(courseName);

        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.innerText = course.description;
        courseContainer.appendChild(tooltip);

        // Open the link in a new tab when clicking on the course container
        courseContainer.onclick = function () {
            window.open(course.link, '_blank');
        };

        coursesContainer.appendChild(courseContainer);
    });
}

function searchCourses() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const filteredCourses = courses.filter(course => course.title.toLowerCase().includes(searchTerm));
    displayCourses(filteredCourses);
}

function filterCourses() {
    const allCheckbox = document.getElementById("all-checkbox");
    const csCheckbox = document.getElementById("cs-checkbox");
    const mathCheckbox = document.getElementById("math-checkbox");
    const engCheckbox = document.getElementById("eng-checkbox");
    const mgmtCheckbox = document.getElementById("mgmt-checkbox");
    const artsscheckbox = document.getElementById("arts-checkbox")

    let filteredCourses = [];

    if (allCheckbox.checked) {
        filteredCourses = courses;
    } else {
        filteredCourses = courses.filter(course => {
            return (
                (csCheckbox.checked && course.category === "Computer Science") ||
                (mathCheckbox.checked && course.category === "Maths") ||
                (engCheckbox.checked && course.category === "English") ||
                (mgmtCheckbox.checked && course.category === "Management")
            );
        });
    }

    displayCourses(filteredCourses);
}

