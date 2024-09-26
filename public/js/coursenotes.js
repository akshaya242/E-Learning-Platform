const noteContent = document.getElementById('noteContent');
const colorPicker = document.getElementById('colorPicker');
const fontSizeInput = document.getElementById('fontSize');
const bulletTypeSelect = document.getElementById('bulletType');
const saveButton = document.createElement('button');

saveButton.innerText = "Save Note";
saveButton.style.marginTop = "10px";
document.getElementById('note-container').appendChild(saveButton);

colorPicker.addEventListener('input', () => {
    noteContent.style.color = colorPicker.value;
});

fontSizeInput.addEventListener('input', () => {
    noteContent.style.fontSize = `${fontSizeInput.value}px`;
});

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
    const content = noteContent.innerHTML;

    try {
        const response = await fetch('/notes/save-note', { // Changed to correct route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });

        const result = await response.json();
        alert(result.message); // Alert success or failure message
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Failed to save your notes. Please try again.');
    }
});

