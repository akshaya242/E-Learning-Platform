const noteContent = document.getElementById('noteContent');
const colorPicker = document.getElementById('colorPicker');
const fontSizeInput = document.getElementById('fontSize');
const bulletTypeSelect = document.getElementById('bulletType');
const saveButton = document.createElement('button');

// Create and append the Save Note button
saveButton.innerText = "Save Note";
saveButton.style.marginTop = "10px";
document.getElementById('note-container').appendChild(saveButton);

// Handle color changes
colorPicker.addEventListener('input', () => {
    noteContent.style.color = colorPicker.value;
});

// Handle font size changes
fontSizeInput.addEventListener('input', () => {
    noteContent.style.fontSize = `${fontSizeInput.value}px`;
});

// Handle bullet/numbered list changes
bulletTypeSelect.addEventListener('change', () => {
    const bulletType = bulletTypeSelect.value;
    if (bulletType === 'none') {
        noteContent.innerHTML = noteContent.innerHTML.replace(/<\/li>/g, '').replace(/<li>/g, '');
    } else {
        noteContent.innerHTML = `<${bulletType === 'square' ? 'ul' : 'ol'}><li>${noteContent.innerHTML}</li></${bulletType === 'square' ? 'ul' : 'ol'}>`;
    }
});

// Event listener for save button
saveButton.addEventListener('click', async () => {
    const content = noteContent.innerHTML.trim(); // Trim to avoid empty content submission

    // Debugging: log the content before sending
    console.log('Content to save:', content); 

    // Basic validation to avoid saving empty notes
    if (!content) {
        alert("Note content cannot be empty");
        return;
    }

    try {
        // Send POST request to save the note
        const response = await fetch('/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });

        const result = await response.json();
        alert(result.message); // Display success or failure message
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Failed to save your notes. Please try again.');
    }
});
