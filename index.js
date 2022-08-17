const cart = document.querySelector("nav .cart")
const cartSideBar = document.querySelector(".cart-sidebar")
const CloseCart = document.querySelector(".close-cart")
const burger = document.querySelector(".burger")
const menuSideBar = document.querySelector(".menu-sidebar")
const closeMenu = document.querySelector(".close-menu")
const cartItemTotal = document.querySelector(".noi")
const cartPriceTotal = document.querySelector(".Total-amount")
const cartUi = document.querySelector(".cart-sidebar .cart")
const totalDiv = document.querySelector(".total-sum")
const clearBtn = document.querySelector(".clear-cart-btn")
const cartContent = document.querySelector(".cart-content")


let Cart = [];
let buttonsDOM = [];

cart.addEventListener("click", function () {
    cartSideBar.style.transform = "translate(0%)";
    const bodyOverlay = document.createElement("div");
    bodyOverlay.classList.add("overlay");
    setTimeout(function () {
        document.querySelector("body").append(bodyOverlay)
    }, 300)
})
CloseCart.addEventListener("click", function () {
    cartSideBar.style.transform = "translate(100%)"
    const bodyOverlay = document.querySelector(".overlay")
    document.querySelector("body").removeChild(bodyOverlay)
})

burger.addEventListener("click", function () {
    menuSideBar.style.transform = "translate(0%)"
    
})

closeMenu.addEventListener("click", function () {
    menuSideBar.style.transform = "translate(-100%)"
})

class Product {
    async getProduct() {
        const response = await fetch("product.json");
        const data = await response.json();
        let products = data.items;
        products = products.map(item => {
            const {title,price} = item.fileds;
            const { id } = item.sys;
            const image = item.fileds.image.fields.file.url;
            return { title, price, id, image }
        })
        return products;
    }
}

class UI {
    displayProducts(products) {
        let result = "";
        products.forEach(product => {
            const productDiv = document.createElement("div")
            productDiv.innerHTML = `<div class = "product-card">
                                    <img src="${product.image}">
                                    <div class = "product-name">${product.title}</div>
                                    <div class = "product-pricing">${product.price}</div>
                                    <span class = "add-to-cart" style="margin-top:2em; font-size:0.8em;" data-id="${product.id}">
                                    Add to Cart </span> 
                                    </div>`

            const p = document.querySelector(".product")
            p.append(productDiv)
        })
    }


    getButtons() {
        const btns = document.querySelectorAll(".add-to-cart")
        Array.from(btns)
        buttonsDOM = btns;
        btns.forEach((btn) => {
            let id = btn.dataset.id
            let inCart = Cart.find((item) => item.id === id);
            if (inCart) {
                btn.innerHTML = "In cart"
                btn.dissabled = true
            }
            btn.addEventListener("click", (e) => {
                e.currentTarget.innerHTML = "It is in your cart"
                e.currentTarget.style.color = "white"
                e.currentTarget.style.pointerEvents = "none"
                let cartItem = { ...Storage.getStorageProducts(id), 'amount': 1 }
                Cart.push(cartItem)
                Storage.saveCart(Cart)
                this.setCartValues(Cart)
                this.addCartItem(cartItem)
            })
        })
    }

    setCartValues() {
        let tempTotal = 0;
        let itemsTotal = 0;
        Cart.map((item) => {
            tempTotal += (item.price * item.amount);
            itemsTotal += item.amount;
            parseFloat(tempTotal.toFixed(2))
        })

        cartItemTotal.innerHTML = itemsTotal;
        cartPriceTotal.innerHTML = parseFloat(tempTotal.toFixed(2))
    }
    addCartItem(cartItem) {
        let cartItemUi = document.createElement("div")
        cartItemUi.innerHTML = `<div class = "cart-product">
                            <div class = "product-image">
                            <img src = "${cartItem.image}" style="margin:2em; width:5em;" alt="product">
                            </div>
                            <div class = "cart-product-content>
                            <div class = "cart-product-name"><h3>${cartItem.title}</h3>
                            </div>
                            <div class = "cart-product-price"><h3>${cartItem.price}</h3></div>
                            <div class = "plus-minus">
                            <i class = "fa fa-sort-asc add-amount"
                            data-id="${cartItem.id}"></i>
                            <span class="no-of-items>
                            data-id="${cartItem.id}"</i><h3>${cartItem.amount}</h3></span>
                            <i class = "fa fa-sort-desc reduce-amount"
                            data-id="${cartItem.id}"></i>
                            </div>
                            <div class = "cart-product-remove data-id="${cartItem.id}"
                            href = "#" style = "color:red;">remove</a></div>
                            </div>
                            </div>`
        cartContent.append(cartItemUi)

    }
    setupApp() {
        Cart = Storage.getCart()
        this.setCartValues(cart)
        Cart.map((item) => {
            this.addCartItem(item)
        })
    }
    cartLogic() {
        clearBtn.addEventListener("click", () => {
            this.CloseCart()
        })
        cartContent.addEventListener("click", (e) => {
            if (e.target.classList.contains(".cart-product-remove")) {
                let id = e.target.dataset.id
                this.removeItem(id)
                let div = e.target.parentElement.parentElement.parentElement.parentElement
                div.removeChild(e.target.parentElement.parentElement.parentElement.parentElement)
            } else if (e.target.contains(".add-amount")) {
                let id = e.target.dataset.id
                let item = Cart.find((item) => item.id === id)
                item.amount++
                Storage.saveCart(cart)
                this.setCartValues(cart)
                e.target.nextElementSibling.innerHTML = item.amount
            } else if (e.target.classList.contains(".reduce-amount")) {
                let id = e.target.dataset.id
                let item = Cart.find((item) => item.id === id)
                if (item.amount > 1) {
                    item.amount--
                    Storage.saveCart(Cart)
                    this.setCartValues(Cart)
                    e.target.previousElementSibling.innerHTML = item.amount
                } else {
                    this.removeItem(id)
                    let div = e.target.parentElement.parentElement.parentElement.parentElement
                    div.removeChild(e.target.parentElement.parentElement.parentElement.parentElement)

                }
            }
        })
    }

    addAmount() {
        const addBtn = document.querySelectorAll(".add-amount")
        addBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                let id = (e.currentTarget.dataset.id)
                Cart.map((item) => {
                    if (item.id === id) {
                        item.amount++
                        Storage.saveCart(Cart)
                        this.setCartValues(Cart)
                        const amountUi = e.currentTarget.parentElement.children[1]
                        amountUi.innerHTML = item.amount
                    }
                })
            })
        })
    }
    reduceAmount() {
        const reduceBtn = document.querySelectorAll(".reduce-amount")
        reduceBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                let id = (e.currentTarget.dataset.id)
                Cart.map((item) => {
                    if (item.id === id) {
                        item.amount--
                        if (item.amount > 0) {
                            Storage.saveCart(Cart)
                            this.setCartValues(Cart)
                            const amountUi = e.currentTarget.parentElement.children[1]
                            amountUi.innerHTML = item.amount
                        } else {
                            e.currentTarget.parentElement.parentElement.parentElement.removeChild(e)
                            this.removeItem(id)
                        }
                    }
                })
            })
        })
    }
    clearCart() {
        let cartItem = Cart.map(item => item.id)
        cartItem.forEach((id) => this.removeItem(id))
        const cartProduct = document.querySelectorAll(".cart-product")
        cartProduct.forEach((item) => {
            if (item) {
                item.parentElement.removeChild(item)
            }
        })
    }
    removeItem(id){
        Cart = Cart.filter((item) => item.id !== id)
        this.setCartValues(Cart)
        Storage.saveCart(Cart)
        let button = this.getSingleButton(id)
        button.style.pointerEvents = "unset"
        button.innerHTML = `<i class= "fa fa-cart-plus"></i>Add to Cart`
    }

    getSingleButton(){
        let btn;
        buttonsDOM.forEach((button)=>{
            if(button.dataset.id === id){
                btn = button
            }
        })
        return btn
    }
}

class Storage{
    static saveProduct(products){
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getStorageProducts(id){
        let products = JSON.parse(localStorage.getItem('products'))
        return products.find((item)=>item.id===id)
    }
    static saveCart(cart){
        localStorage.setItem(`cart`, JSON.stringify(cart))
    }
    static getCart(){
        return localStorage.getItem('Cart')?JSON.parse(localStorage.getItem("Cart")):[]
    }
}
document.addEventListener("DOMContentLoaded", ()=>{
    const products = new Product();
    const ui = new UI();
    ui.setupApp()
    products.getProduct().then(products=>{
        ui.displayProducts(products)
        Storage.saveProduct(products)
    }).then(()=>{
        ui.getButtons();
        ui.cartLogic();
    })
})