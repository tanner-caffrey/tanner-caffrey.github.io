async function fetchPhotoUrls() {
    try {
        const response = await fetch('https://api.gwynnie.gay/photos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Assuming the response has the structure { photos: [ { baseUrl: 'url', filename: 'name' }, ... ] }
        return data.photos.map(photo => ({
            url: photo.baseUrl,
            filename: photo.filename
        }));
    } catch (error) {
        console.error('Failed to fetch photo URLs:', error);
        return [];
    }
}

async function generatePhotoElements() {
    const photos = await fetchPhotoUrls();
    const container = document.getElementById('photoContainer');

    photos.forEach(photo => {
        const photoDiv = document.createElement('div');
        photoDiv.id = photo.filename.replace(/\.[^/.]+$/, ""); // Removing the file extension for the id
        photoDiv.className = 'scrapbookPhoto';
        
        const imgElement = document.createElement('img');
        imgElement.src = `${photo.url}`;
        // imgElement.alt = `Gwynnie, a dilute calico cat, ${photo.filename}`;

        const h3Element = document.createElement('h3');
        // h3Element.innerText = `she's ${photo.filename.split('.')[0].toUpperCase()}`;

        photoDiv.toggleAttribute('can-move');

        photoDiv.appendChild(imgElement);
        photoDiv.appendChild(h3Element);
        // console.log(photoDiv.outerHTML)
        // console.log(photoDiv.outerHTML.replace('=""', ''))
        // photoDiv.outerHTML = photoDiv.outerHTML.replace('can-move=""', '')
        // console.log(photoDiv.outerHTML)
        container.appendChild(photoDiv);
        // container.innerHTML = container.innerHTML.replace('can-move="">', 'can-move>')
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

