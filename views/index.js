document.addEventListener("DOMContentLoaded", function() {
  fetch('header.html')
      .then(response => response.text())
      .then(data => {
          document.getElementById('header').innerHTML = data;
      })
      .catch(error => console.error('Error fetching included content:', error));
});

document.addEventListener("DOMContentLoaded", function() {
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Error fetching included content:', error));
});


document.addEventListener("DOMContentLoaded", function() {

let hamMenuIcon = document.getElementById("ham-menu");
let navBar = document.getElementById("nav-bar");
let navLinks = navBar.querySelectorAll("li");

hamMenuIcon.addEventListener("click", () => {
navBar.classList.toggle("active");
hamMenuIcon.classList.toggle("fa-times");
});
navLinks.forEach((navLinks) => {
navLinks.addEventListener("click", () => {
  navBar.classList.remove("active");
  hamMenuIcon.classList.toggle("fa-times");
});
});
});

document.addEventListener("DOMContentLoaded", function() {
const toggles = document.querySelectorAll(".faq-toggle"); 

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    toggle.parentElement.classList.toggle("active");
  });
});
});

function playVideo(videoSrc) {
  // Show the video container with animation
  var videoContainer = document.getElementById('video-container');
  videoContainer.classList.remove('hidden');

  // Create the video iframe
  var videoIframe = document.createElement('iframe');
  videoIframe.setAttribute('width', '100%');
  videoIframe.setAttribute('height', '100%');
  videoIframe.setAttribute('src', videoSrc);
  videoIframe.setAttribute('title', 'YouTube video player');
  videoIframe.setAttribute('frameborder', '0');
  videoIframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  videoIframe.setAttribute('allowfullscreen', '');

  // Remove any existing video iframe from the video wrapper
  var videoWrapper = document.getElementById('video-container');
  while (videoWrapper.firstChild) {
      videoWrapper.removeChild(videoWrapper.firstChild);
  }

  // Append the new video iframe to the video wrapper
  videoWrapper.appendChild(videoIframe);
}
function animateSection(section) {
  // Clone the section and its content
  var newSection = section.cloneNode(true);

  // Replace the old section with the new one
  section.parentNode.replaceChild(newSection, section);

  // Add the 'animate' class to the new section
  newSection.classList.add('animate');
}

function overview() {
  var section = document.getElementById('content1');
  section.innerHTML = "<h2>About this course</h2><p>Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps </p><hr><h3>Features</h3>Available on iOS and Android Coding exercises <hr><h3>Description</h3>Welcome to the Complete Web Development Bootcamp, the only course you need to learn to code and become a full-stack web developer.<br>We'll take you step-by-step through engaging video tutorials and teach you everything you need to know to succeed as a web developer.<br>The course includes over 62 hours of HD video tutorials and builds your programming knowledge while making real-world websites and web apps.";
  section.classList.remove('hidden1');
  animateSection(section);
}

function qa() {
  // Get the section element by its id    
  // Add content to the section
  var section = document.getElementById('content1');
  section.innerHTML  = "<h4>Q.Where did old videos go?</h4><p>A.The course is updated regularly according the trends of the market so new videos have been added.You can view old videos in the link provided to you through mail.<h4>Q.Where are course PDFs?</h4><p>A.It is in the notes section.You can hover over to the next section.</p><h4>Q.How to make best use of this course?</h4><p>A.This is explained properly in the videos of the course you may view it.</p><h4>Q.How to download mongodb?</h4><p>A.It has been covered in the backend parts of our course kindly look into it.</p>";
  section.classList.remove('hidden1')
  animateSection(section);
}

// Add similar functions for other buttons...
function notes() {
  // Get the section element by its id
  // Add content to the section
  var section = document.getElementById('content1');
  section.innerHTML = "<h2>This is the content!</h2><p>You may download notes from <a href='http://www.sample.org/head' target='_blank'>here</a>.</p>";
  section.classList.remove('hidden1')
  animateSection(section);
}

function announcement() {
  // Get the section element by its id   
  // Add content to the section
  var section = document.getElementById('content1');
  section.innerHTML = "<h4>Great News! Course Fully Updated for 2024!</h4><p>How is your new year going? Have you set a new years resolution to finally learn to code? Or do you have a goal to change careers this year? No matter your motivation for picking up the Complete Web Development Bootcamp, I've got fantastic news for you!We just released the fully updated Authentication module! This means that all modules in this course is now fully up to date! It took a lot of effort and we made lots of updates to make this course relevant for programmers in 2024.So if you bought this course a million years ago and still haven't started or watched some videos but never made the jump to actually writing some code. Then this is your sign to get started today!</p>";
  section.classList.remove('hidden1')
  animateSection(section);
}
function reviews() {
  // Get the section element by its id   
  // Add content to the section
  var section = document.getElementById('content1');
  section.innerHTML = "<h4>Akaay</h4><p>I really liked the build first approach in this course, you basically build a mini project for every section you learn. Some sections are little outdated but it is getting constant updates.</p><h4>Zoro</h4><p>Course is Well Organized and Well taught. After completing this course your concepts on frontend and Backend will be cristal clear. After that all depends on your practice.</p><h4>Steven</h4><p>Cover broad of topic in web development industry. Explained a lot of basic programming knowledge with easy to understand explanation.Not only doing programming together with video, this course is full of homework, test, and training where it really does test your knowledge about the topic.Love this course.</p>";
  section.classList.remove('hidden1')
  animateSection(section);
}
function refermaterials() {
  // Get the section element by its id    
  // Add content to the section
  var section = document.getElementById('content1');
  section.innerHTML  = "<h4>Learning materials right over here</h4><table><ul><li>HTML and CSS: Design and Build Websites, by Jon Duckett</li><li>HTML5: The Missing Manual</li><li>Learning Web Design: A beginner’s guide to HTML, CSS, Javascript, and Web Graphics, By Jennifer Niederst Robbins</li><li>Eloquent Javascript: by Marijn Haverbake</li><li> JavaScript: The Good Parts 1st Edition</li><li>CSS Mastery: Advanced Web Standards Solutions</li><li>You Don’t Know JS – ES6 & Beyond</li></ul></table>";
  section.classList.remove('hidden1')
  animateSection(section);
}
function quiz() {
  // Get the section element by its id   
  // Add content to the section
  var section = document.getElementById('content1');
  section.innerHTML = '<form id="quizForm"><p>1. What does HTML stand for?</p><label><input type="radio" name="q1" value="a"> Hyper Text Markup Language</label><br><label><input type="radio" name="q1" value="b"> Hyperlinks and Text Markup Language</label><br><label><input type="radio" name="q1" value="c"> Home Tool Markup Language</label><br><br><p>2. What is the correct tag for inserting a line break in HTML?</p><label><input type="radio" name="q2" value="a"> &lt;br&gt;</label><br><label><input type="radio" name="q2" value="b"> &lt;break&gt;</label><br><label><input type="radio" name="q2" value="c"> &lt;linebreak&gt;</label><br><br><p>3. Which of the following is NOT a programming language?</p><label><input type="radio" name="q3" value="a"> HTML</label><br><label><input type="radio" name="q3" value="b"> CSS</label><br><label><input type="radio" name="q3" value="c"> JPG</label><br><br><p>4. What does CSS stand for?</p><label><input type="radio" name="q4" value="a"> Computer Style Sheets</label><br><label><input type="radio" name="q4" value="b"> Cascading Style Sheets</label><br><label><input type="radio" name="q4" value="c"> Colorful Style Sheets</label><br><p>1. What does HTML stand for?</p><label><input type="radio" name="q1" value="a"> Hyper Text Markup Language</label><br><p>5. Which HTML tag is used to define an unordered list?</p><label><input type="radio" name="q5" value="a"> &lt;ul&gt;</label><br><label><input type="radio" name="q5" value="b"> &lt;ol&gt;</label><br><label><input type="radio" name="q5" value="c"> &lt;list&gt;</label><br><br><button type="button" onclick="checkAnswers()">Submit</button></form>';
  section.classList.remove('hidden1')
  animateSection(section);
}
function checkAnswers() {
  // Get user's answers
  var q1Answer = document.querySelector('input[name="q1"]:checked').value;
  var q2Answer = document.querySelector('input[name="q2"]:checked').value;
  var q3Answer = document.querySelector('input[name="q3"]:checked').value;
  var q4Answer = document.querySelector('input[name="q4"]:checked').value;
  var q5Answer = document.querySelector('input[name="q5"]:checked').value;

  // Check answers
  var correctAnswers = 0;
  if (q1Answer === "a") correctAnswers++;
  if (q2Answer === "a") correctAnswers++;
  if (q3Answer === "c") correctAnswers++;
  if (q4Answer === "b") correctAnswers++;
  if (q5Answer === "a") correctAnswers++;

  // Show result
  var message;
  if (correctAnswers === 5) {
      message = "Congratulations! You got all answers correct!";
  } 
  else {
      message = "You got " + correctAnswers + " out of 5 answers correct.";
  }
  alert(message);
}
// Get all buttons with the class "changeButton"
var buttons = document.querySelectorAll('.changeButton');

// Add click event listeners to each button
// buttons.forEach(function(button) {
// button.addEventListener('click', function() {
//   // Reset background color for all buttons
//   buttons.forEach(function(btn) {
//     btn.style.backgroundColor = ''; // Reset background color
//   });
  
//   // Set background color of the clicked button to black
//   this.style.backgroundColor = 'darkcyan';
// });
// });
function showHideText(element, id) {
  var extraText = document.getElementById(id);
  if (element.value == "show") {
      extraText.style.display = "table-row"; // Show the row
  } 
  else {
      extraText.style.display = "none"; // Hide the row
  }
}
//window.onload = overview;