// FUNCTION TO REASSIGN USER DATA FROM LOCAL STORAGE TO DATABASE USER DATA

/**
 * Fetches the current user's data from the database and updates the local storage.
 */
(async function setUserFromDatabase() {
    // Get the current user from local storage
    const currentUser = JSON.parse(localStorage.getItem('user'))

    // Fetch user data from the API
    const userResponse = await fetch('/api/user/' + currentUser.id)
    const [ user ] = await userResponse.json()

    // Update the user data in local storage
    localStorage.setItem('user', JSON.stringify(user))
})()
