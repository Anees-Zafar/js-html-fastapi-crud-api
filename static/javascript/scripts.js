async function fetch_data() {
    try {
        const response = await fetch('/items');
        const data = await response.json();

        // Assuming the response is a dictionary with a "pages" key containing the array of pages
        if (!data.pages || !Array.isArray(data.pages)) {
            throw new Error("Response does not contain an array of pages");
        }

        const new_div = document.getElementsByClassName('rendered_data')[0];
        new_div.innerHTML = ''; // Clear existing content

        data.pages.forEach(page => {
            const pageDiv = document.createElement('div');
            pageDiv.classList.add('page');
            pageDiv.innerHTML = `
            <h2>${page.id}</h2>
                <h2>${page.title}</h2>
                <p>${page.content}</p>
                <button onclick="deletePage(${page.id})">Delete</button>
                <button onclick="update_data(${page.id})">Update</button>

            `;
            new_div.appendChild(pageDiv);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function create_data() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    try {
        const response = await fetch('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: Date.now(), title, content })
        });
        const newPage = await response.json();
        console.log(newPage);
        fetch_data(); // Refresh data after creation
    } catch (error) {
        console.error('Error creating data:', error);
    }
}




async function update_data(id) {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    try {
        const response = await fetch(`/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, title, content })
        });
        const updatedPage = await response.json();
        console.log(updatedPage);
        fetch_data(); // Refresh data after updating
    } catch (error) {
        console.error('Error updating data:', error);
    }
}



async function deletePage(id) {
    try {
        await fetch(`/items/${id}`, {
            method: 'DELETE'
        });
        fetch_data(); // Refresh data after deletion
    } catch (error) {
        console.error('Error deleting page:', error);
    }
}

fetch_data();
