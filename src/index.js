document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(dogs => {
            const dogBar = document.getElementById('dog-bar');
            dogs.forEach(dog => {
                const spanElement = document.createElement('span');
                spanElement.textContent = dog.name;
                spanElement.dataset.id = dog.id; // Store dog ID
                dogBar.appendChild(spanElement);
            });
        });
});
document.getElementById('dog-bar').addEventListener('click', (event) => {
    if (event.target.tagName === 'SPAN') {
        const dogId = event.target.dataset.id;
        fetch(`http://localhost:3000/pups/${dogId}`)
            .then(response => response.json())
            .then(dog => {
                const dogInfoDiv = document.getElementById('dog-info');
                dogInfoDiv.innerHTML = `
                    <img src="${dog.image}" alt="${dog.name}" />
                    <h2>${dog.name}</h2>
                    <button>${dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
                `;
                dogInfoDiv.querySelector('button').dataset.id = dog.id; // Store dog ID in button
            });
    }
});

document.getElementById('dog-info').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const button = event.target;
        const dogId = button.dataset.id;
        const currentStatus = button.textContent === 'Good Dog!';

        fetch(`http://localhost:3000/pups/${dogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isGoodDog: !currentStatus })
        })
        .then(response => response.json())
        .then(updatedDog => {
            button.textContent = updatedDog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
        });
    }
});

document.getElementById('filter-good-dogs').addEventListener('click', (event) => {
    const button = event.target;
    const filterActive = button.textContent.includes('ON');
    const apiUrl = filterActive ? 'http://localhost:3000/pups' : 'http://localhost:3000/pups?isGoodDog=true';

    fetch(apiUrl)
        .then(response => response.json())
        .then(dogs => {
            const dogBar = document.getElementById('dog-bar');
            dogBar.innerHTML = ''; // Clear existing dog list
            dogs.forEach(dog => {
                const spanElement = document.createElement('span');
                spanElement.textContent = dog.name;
                spanElement.dataset.id = dog.id;
                dogBar.appendChild(spanElement);
            });
        });

    button.textContent = filterActive ? 'Filter good dogs: OFF' : 'Filter good dogs: ON';
});

