async function fetchPhotos() {
  return fetch('https://api.gwynnie.gay/photos/photos.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          throw error; // Ensure the error propagates
      });
}


function generatePhotoElements() {
    fetchPhotos().then(
      photos => {
        console.log("Fetched photos object in generatePhotoElements:", photos);
        const container = document.getElementById('photoContainer');
    
        photos.photos.forEach(photo => {
            const photoDiv = document.createElement('div');
            photoDiv.id = photo.title; // Removing the file extension for the id
            photoDiv.className = 'scrapbookPhoto';
            
            const imgElement = document.createElement('img');
            imgElement.src = `https://api.gwynnie.gay/photos/${photo.filename}`;
    
            const h3Element = document.createElement('h2');
            h3Element.textContent=`${photo.description}`
    
            photoDiv.toggleAttribute('can-move');
    
            photoDiv.appendChild(imgElement);
            photoDiv.appendChild(h3Element);
            container.appendChild(photoDiv);
        })
      }
    )
    
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
    generatePhotoElements();
    try {
        const module = await import('https://unpkg.com/playhtml@latest/dist/init.es.js'); // Replace with the actual URL of the external module
        console.log('Photos have been generated and external module loaded.', module);
        // Use the module's exports as needed
    } catch (error) {
        console.error('Failed to load external module:', error);
    }
}

document.addEventListener('DOMContentLoaded', main);

