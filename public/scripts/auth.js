const loginForm = `
<div class="login-header">Login</div>
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
        <div class="login-footer">
            <div onclick="changeForm(event)" class="forgot-password-login">Não possui uma conta?</div>
            <button onclick="login(event)" type="submit" class="btn btn-warning">Entrar</button>
        </div>
    </div>
</div>
<div class="container error-notification">
    <div class="alert alert-danger error-notification-text" role="alert"></div>
</div>
`

const signupForm = `
<div class="login-header">Sign Up</div>
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
        <div class="login-footer">
            <div onclick="changeForm(event)" class="forgot-password-signup">Já possui uma conta?</div>
            <button onclick="signup(event)" type="submit" class="btn btn-warning">Cadastrar</button>
        </div>
    </div>
</div>
<div class="container error-notification">
    <div class="alert alert-danger error-notification-text" role="alert"></div>
</div>
`
function init() {
    document.querySelector('.login-form').innerHTML = loginForm
}

function handleSubmit(ev) {
    ev.preventDefault()
}

function changeForm(ev) {
    const loginWrapper = document.querySelector('.login-form')

    if (ev.target.className === 'forgot-password-login') 
        loginWrapper.innerHTML = signupForm   
    else
        loginWrapper.innerHTML = loginForm 
}

async function login(ev) {
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value

    const errorNotification = document.querySelector('.error-notification')
    const errorNotificationText = document.querySelector('.error-notification-text')

    const buttonName = ev.target.innerHTML

    errorNotification.style.display = 'none'
    ev.target.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>'

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

    setTimeout(() => {
        if (!response) {
            errorNotification.style.display = 'block'
            errorNotificationText.textContent = 'Usuário ou senha inválidos!'
            ev.target.innerHTML = buttonName
        } else {
            localStorage.setItem('user', JSON.stringify(response))
            window.location.href = '/home'
        }
        console.log(response);
    }, 500);
}

async function signup(ev) {
    const email = document.querySelector('#email').value
    const username = document.querySelector('#username').value
    const password = document.querySelector('#password').value
    const confirmPassword = document.querySelector('#confirm-password').value

    const errorNotification = document.querySelector('.error-notification')
    const errorNotificationText = document.querySelector('.error-notification-text')

    const buttonName = ev.target.innerHTML

    errorNotification.style.display = 'none'
    ev.target.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>'

    if (password !== confirmPassword) {
        errorNotification.style.display = 'block'
        errorNotificationText.textContent = 'As senhas precisam ser iguais!'
        ev.target.innerHTML = buttonName
        return
    }

    try {
        const user = {
            email,
            username,
            password
        }

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(res => res.json())

        const [ userResponse ] = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
    
        setTimeout(() => {
            if (response.error) {
                ev.target.innerHTML = buttonName
                errorNotification.style.display = 'block'
                errorNotificationText.textContent = 'Preencha todos os campos!'
            } else {
                localStorage.setItem('user', JSON.stringify(userResponse))
                window.location.href = '/home'
            }
        }, 500);
    } catch (error) {
        ev.target.innerHTML = buttonName
        errorNotification.style.display = 'block'
        errorNotificationText.textContent = 'Ops! Algo deu errado, tente novamente.'
    }
}

init()