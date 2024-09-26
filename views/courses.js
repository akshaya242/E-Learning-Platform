
// Sample courses data
const courses = courses;

// Display initial courses
displayCourses(courses);

function displayCourses(coursesData) {
    const coursesContainer = document.getElementById("courses-container");
    coursesContainer.innerHTML = '';

    coursesData.forEach(course => {
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
                (mgmtCheckbox.checked && course.category === "Management") ||
                (artsCheckbox.checked && course.category === "Arts")

            );
        });
    }

    displayCourses(filteredCourses);
}

