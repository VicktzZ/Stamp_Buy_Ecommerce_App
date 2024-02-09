// GETTING USER DATA FROM LOCAL STORAGE
const user = JSON.parse(localStorage.getItem('user'))

// USER LOGOUT FUNCTION
function logout() {
    localStorage.removeItem('user')
    window.location.href = '/'
}

// IF USER DOESN'T EXISTS REDIRECT TO LOGIN
if (!user) {
    window.location.href = '/'
}

// SHOWS USER INFO IN DROPDOWN MENU
const usernameDiv = document.querySelector('.dropdown-item-username')
const userTokens = document.querySelector('.user-tokens')

usernameDiv.innerHTML = `Olá ${user.username}!`
userTokens.innerHTML = user.tokens