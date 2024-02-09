// VARIABLES ASSIGNMENT

const user = JSON.parse(localStorage.getItem('user'))

const errorNotification = document.querySelector('.error-notification')
const errorNotificationText = document.querySelector('.error-notification-text')

const successNotification = document.querySelector('.success-notification')
const successNotificationText = document.querySelector('.success-notification-text')

const stampQuantity = document.querySelector('.stamp-quantity')
stampQuantity.innerHTML = user.tokens

function setModalContent(type) {
    const modalLabel = document.querySelector('#actionModalLabel')
    const modalFormLabel = document.querySelector('.modal-form-label')
    const transferToDiv = document.querySelector('#transferTo')
    const modalBody = document.querySelector('.modal-body')
    const modalFooter = document.querySelector('.modal-footer')
    const actionModalInput = document.querySelector('#actionModalInput')

    if (type === 'transfer') {
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
        modalLabel.innerHTML = 'Depositar selos'
        modalFormLabel.innerHTML = 'Depositar (Quantidade):'
        transferToDiv.innerHTML = ''
    }

    modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" id="close-modal-btn" data-bs-dismiss="modal">Cancelar</button>
        <button onclick="confirmAction(event, '${type}')" type="button" class="btn btn-primary confirm-purchase-button">Confirmar</button>
    `
}

async function confirmAction(ev, type) {
    const amountTo = Number(document.querySelector('#actionModalInput').value)
    
    ev.target.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>'

    try {
        if (type === 'transfer') {
            const userToTransferId = document.querySelector('#actionModalInputUser').value

            const response = await fetch('/api/user/transfer/' + userToTransferId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: user.id, amountToTransfer: amountTo })
            }).then(res => res.json())

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
            await fetch('/api/user/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: user.id, amountToDeposit: amountTo })
            })
    
            setTimeout(() => {
                location.reload()
            }, 500);
        }
    } catch (error) {
        ev.target.innerHTML = 'Confirmar'

        errorNotification.style.display = 'block'
        errorNotificationText.textContent = 'Algo deu errado: ' + error.message
    }
}