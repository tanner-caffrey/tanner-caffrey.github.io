async function fetchPhotos() {
    fetch('https://gwynnie.gay/photos/photos.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // The parsed JSON data
      // Now you can use `data` to populate your site content
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

async function generatePhotoElements() {
    const photosObj = await fetchPhotos();
    const container = document.getElementById('photoContainer');

    photosObj.photos.forEach(photo => {
        const photoDiv = document.createElement('div');
        photoDiv.id = photo.filename.replace(/\.[^/.]+$/, ""); // Removing the file extension for the id
        photoDiv.className = 'scrapbookPhoto';
        
        const imgElement = document.createElement('img');
        imgElement.src = `photos/${photo.name}`;

        const h3Element = document.createElement('h3');
        h3Element.textContent=`${photo.description}`

        photoDiv.toggleAttribute('can-move');

        photoDiv.appendChild(imgElement);
        photoDiv.appendChild(h3Element);
        container.appendChild(photoDiv);
    });
    return Promise.resolve();
}


function loadExternalScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function main() {
    await generatePhotoElements();
    try {
        const module = await import('https://unpkg.com/playhtml@latest/dist/init.es.js'); // Replace with the actual URL of the external module
        console.log('Photos have been generated and external module loaded.', module);
        // Use the module's exports as needed
    } catch (error) {
        console.error('Failed to load external module:', error);
    }
}

document.addEventListener('DOMContentLoaded', main);

