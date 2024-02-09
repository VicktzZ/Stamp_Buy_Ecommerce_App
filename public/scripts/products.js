// VARIABLES ASSIGNMENT

const prodCardButtons = document.querySelectorAll('.product-card-button')
const productWrapper = document.querySelector('.product-wrapper')

const errorNotification = document.querySelector('.error-notification')
const errorNotificationText = document.querySelector('.error-notification-text')

const successNotification = document.querySelector('.success-notification')
const successNotificationText = document.querySelector('.success-notification-text')

const modalBody = document.querySelector('.modal-body')
const modalFooter = document.querySelector('.modal-footer')

// FUNCTIONS
// Create Product Code

function productCode() {
    const code = String(Math.random().toString(36).substr(2, 6)).toUpperCase()
    return code
}

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
                ev.target.innerHTML = '<i class="fa-solid fa-check"></i>'
                ev.target.disabled = true

                ev.target.offsetParent.children[2].children[0].innerText = 'Fechar'
                ev.target.offsetParent.children[2].children[0].addEventListener('click', () => window.location.reload())

                successNotification.style.display = 'block'
                successNotificationText.textContent = 'Compra realizada com sucesso! Código para resgate: ' + productCode()

                localStorage.setItem('user', JSON.stringify({ ...user, tokens: newTokens }))
            }, 500);
        } catch (error) {
            errorNotification.style.display = 'block'
            errorNotificationText.textContent = 'Algo deu errado: ' + error.message
        }
    }, 300);
}

// SET MODAL CONTENT

function setModalContent(ev) {
    let price

    const productId = ev.target.dataset.productId
    modalBody.innerHTML = 'Escolha uma das opções para realizar esta compra!'

    const prodFirstLabel = document.getElementById(`${productId}-first_price`)
    const prodSecondLabel = document.getElementById(`${productId}-second_price`)

    console.log({
        id: productId,
        pf: prodFirstLabel?.checked,
        ps: prodSecondLabel?.checked
    })

    if (prodFirstLabel?.checked) {
        price = prodFirstLabel.dataset.price
    } else if (prodSecondLabel?.checked) {
        price = prodSecondLabel.dataset.price
    } else {
        return modalBody.innerHTML = 'Escolha uma das opções para realizar esta compra!'
    }

    modalBody.innerHTML = `
        <div class='d-flex gap-2'>
            Você irá gastar
            <div class="d-flex gap-1" style="align-items: center;">
                <div class="user-tokens">${price}</div>
                <i class="fa-brands fa-fantasy-flight-games main-stamp"></i>
            </div> selos.
        </div>
    `

    modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" id="close-modal-btn" data-bs-dismiss="modal">Cancelar</button>
        <button onclick="confirmPurchase(event, ${price})" type="button" class="btn btn-primary confirm-purchase-button">Confirmar</button>
    `
}