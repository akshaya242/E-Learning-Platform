


const noteContent = document.getElementById('noteContent');
const colorPicker = document.getElementById('colorPicker');
const fontSizeInput = document.getElementById('fontSize');
const bulletTypeSelect = document.getElementById('bulletType');

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