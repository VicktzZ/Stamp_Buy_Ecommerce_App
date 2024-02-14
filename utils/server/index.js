/**
 * Calculates the discounted price based on the original price and the discount percentage.
 * @param {number} price - The original price
 * @param {number} discount - The discount percentage
 * @returns {string} - The discounted price as a string with 2 decimal places
*/
const calculateDiscount = (price, discount) => {
    return (price - (price * (discount / 100))).toFixed(2)
}

/**
 * Replaces dots with commas in the given string.
 * 
 * @param {string} str - The input string
 * @returns {string} - The modified string with dots replaced by commas
 */
function replaceComma(str) {
    return String(str).replace('.', ',');
}

/**
 * Generates product cards based on the provided products data.
 * @param {Array<{
    *  name: string,
    *  price: number,
    *  first_discountTokenValue: number,
    *  first_discountValue: number,
    *  second_discountTokenValue: number,
    *  second_discountValue: number,
    *  img: string,
    *  id: number}>} products - The array of product objects.
*  @returns {Array<string>} - The array of generated product card strings.
*/
function generateProductCards(products) {
    // Map the products array to create product card HTML for each product
    const productCards = products.map((product) => {
        // Destructure product object properties
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

        // Create an array of discount objects
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

        // Calculate discounted prices for each discount
        const discountPrices = [
            replaceComma(calculateDiscount(price, discounts[0].value)),
            replaceComma(calculateDiscount(price, discounts[1].value))
        ]
        
        // Generate the HTML for the product card
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
                    <div data-product-id="${id}" class="product-stamp-price">
                        Adquirir
                    </div>
                </div>
            </div>
        `
    })

    return productCards
}

module.exports = { 
    calculateDiscount,
    replaceComma,
    generateProductCards
}
