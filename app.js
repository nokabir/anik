document.addEventListener('DOMContentLoaded', () => {
    const tournamentList = document.getElementById('tournament-list');
    const adminForm = document.getElementById('add-tournament-form');
    const existingTournamentsDiv = document.getElementById('existing-tournaments');

    const API_URL = 'http://localhost:3000/api/tournaments';

    // Function to fetch and display tournaments for the admin page
    const fetchAdminTournaments = () => {
        if (!existingTournamentsDiv) return;
        fetch(API_URL)
            .then(response => response.json())
            .then(tournaments => {
                existingTournamentsDiv.innerHTML = tournaments.map(t => `
                    <div class="tournament-card" id="tournament-${t.id}">
                        <h3>${t.name}</h3>
                        <p>Date: ${t.date}</p>
                        <button onclick="deleteTournament(${t.id})">Delete</button>
                    </div>
                `).join('');
            })
            .catch(error => console.error('Error fetching tournaments for admin:', error));
    };

    // Logic for the main page (index.html)
    if (tournamentList) {
        fetch(API_URL)
            .then(response => response.json())
            .then(tournaments => {
                if (tournaments.length === 0) {
                    tournamentList.innerHTML = '<p>No tournaments found.</p>';
                    return;
                }
                tournamentList.innerHTML = tournaments.map(tournament => `
                    <div class="tournament-card">
                        <h3>${tournament.name}</h3>
                        <p>Date: ${tournament.date}</p>
                        <p>Entry Fee: ${tournament.entryFee}</p>
                        <p>Prize Pool: ${tournament.prizePool}</p>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Error fetching tournaments:', error);
                tournamentList.innerHTML = '<p>Error loading tournaments. Please try again later.</p>';
            });
    }

    // Logic for the admin page (admin.html)
    if (adminForm) {
        // Fetch and display existing tournaments when the page loads
        fetchAdminTournaments();

        // Handle form submission for adding a new tournament
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('tournament-name').value;
            const date = document.getElementById('tournament-date').value;

            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, date, entryFee: '$5', prizePool: '$200' }) // Added placeholder fee/prize
            })
            .then(response => response.json())
            .then(() => {
                adminForm.reset();
                fetchAdminTournaments(); // Refresh the list
            })
            .catch(error => console.error('Error adding tournament:', error));
        });
    }
});

// Global function to delete a tournament
function deleteTournament(id) {
    if (!confirm('Are you sure you want to delete this tournament?')) {
        return;
    }
    fetch(`http://localhost:3000/api/tournaments/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                // Remove the tournament card from the DOM
                const tournamentCard = document.getElementById(`tournament-${id}`);
                if (tournamentCard) {
                    tournamentCard.remove();
                }
            } else {
                alert('Failed to delete tournament.');
            }
        })
        .catch(error => console.error('Error deleting tournament:', error));
}
