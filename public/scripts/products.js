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
    const closeModalBtn = document.getElementById('#close-modal-btn')

    modalBody.innerHTML = 'Escolha uma das opções para realizar esta compra!'
    
    const productId = ev.target.dataset.productId

    const prodFirstPriceCheckbox = document.getElementById(`${productId}-first_price`).checked
    const prodFirstPrice = document.getElementById(`${productId}-first_price`).dataset.price

    const prodSecondPriceCheckbox = document.getElementById(`${productId}-second_price`).checked
    const prodSecondPrice = document.getElementById(`${productId}-second_price`).dataset.price

    const checked = {
        first_price: prodFirstPriceCheckbox,
        second_price: prodSecondPriceCheckbox
    }

    for (const item in checked) {
        const discountPrice = item === 'first_price' ? prodFirstPrice : prodSecondPrice

        if (checked[item]) {
            modalBody.innerHTML = `
                <div class='d-flex gap-2'>
                    Você irá perder
                    <div class="d-flex gap-1" style="align-items: center;">
                        <div class="user-tokens">${discountPrice}</div>
                        <i class="fa-brands fa-fantasy-flight-games main-stamp"></i>
                    </div> selos.
                </div>
            `

            modalFooter.innerHTML = `
                <button type="button" class="btn btn-secondary" id="close-modal-btn" data-bs-dismiss="modal">Cancelar</button>
                <button onclick="confirmPurchase(event, ${discountPrice})" type="button" class="btn btn-primary confirm-purchase-button">Confirmar</button>
            `

            break
        } else {
            modalBody.innerHTML = 'Escolha uma das opções para realizar esta compra!'
        }
    }
}

// GENERATE PRODUCT CARDS

(async function generateProducts() {
    const products = await fetch('/api/product').then(res => res.json())

    const calculateDiscount = (price, discount) => {
        return (price - (price * (discount / 100))).toFixed(2)
    }

    const replaceComma = (str) => {
        return String(str).replace('.', ',')
    }

    const productCards = products.map((product, index) => {
        const { 
            name,
            price,
            first_discountTokenValue,
            first_discountValue,
            second_discountTokenValue,
            second_discountValue,
            img,
            id 
        } = product

        const discounts = [
            {
                tokenValue: first_discountTokenValue,
                value: first_discountValue
            },
            {
                tokenValue: second_discountTokenValue,
                value: second_discountValue
            }
        ]

        const discountPrices = [
            replaceComma(calculateDiscount(price, discounts[0].value)),
            replaceComma(calculateDiscount(price, discounts[1].value))
        ]

        return `
            <div class="product-card-wrapper">
                <div class="product-card-header">${name}</div>
                <div class="product-card-body">
                    <div class="product-card-image-wrapper">
                        <img class="product-card-image" src="${img}" alt=${name} />
                    </div>
                    <div class="product-card-description">
                        <div style="color: #FFFC; font-size: 1.1rem;">Preço de venda: R$${replaceComma(price)}</div>

                        <div class="divider"></div>

                        <div class="form-check product-form-check">
                            <input class="form-check-input" name="price" type="radio" data-price="${discounts[0].tokenValue}" class='product-checkbox-price' id="${id}-first_price" />
                            <label class="form-check-label product-form-check-label" for="${id}-first_price">
                                <div class="d-flex gap-2" style="align-items: center;">
                                    <div class="product-bold-text">${discounts[0].tokenValue}</div>
                                    <i class="fa-brands fa-fantasy-flight-games main-stamp"></i>
                                </div>
                            </label>
                            <label class="form-check-label product-form-check-label" for="${id}-first_price">
                                <div class="d-flex" style="align-items: center; flex-direction: column;">
                                    <div class="product-bold-text">R$${discountPrices[0]}</div>
                                    <div class="product-subtitle-text">${discounts[0].value}% de desconto</div>
                                </div>
                            </label>
                        </div>

                        <div class="form-check product-form-check">
                            <input type="radio" class="form-check-input" name="price" data-price="${discounts[1].tokenValue}" class='product-checkbox-price' id="${id}-second_price" />
                            <label class="form-check-label product-form-check-label" for="${id}-second_price">
                                <div class="d-flex gap-2" style="align-items: center;">
                                    <div class="product-bold-text">${discounts[1].tokenValue}</div>
                                    <i class="fa-brands fa-fantasy-flight-games main-stamp"></i>
                                </div>
                            </label>
                            <label class="form-check-label product-form-check-label" for="${id}-second_price">
                                <div class="d-flex" style="align-items: center; flex-direction: column;">
                                    <div class="product-bold-text">R$${discountPrices[1]}</div>
                                    <div class="product-subtitle-text">${discounts[1].value}% de desconto</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="product-card-button btn-primary btn" data-bs-toggle="modal"
                    data-bs-target="#confirmPurchaseModal">
                    <div data-product-id="${id}" onclick="setModalContent(event)" class="product-stamp-price">
                        Adquirir
                    </div>
                </div>
            </div>
        `
    })

    const prodCardsInnerHTMLString = String(productCards).replace(/ ,/g, '')
    productWrapper.innerHTML = prodCardsInnerHTMLString;
})()