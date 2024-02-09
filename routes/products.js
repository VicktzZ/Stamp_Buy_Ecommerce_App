const router = require('express').Router()
const db = require('../services/database')

// PRODUCTS ROUTES

router.get('/', async (req, res) => {
    try {
        const [ products ] = await db.query('SELECT * FROM products')
        
        // RENDER PRODUCTS FUNCTION

        const calculateDiscount = (price, discount) => {
            return (price - (price * (discount / 100))).toFixed(2)
        }
    
        const replaceComma = (str) => {
            return String(str).replace('.', ',')
        }
    
        const productCards = products.map((product) => {
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
                                <input onclick="this.checked = true" class="form-check-input" name="price" type="radio" data-price="${discounts[0].tokenValue}" class='product-checkbox-price' id="${id}-first_price" />
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
                                <input onclick="this.checked = true" type="radio" class="form-check-input" name="price" data-price="${discounts[1].tokenValue}" class='product-checkbox-price' id="${id}-second_price" />
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
                    <div data-product-id="${id}" onclick="setModalContent(event)" class="product-card-button btn-primary btn" data-bs-toggle="modal"
                        data-bs-target="#confirmPurchaseModal">
                        <div class="product-stamp-price">
                            Adquirir
                        </div>
                    </div>
                </div>
            `
        })

        // Sending HTML Product Cards
    
        const prodCardsHTMLString = String(productCards).replace(/ ,/g, '')

        res.send(prodCardsHTMLString)
    } catch (error) {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { name, price, img, discounts } = req.body

        const result = await db.query(`
            INSERT INTO products (
                name,
                price,
                img,
                first_discountTokenValue,
                first_discountValue,
                second_discountTokenValue,
                second_discountValue
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        [ 
            name,
            price,
            img,
            discounts[0].tokenValue,
            discounts[0].value,
            discounts[1].tokenValue,
            discounts[1].value 
        ])

        res.status(200).json({ result, message: 'SUCCESS' })
    } catch {
        res.status(400).json({ message: 'BAD REQUEST', error: error.message })
    }
})

module.exports = router