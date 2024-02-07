const prodCardButtons = document.querySelectorAll('.product-card-button')
const prodPrices = document.querySelectorAll('.product-stamp-price')
const usernameDiv = document.querySelector('.dropdown-item-username')

const errorNotification = document.querySelector('.error-notification')
const errorNotificationText = document.querySelector('.error-notification-text')

const modalBody = document.querySelector('.modal-body')
const modalFooter = document.querySelector('.modal-footer')

const userTokens = document.querySelector('.user-tokens')
const user = JSON.parse(localStorage.getItem('user'))

usernameDiv.innerHTML = `Olá ${user.username}!`

if (!user) {
    window.location.href = '/'
}

userTokens.innerHTML = user.tokens

function logout() {
    localStorage.removeItem('user')
    window.location.href = '/'
}

prodCardButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const price = Number(prodPrices[index].firstElementChild.innerHTML)

        modalBody.innerHTML = `
            <div class='d-flex gap-2'>
                Você irá perder
                <div class="d-flex gap-1" style="align-items: center;">
                    <div class="user-tokens">${price}</div>
                    <i class="fa-brands fa-fantasy-flight-games dropdown-stamp"></i>
                </div> selos.
            </div>
        `

        modalFooter.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button onclick="confirmPurchase(event, ${price})" type="button" class="btn btn-warning confirm-purchase-button">Confirmar</button>
        `
    })
})

async function confirmPurchase(ev, price) {
    ev.target.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>'
    
    setTimeout(async () => {
        if (user.tokens < price) {
            ev.target.innerHTML = 'Confirmar'
    
            errorNotification.style.display = 'block'
            errorNotificationText.textContent = 'Você não possui selos suficientes para realizar esta compra!'
    
            setTimeout(() => {
                window.addEventListener('click', () => {
                    errorNotification.style.display = 'none'
                })
            }, 200);
    
            return
        }
    
        try {
            const newTokens = user.tokens - price
    
            const response = await fetch('/api/user', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: user.id,
                    tokens: newTokens
                })
            }).then(res => res.json())
    
            if (response.error) {
                errorNotification.style.display = 'block'
                errorNotificationText.textContent = 'Algo deu errado, tente novamente!'
                return
            }
            
            setTimeout(() => {
                localStorage.setItem('user', JSON.stringify({ ...user, tokens: newTokens }))
                window.location.reload()    
            }, 500);
        } catch (error) {
            errorNotification.style.display = 'block'
            errorNotificationText.textContent = 'Algo deu errado: ' + error.message
        }
    }, 300);
}