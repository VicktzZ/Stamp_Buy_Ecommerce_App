// FUNCTION TO REASSIGN USER DATA FROM LOCAL STORAGE TO DATABASE USER DATA

(async function setUserFromDatabase() {
    const currentUser = JSON.parse(localStorage.getItem('user'))

    const userResponse = await fetch('/api/user/' + currentUser.id)
    const [ user ] = await userResponse.json()
    
    localStorage.setItem('user', JSON.stringify(user))
})()
