// VARIABLES ASSIGNMENT

const prodCardButtons = document.querySelectorAll('.product-card-button')
const productWrapper = document.querySelector('.product-wrapper')

const errorNotification = document.querySelector('.error-notification')
const errorNotificationText = document.querySelector('.error-notification-text')

const successNotification = document.querySelector('.success-notification')
const successNotificationText = document.querySelector('.success-notification-text')

const modalBody = document.querySelector('.modal-body')
const modalFooter = document.querySelector('.modal-footer')

const userData = JSON.parse(localStorage.getItem('user'))

// FUNCTIONS

/**
 * Generate a random product code.
 * @returns {string} The randomly generated product code.
 */
function productCode() {
    // Generate a random alphanumeric string and convert it to uppercase
    const code = String(Math.random().toString(36).substring(2, 6)).toUpperCase();
    return code;
}

/**
 * Asynchronously confirms a purchase, updating the UI and making the necessary API calls
 * @param {Event} ev - The event that triggered the purchase confirmation
 * @param {number} price - The price of the product being purchased
 */
async function confirmPurchase(ev, price) {
    // Update the button to show a spinner
    ev.target.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>'

    // Delay the purchase confirmation to allow the spinner to be shown
    setTimeout(async () => {
        // Check if the user has enough tokens to make the purchase
        if (userData.tokens < price) {
            // Revert the button text
            ev.target.innerHTML = 'Confirmar'

            // Display an error notification
            errorNotification.style.display = 'block'
            errorNotificationText.textContent = 'Você não possui selos suficientes para realizar esta compra!'

            // Hide the error notification when the user clicks outside of it
            setTimeout(() => {
                window.addEventListener('click', () => {
                    errorNotification.style.display = 'none'
                })
            }, 200);

            return
        }

        try {
            // Calculate the new token balance after the purchase
            const newTokens = userData.tokens - price

            // Make a PATCH request to update the user's token balance
            const response = await fetch('/api/user/' + userData.id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tokens: newTokens
                })
            }).then(res => res.json())

            // Handle any error response from the API
            if (response.error) {
                errorNotification.style.display = 'block'
                errorNotificationText.textContent = 'Algo deu errado, tente novamente!'
                return
            }
            
            // Update the UI to show the purchase was successful
            setTimeout(() => {
                ev.target.innerHTML = '<i class="fa-solid fa-check"></i>'
                ev.target.disabled = true

                // Add an event listener to the close button
                ev.target.offsetParent.children[2].children[0].innerText = 'Fechar'
                ev.target.offsetParent.children[2].children[0].addEventListener('click', () => window.location.reload())

                // Display a success notification with the product code for redemption
                successNotification.style.display = 'block'
                successNotificationText.textContent = 'Compra realizada com sucesso! Código para resgate: ' + productCode()

                // Update the local storage with the new token balance
                localStorage.setItem('user', JSON.stringify({ ...userData, tokens: newTokens }))
            }, 500);
        } catch (error) {
            // Display an error notification for any unexpected errors
            errorNotification.style.display = 'block'
            errorNotificationText.textContent = 'Algo deu errado: ' + error.message
        }
    }, 300);
}

// SET MODAL CONTENT

/**
 * Sets the content of the modal based on the selected product and its prices
 * @param {Event} ev - The event object
 */
async function setModalContent(ev) {
    // Retrieve the product ID from the clicked element's data attribute
    const productId = ev.target.dataset.productId

    console.log(ev);

    // Set the initial modal body content
    modalBody.innerHTML = 'Escolha uma das opções para realizar esta compra!'

    // Retrieve the first and second price labels for the product
    const prodFirstLabel = document.getElementById(`${productId}-first_price`)
    const prodSecondLabel = document.getElementById(`${productId}-second_price`)

    // Determine the price based on the checked status of the price labels
    let price
    if (prodFirstLabel?.checked) {
        price = prodFirstLabel.dataset.price
    } else if (prodSecondLabel?.checked) {
        price = prodSecondLabel.dataset.price
    } else {
        // If no option is selected, display a message and exit the function
        return modalBody.innerHTML = 'Escolha uma das opções para realizar esta compra!'
    }

    const { img: productImg } = await fetch('/api/product/' + productId).then(async res => await res.json())

    // Update the modal body with the selected price
    modalBody.innerHTML = `
        <div class='d-flex gap-2'>
            Você irá gastar
            <div class="d-flex gap-1" style="align-items: center;">
                <div class="user-tokens">${price}</div>
                <i class="fa-brands fa-fantasy-flight-games main-stamp"></i>
            </div> selos.
        </div>
    `

    modalBody.insertAdjacentHTML('beforeend', `
        <div class="product-img-purchase-wrapper">
            <img class="product-img-purchase" src="${productImg}" alt="Product image"/>
        </div>
    `)

    // Update the modal footer with buttons for cancel and purchase confirmation
    modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" id="close-modal-btn" data-bs-dismiss="modal">Cancelar</button>
        <button onclick="confirmPurchase(event, ${price})" type="button" class="btn btn-primary confirm-purchase-button">Confirmar</button>
    `
}
