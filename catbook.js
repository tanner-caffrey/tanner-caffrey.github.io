async function fetchPhotos() {
  return fetch('https://api.gwynnie.gay/v2/photos')
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
    
        photos.forEach(photo => {
            const photoDiv = document.createElement('div');
            photoDiv.id = photo.title; // Removing the file extension for the id
            photoDiv.className = 'scrapbookPhoto';
            
            const imgElement = document.createElement('img');
            imgElement.src = `https://api.gwynnie.gay/v2/photos/${photo.fileName}`;
    
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
        const module = await import('https://unpkg.com/playhtml@latest/dist/init.es.js');
        console.log('Photos have been generated and external module loaded.', module);
        const movableElement = document.querySelector("[can-move]");

        if (movableElement) {
            // Attach an event listener for the `dragend` event
            movableElement.addEventListener("dragend", (e) => {
            // Get the element's current position
            const rect = movableElement.getBoundingClientRect();

            // Get the viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Calculate new position to ensure the element is within bounds
            let newX = rect.left;
            let newY = rect.top;

            if (rect.left < 0) {
                newX = 0;
            }
            if (rect.top < 0) {
                newY = 0;
            }
            if (rect.right > viewportWidth) {
                newX = viewportWidth - rect.width;
            }
            if (rect.bottom > viewportHeight) {
                newY = viewportHeight - rect.height;
            }

            // Apply the new position using transform
            movableElement.style.transform = `translate(${newX}px, ${newY}px)`;
            });
        }
    } catch (error) {
        console.error('Failed to load external module:', error);
    }
}

document.addEventListener('DOMContentLoaded', main);