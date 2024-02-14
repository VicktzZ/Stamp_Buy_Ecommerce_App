// LOGIN FORM HTML DOC
const loginForm = `
<div class="auth-header">Login</div>
<div class="container">
    <div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
                type="email"
                class="form-control"
                name="email"
                id="email"
                aria-describedby="emailHelpId"
                placeholder="abc@mail.com"
                required
            />
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <input
                type="password"
                class="form-control"
                name="password"
                id="password"
                placeholder="12345678"
                required
            />
        </div>
        <div class="auth-footer">
            <div onclick="changeForm(event)" class="account-login">Não possui uma conta?</div>
            <button onclick="login(event)" type="submit" class="btn btn-primary">Entrar</button>
        </div>
    </div>
</div>
<div class="container error-notification">
    <div class="alert alert-danger error-notification-text" role="alert"></div>
</div>
`

// SIGNUP FORM HTML DOC
const signupForm = `
<div class="auth-header">Sign Up</div>
<div class="container">
    <div>
        <div class="mb-3">
            <label for="username" class="form-label">Nome</label>
            <input
                type="text"
                class="form-control"
                name="username"
                id="username"
                aria-describedby="helpId"
                placeholder="John Doe"
                required
            />
        </div>
        
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
                type="email"
                class="form-control"
                name="email"
                id="email"
                aria-describedby="emailHelpId"
                placeholder="abc@mail.com"
                required
            />
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <input
                type="password"
                class="form-control"
                name="password"
                id="password"
                placeholder="12345678"
                required
            />
        </div>
        <div class="mb-3">
            <label for="confirm-password" class="form-label">Confirmar senha</label>
            <input
                type="password"
                class="form-control"
                name="confirm-password"
                id="confirm-password"
                placeholder="12345678"
                required
            />
        </div>
        <div class="auth-footer">
            <div onclick="changeForm(event)" class="account-signup">Já possui uma conta?</div>
            <button onclick="signup(event)" type="submit" class="btn btn-primary">Cadastrar</button>
        </div>
    </div>
</div>
<div class="container error-notification">
    <div class="alert alert-danger error-notification-text" role="alert"></div>
</div>
`

// SETS THE INITIAL FORM ON PAGE LOAD 
function init() {
    // USER VERIFICATION

    if (localStorage.getItem('user')) {
        window.location.href = '/home'
    }

    document.querySelector('.auth-form').innerHTML = loginForm
}

/**
 * Prevents the default form action.
 * @param {Event} ev - The event object.
 */
function handleSubmit(ev) {
    ev.preventDefault();
}

/**
 * Changes the form based on the event target
 * @param {Event} ev - The event triggering the form change
 */
function changeForm(ev) {
    const authWrapper = document.querySelector('.auth-form')

    if (ev.target.className === 'account-login') {
        // Replace the form with signup form if the target is account-login
        authWrapper.innerHTML = signupForm   
    } else {
        // Replace the form with login form if the target is not account-login
        authWrapper.innerHTML = loginForm 
    }
}

/**
 * Handles the login process
 * @param {Event} ev - The event object
 */
async function login(ev) {
    // Get email and password from input fields
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value

    // Get error notification elements and button name
    const errorNotification = document.querySelector('.error-notification')
    const errorNotificationText = document.querySelector('.error-notification-text')
    const buttonName = ev.target.innerHTML

    // Set default values for error notification and button name
    errorNotification.style.display = 'none'
    ev.target.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>'

    // Send login request to the server
    try {
        const [ response ] = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
    
        // Handle server response
        setTimeout(() => {
            if (!response) {
                // Display error notification if login is unsuccessful
                errorNotification.style.display = 'block'
                errorNotificationText.textContent = 'Invalid username or password!'
                ev.target.innerHTML = buttonName
            } else {
                // Store user data in local storage and redirect to home page if login is successful
                localStorage.setItem('user', JSON.stringify(response))
                window.location.href = '/home'
            }
            console.log(response);
        }, 500);
    } catch (error) {
        // Handle errors if the login request fails
        errorNotification.style.display = 'block'
        errorNotificationText.textContent = 'Oops! Something went wrong!'
        ev.target.innerHTML = buttonName        
    }
}

/**
 * Handles the signup process
 * @param {Event} ev - The event object
 */
async function signup(ev) {
    // Get input values
    const email = document.querySelector('#email').value
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value
    const confirmPassword = document.querySelector('#confirm-password').value

    // Get error notification elements
    const errorNotification = document.querySelector('.error-notification')
    const errorNotificationText = document.querySelector('.error-notification-text')

    // Get button name
    const buttonName = ev.target.innerHTML

    // Hide error notification and show spinner
    errorNotification.style.display = 'none'
    ev.target.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>'

    // Validate password match
    if (password !== confirmPassword) {
        errorNotification.style.display = 'block'
        errorNotificationText.textContent = 'Passwords must match!'
        ev.target.innerHTML = buttonName
        return
    }

    try {
        // Create user object
        const user = {
            email,
            username,
            password
        }

        // Send signup request
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(res => res.json())

        // Send login request if user created successfully
        const [userResponse] = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())

        // Delay the response handling
        setTimeout(() => {
            if (response.error) {
                ev.target.innerHTML = buttonName
                errorNotification.style.display = 'block'
                errorNotificationText.textContent = 'Fill in all the fields!'
            } else {
                // Save user data and redirect to home page
                localStorage.setItem('user', JSON.stringify(userResponse))
                window.location.href = '/home'
            }
        }, 500);
    } catch (error) {
        // Handle errors
        ev.target.innerHTML = buttonName
        errorNotification.style.display = 'block'
        errorNotificationText.textContent = 'Oops! Something went wrong, please try again.'
    }
}

init()