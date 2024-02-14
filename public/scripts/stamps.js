// VARIABLES ASSIGNMENT

const userData = JSON.parse(localStorage.getItem('user'))

const errorNotification = document.querySelector('.error-notification')
const errorNotificationText = document.querySelector('.error-notification-text')

const successNotification = document.querySelector('.success-notification')
const successNotificationText = document.querySelector('.success-notification-text')

const stampQuantity = document.querySelector('.stamp-quantity')

// Set user stamps quantity
stampQuantity.innerHTML = userData.tokens

// FUNCTIONS

/**
 * Set the content of the modal based on the type provided
 * @param {'transfer' | 'deposit'} type - The type of action to set the modal for (e.g. 'transfer', 'deposit')
 */
function setModalContent(type) {
    // Select modal elements
    const modalLabel = document.querySelector('#actionModalLabel')
    const modalFormLabel = document.querySelector('.modal-form-label')
    const transferToDiv = document.querySelector('#transferTo')
    const modalBody = document.querySelector('.modal-body')
    const modalFooter = document.querySelector('.modal-footer')
    const actionModalInput = document.querySelector('#actionModalInput')

    // Set modal content based on type
    if (type === 'transfer') {
        // Set modal content for transfer
        modalLabel.innerHTML = 'Transferir selos'
        modalFormLabel.innerHTML = 'Transferir (Quantidade):'
        transferToDiv.innerHTML = `
            <label for="actionModalInputUser" class="form-label modal-form-label">Para (id):</label>
            <input
                type="text"
                class="form-control"
                name="action"
                id="actionModalInputUser"
                aria-describedby="helpId"
                placeholder="EX: 4"
            />
        `
    } else {
        // Set modal content for deposit
        modalLabel.innerHTML = 'Depositar selos'
        modalFormLabel.innerHTML = 'Depositar (Quantidade):'
        transferToDiv.innerHTML = ''
    }

    // Set modal footer buttons
    modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" id="close-modal-btn" data-bs-dismiss="modal">Cancelar</button>
        <button onclick="confirmAction(event, '${type}')" type="button" class="btn btn-primary confirm-purchase-button">Confirmar</button>
    `
}

/**
 * Handles the confirmation of an action based on the type provided
 * @param {Event} ev - The event object
 * @param {'transfer' | 'deposit'} type - The type of action (e.g. 'transfer', 'deposit')
 */
async function confirmAction(ev, type) {
    // Get the amount to transfer or deposit from the input field
    const amountTo = Number(document.querySelector('#actionModalInput').value)
    
    // Show spinner while processing the action
    ev.target.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>'

    try {
        if (type === 'transfer') {
            // Get the ID of the user to transfer to
            const userToTransferId = document.querySelector('#actionModalInputUser').value

            // Send a request to transfer the amount to the specified user
            const response = await fetch('/api/user/transfer/' + userToTransferId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userData.id, amountToTransfer: amountTo })
            }).then(res => res.json())

            // Set a timeout to handle the response
            setTimeout(() => {
                if (response.error) {
                    ev.target.innerHTML = 'Confirmar'

                    errorNotification.style.display = 'block'
                    errorNotificationText.textContent = response.message
                } else {
                    ev.target.innerHTML = '<i class="fa-solid fa-check"></i>'
                    ev.target.disabled = true

                    successNotification.style.display = 'block'
                    successNotificationText.textContent = 'Transferência realizada com sucesso!'

                    ev.target.offsetParent.children[2].children[0].innerText = 'Fechar'
                    window.addEventListener('click', () => window.location.reload())
                }

            }, 500)

        } else {
            // Send a request to deposit the amount
            await fetch('/api/user/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userData.id, amountToDeposit: amountTo })
            })
    
            // Set a timeout to reload the page after deposit
            setTimeout(() => {
                location.reload()
            }, 500);
        }
    } catch (error) {
        // Handle any errors that occur during the action
        ev.target.innerHTML = 'Confirmar'

        errorNotification.style.display = 'block'
        errorNotificationText.textContent = 'Algo deu errado: ' + error.message
    }
}
