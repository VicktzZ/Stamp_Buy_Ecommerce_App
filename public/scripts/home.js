// VARIABLES ASSIGNMENT
const stampsLabel = document.querySelector('.nav-card-button-stamps')
const userStamps = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).tokens : 0

// SET STAMPS VALUE
stampsLabel.innerHTML = `
    <div class="home-stamps-display">
        <div>${userStamps}</div>
        <i class="fa-brands fa-fantasy-flight-games main-stamp home-stamp-icon"></i>
    </div>
`