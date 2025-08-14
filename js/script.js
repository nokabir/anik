document.addEventListener('DOMContentLoaded', () => {
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const diceResultSpan = document.getElementById('dice-result');

    // This code only runs on the game page where the dice button exists
    if (rollDiceBtn && diceResultSpan) {
        rollDiceBtn.addEventListener('click', () => {
            // Add a class to trigger the animation
            diceResultSpan.classList.add('rolling');
            // Clear previous result and show a temporary "rolling" state
            diceResultSpan.textContent = '...';

            // Wait for the animation to finish (e.g., 1 second)
            setTimeout(() => {
                // Generate a random number between 1 and 6
                const result = Math.floor(Math.random() * 6) + 1;

                // Remove the animation class and display the final result
                diceResultSpan.classList.remove('rolling');
                diceResultSpan.textContent = result;
            }, 1000);
        });
    }

    // --- Piece Selection and Movement Logic ---
    let selectedPiece = null;
    const pieces = document.querySelectorAll('.piece');
    const cells = document.querySelectorAll('.cell, .piece-start');

    pieces.forEach(piece => {
        piece.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click from bubbling to the parent cell

            if (piece.classList.contains('selected')) {
                // Deselect if clicking the same piece
                piece.classList.remove('selected');
                selectedPiece = null;
            } else {
                // Deselect any other piece
                pieces.forEach(p => p.classList.remove('selected'));
                // Select the new piece
                piece.classList.add('selected');
                selectedPiece = piece;
            }
        });
    });

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (selectedPiece) {
                // Move the selected piece to this cell
                cell.appendChild(selectedPiece);
                // Deselect the piece after moving
                selectedPiece.classList.remove('selected');
                selectedPiece = null;
            }
        });
    });

    // --- Simulated Auth Flow ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            window.location.href = 'dashboard.html';
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            window.location.href = 'dashboard.html';
        });
    }
});
