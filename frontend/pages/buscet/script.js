import { deleteData, fetchData } from "../../modules/http"
import { reloadPopular } from "../../modules/ui"
import { logOutFunc } from "../../modules/component"

logOutFunc()

let token = localStorage.getItem("token");


let countArr = []
let priceArr = []
let discountPrice = []
let popular__box = document.querySelector(".popular__box")
let placeBuscet = document.querySelector(".placeBuscet")
let box_add_buscet = document.querySelector(".box_add_buscet")
let email = localStorage.getItem("email")
let title = document.querySelector(".titleBuscet")
let information_main__box = document.querySelector(".information_main__box")

function popular_filter(arr) {
    let popular = arr.filter(item => item.rating == 5)
    reloadPopular(popular.slice(0, 4), popular__box)
}

fetchData("goods")
    .then(res => popular_filter(res))

fetchData(`buscet?token=${token}`)
    .then(res => {
        if (!res[0]) {
            addBuscet(placeBuscet)
        } else {
            elemBuscet(res, box_add_buscet, title)
            information(res, information_main__box)
        }
        localStorage.setItem("userId", res[0].id)
    })


function addBuscet(place) {
    let box__buscet = document.createElement("div")
    let img = document.createElement("img")
    let h2 = document.createElement("h2")
    let p = document.createElement("p")
    let a = document.createElement("a")
    let button = document.createElement("button")

    box__buscet.classList.add("box__buscet")

    img.src = "https://uzum.uz/static/img/shopocat.490a4a1.png"
    h2.textContent = "В корзине пока нет товаров"
    p.textContent = "Начните с подборок на главной странице или найдите нужный товар через поиск"
    a.href = "/"
    button.textContent = "На главную"

    place.append(box__buscet)
    box__buscet.append(img, h2, p, a)
    a.append(button)
}


function elemBuscet(arr, place, title) {
    place.innerHTML = ""

    let h1Buscet = document.createElement("h1")

    h1Buscet.style.padding = "50px 0 20px"

    for (let item of arr) {
        countArr.push(item.countProduct)

        h1Buscet.innerHTML = `<h1 class="h11">Ваша корзина, <span class="countSpan">${countArr.reduce((a, b) => a + b)} товар</span></h1>`

        if (item.itemProduct.salePercentage) {
            let d = (Math.floor(item.itemProduct.price * `0.${item.itemProduct.salePercentage}`))

            let result = item.itemProduct.price - d

            discountPrice.push(result)
        }

    }

    let head = document.querySelector(".headBuscet")

    head.style.visibility = "visible"

    let data = document.querySelector("#dataSpan")



    let dataContent = new Date()

    let options = {
        day: "numeric",
        month: "long"
    }

    data.textContent = dataContent.toLocaleString('ru-RU', options)


    title.append(h1Buscet)

    for (let item of arr) {
        let plus = document.createElement("button")
        let elem_add_buscet = document.createElement("div")
        let input = document.createElement("input")
        let imgProduct = document.createElement("img")
        let name = document.createElement("p")
        let btns = document.createElement("div")
        let minus = document.createElement("button")
        let count = document.createElement("span")
        let column = document.createElement("div")
        let div = document.createElement("div")
        let divTrash = document.createElement("div")
        let buscet_p = document.createElement("p")
        let originalPrice = document.createElement("h3")
        let priceDiscount = document.createElement("h3")


        elem_add_buscet.classList.add("elem_add_buscet")
        input.type = "checkbox"
        input.setAttribute("checked", true)
        input.style.width = "30px"
        imgProduct.classList.add("imgProduct")
        btns.classList.add("btns")
        plus.classList.add("plus")
        minus.classList.add("minus")
        name.style.cursor = "pointer"
        column.classList.add("column")
        originalPrice.classList.add("orig_price")
        place.style.border = "1px solid rgb(211, 211, 211)"
        place.style.borderTop = "none"
        imgProduct.src = item.itemProduct.media[0]
        name.textContent = item.itemProduct.title
        plus.innerHTML = `
        <img src="/public/free-icon-plus-2549959.png" alt="">
        `
        minus.innerHTML = `
        <img src="/public/free-icon-minus-2550003.png" alt="">
        `
        count.textContent = item.countProduct
        divTrash.innerHTML = `
        <svg data-v-1a3a46a8="" width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg" class="ui-icon  filled">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="M9.75 3.5C9.33579 3.5 9 3.83579 9 4.25V5H15V4.25C15 3.83579 14.6642 3.5 14.25 3.5H9.75ZM7.5 4.25V5H3.75C3.33579 5 3 5.33579 3 5.75C3 6.16421 3.33579 6.5 3.75 6.5H4.30005L5.62088 19.9681C5.73386 21.1202 6.70255 21.9985 7.86014 21.9985H16.1399C17.2975 21.9985 18.2661 21.1202 18.3791 19.9681L19.7 6.5H20.25C20.6642 6.5 21 6.16421 21 5.75C21 5.33579 20.6642 5 20.25 5H16.5V4.25C16.5 3.00736 15.4926 2 14.25 2H9.75C8.50736 2 7.5 3.00736 7.5 4.25ZM11 9.75C11 9.33579 10.6642 9 10.25 9C9.83579 9 9.5 9.33579 9.5 9.75V17.25C9.5 17.6642 9.83579 18 10.25 18C10.6642 18 11 17.6642 11 17.25V9.75ZM14.5 9.75C14.5 9.33579 14.1642 9 13.75 9C13.3358 9 13 9.33579 13 9.75V17.25C13 17.6642 13.3358 18 13.75 18C14.1642 18 14.5 17.6642 14.5 17.25V9.75Z"
            fill="black"></path>
    </svg>
        
        `

        name.onclick = () => {
            localStorage.setItem("productID", item.id)
            localStorage.setItem("typeProduct", item.type)
            window.location.href = "/pages/product/"
        }



        let d = (Math.floor(item.itemProduct.price * `0.${item.itemProduct.salePercentage}`))

        let result = item.itemProduct.price - d

        let arr = []
        let arrNotDisc = []

        if (item.itemProduct.salePercentage) {
            arr.push(result)
        } else {
            discountPrice.push(item.itemProduct.price)
        }

        arrNotDisc.push(item.itemProduct.price)

        minus.onclick = () => {
            if (count.textContent > 1) {
                count.textContent = +count.textContent - 1
                if (item.itemProduct.salePercentage) {
                    arr.splice(0, 1)
                    priceDiscount.textContent = arr.reduce((a, b) => a + b) + " сум"
                } else {
                    arrNotDisc.splice(0, 1)
                    priceDiscount.textContent = arrNotDisc.reduce((a, b) => a + b) + " сум"
                }
            }
        }

        plus.onclick = () => {
            if (item.itemProduct.salePercentage) {
                arr.push(result)
                priceDiscount.textContent = arr.reduce((a, b) => a + b) + " сум"
                discountPrice.push(result)
                priceArr.push(result)
            } else {
                arrNotDisc.push(item.itemProduct.price)
                priceDiscount.textContent = arrNotDisc.reduce((a, b) => a + b) + " сум"
                priceArr.push(item.itemProduct.price)
                discountPrice.push(item.itemProduct.price)

            }
            discountPrice.push(item.itemProduct.price)
            count.textContent = +count.textContent + 1
        }

        divTrash.onclick = () => {

            deleteData(`buscet/${item.id}`)
                .then((res) => console.log(res))

            window.location.reload()

        }

        buscet_p.textContent = "Корзина"

        if (item.itemProduct.salePercentage) {
            let newPrice = (Math.floor(item.itemProduct.price * `0.${item.itemProduct.salePercentage}`))

            priceDiscount.textContent = item.itemProduct.price - newPrice + " сум"
        } else {
            priceDiscount.textContent = item.itemProduct.price + " сум"
        }
        originalPrice.textContent = item.itemProduct.price + " сум"

        place.append(elem_add_buscet)
        elem_add_buscet.append(input, imgProduct, name, btns, column)
        btns.append(plus, count, minus)
        column.append(div, priceDiscount, originalPrice)
        div.append(divTrash, buscet_p)
    }
}

function information(data, place) {
    let information__box = document.createElement("div")
    let h2 = document.createElement("h2")
    let goodsAndPrice = document.createElement("div")
    let pCount = document.createElement("p")
    let originalPrice = document.createElement("p")
    let dostavka = document.createElement("div")
    let dostavimTommorow = document.createElement("p")
    let total = document.createElement("div")
    let itog = document.createElement("p")
    let total_price = document.createElement("div")
    let h2Price = document.createElement("h2")
    let pDiscount = document.createElement("p")
    let btn = document.createElement("button")
    let dostavkaDiv = document.createElement("div")

    for (let item of data) {
        priceArr.push(item.itemProduct.price)
        pCount.textContent = `Товары (${countArr.reduce((a, b) => a + b)}):`
    }

    information__box.classList.add("information__box")
    goodsAndPrice.classList.add("goodsAndPrice")
    dostavka.classList.add("dostavka")
    total.classList.add("total")
    total_price.classList.add("total_price")
    pDiscount.classList.add("discount")
    btn.classList.add("btnOformlenie")

    h2.textContent = "Ваш заказ"

    originalPrice.textContent = priceArr.reduce((a, b) => a + b) + " сум"

    let d = new Date()

    let options = {
        day: "numeric",
        month: "long"
    }


    dostavimTommorow.textContent = "Доставим сегодня " + d.toLocaleString('ru-RU', options)
    itog.textContent = "Итого:"
    h2Price.textContent = discountPrice.reduce((a, b) => a + b) + " сум"
    pDiscount.textContent = "Вы экономите: " + (priceArr.reduce((a, b) => a + b) - discountPrice.reduce((a, b) => a + b)) + " сум"
    btn.textContent = "Перейти к оформлению"
    dostavkaDiv.classList.add("dostavkaDiv")
    dostavkaDiv.innerHTML = `
    <div class="div">
    <p>Бесплатно доставим в пункт выдачи или курьером</p>
    <svg width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="ui-icon ">
        <path d="M6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0ZM6 8.5C5.58579 8.5 5.25 8.83579 5.25 9.25C5.25 9.66421 5.58579 10 6 10C6.41421 10 6.75 9.66421 6.75 9.25C6.75 8.83579 6.41421 8.5 6 8.5ZM6 2.5C4.89543 2.5 4 3.39543 4 4.5C4 4.77614 4.22386 5 4.5 5C4.77614 5 5 4.77614 5 4.5C5 3.94772 5.44772 3.5 6 3.5C6.55228 3.5 7 3.94772 7 4.5C7 4.87058 6.91743 5.07932 6.63398 5.39755L6.51804 5.52255L6.25395 5.79209C5.71178 6.36031 5.5 6.76947 5.5 7.5C5.5 7.77614 5.72386 8 6 8C6.27614 8 6.5 7.77614 6.5 7.5C6.5 7.12942 6.58257 6.92068 6.86602 6.60245L6.98196 6.47745L7.24605 6.20791C7.78822 5.63969 8 5.23053 8 4.5C8 3.39543 7.10457 2.5 6 2.5Z" fill="#C2C4CC"></path>
        </svg>
</div>

<div class="priceDostavka">
    <div>
        <p>25 000 сум</p>
        <svg width="14" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="ui-icon ">
            <path d="M6 0C2.97097 0 0.5 2.414 0.5 5.41071C0.5 10 5.09914 14.0012 6 14.0012C6.90086 14.0012 11.5 10.0021 11.5 5.41071C11.5 2.414 9.02903 0 6 0ZM6 7.5C4.89543 7.5 4 6.60457 4 5.5C4 4.39543 4.89543 3.5 6 3.5C7.10457 3.5 8 4.39543 8 5.5C8 6.60457 7.10457 7.5 6 7.5Z" fill="rgb(0, 156, 56)"></path>
            </svg>
    </div>

    <div>
        <p>1000 000 000 сум</p>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="ui-icon ">
            <path d="M6.67217 0.623762C6.86034 0.46005 7.14038 0.460048 7.32855 0.623758L13.83 6.28016C14.0384 6.46141 14.0603 6.77723 13.8791 6.98556C13.6978 7.19389 13.382 7.21585 13.1737 7.0346L12.3348 6.30476V12.1311C12.3348 12.8868 11.7221 13.4995 10.9664 13.4995H9.00008L9.00094 7.85718C9.00094 7.58104 8.77708 7.35718 8.50094 7.35718H5.50029C5.22414 7.35718 5.00029 7.58104 5.00029 7.85718L4.99942 13.4995H3.03444C2.27869 13.4995 1.66602 12.8868 1.66602 12.1311V6.3048L0.827222 7.03459C0.618892 7.21585 0.303071 7.1939 0.121816 6.98557C-0.0594384 6.77724 -0.0374897 6.46142 0.17084 6.28016L6.67217 0.623762Z" fill="rgb(0, 156, 56)"></path>
            </svg>
    </div>
    `

    place.append(information__box, dostavkaDiv)
    information__box.append(h2, goodsAndPrice, dostavka, total, btn)
    goodsAndPrice.append(pCount, originalPrice)
    dostavka.append(dostavimTommorow)
    total.append(itog, total_price)
    total_price.append(h2Price, pDiscount)
}


let searchInp = document.querySelector("#searchInp")


searchInp.onkeyup = debounce((e) => {
    if (e.target.value !== "") {
        fetchData("goods")
            .then(res => processChange(res, e.target.value))
        search_modal.classList.add("active")
        document.body.style.cssText = `overflow: hidden`

    } else {
        search_modal.classList.remove("active")
        document.body.style.cssText = `overflow: visible`
    }
}, 500)


function debounce(func, timeout = 500) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
}

function processChange(data, value) {
    filtered(data, value)
}


let search_modal = document.querySelector(".search_modal")
let search = document.querySelector(".search")
let cross = document.querySelector(".cross")

cross.onclick = () => {
    search_modal.classList.remove("active")
    document.body.style.cssText = `overflow: visible`

}


function filtered(arr, data) {
    let result = arr.filter(item => item.title.toLowerCase().includes(data.trim().toLowerCase()) || item.type.toLowerCase().includes(data.trim().toLowerCase()))
    reloadSearch(result, search)
}

function reloadSearch(arr, place) {
    place.innerHTML = ""
    for (let item of arr) {
        let h1 = document.createElement("h1")

        h1.textContent = item.title
        h1.classList.add("h1Search")

        h1.onclick = () => {
            localStorage.setItem("productID", item.id)
            localStorage.setItem("typeProduct", item.type)
            window.location.pathname = "/pages/product/"
        }

        place.append(h1)
    }
}


let catalogBtn = document.querySelector(".catalogBtn")
let catalog_modal = document.querySelector(".catalog_modal")
let sort__box = document.querySelector(".sort__box")
catalogBtn.onclick = () => {
    document.body.classList.toggle("active_body")
    catalog_modal.classList.toggle("active_modal")
}

let elemCateg = document.querySelectorAll(".elemCateg p")

function sortCatalog(data) {
    elemCateg.forEach(item => {
        item.onclick = (e) => {
            let sort = data.filter(item => item.title.toLowerCase().includes(e.target.innerHTML.toLowerCase(), nameType.textContent = e.target.innerHTML))

            fetchData("goods")
                .then(res => reloadPopular(sort, sort__box))




            document.body.classList.remove("active_body")
            catalog_modal.classList.remove("active_modal")

        }
    })
}

fetchData("goods")
    .then(res => sortCatalog(res))


let signinModal = document.querySelector(".signinModal")
let userName = document.querySelector(".userName")
let crossSvg = document.querySelector("#crossSvg")
userName.onclick = () => {
    if (userName.textContent === "Войти") {
        signinModal.classList.add("active")
        document.body.style.cssText = `overflow: hidden`
    } else {
        window.location.href = "/pages/profile/"
    }
}

crossSvg.onclick = () => {
    signinModal.classList.remove("active")
    document.body.style.cssText = `overflow: visible`
}

let formModal = document.forms.signin

formModal.onsubmit = (e) => {
    e.preventDefault()


    let inp = new FormData(formModal).get("numb")


    fetchData("users")
        .then(res => {
            if (res[0]) {
                if (res[0].phone == inp) {
                    if (!token) {
                        localStorage.setItem("token", res[0].token)
                        localStorage.setItem("username", res[0].name)
                        localStorage.setItem("userId", res[0].id)
                        window.location.reload()
                    }
                } else {
                    alert("Не правильно набран номер или зарегистрируйтесь")
                }
            } else {
                alert("Сначала зарегистрируйтесь")
            }
        })
}

document.querySelector("#signin-modal .modal-signin__content").addEventListener('click', event => {
    event._isClickWithInModal = true;
});
document.getElementById("signin-modal").addEventListener('click', event => {
    if (event._isClickWithInModal) return;
    event.currentTarget.classList.remove('active');
});

function sortSearch(data, value) {
    let sort = data.filter(item => item.title.toLowerCase().includes(value.trim().toLowerCase()))

    fetchData("goods")
        .then(res => reloadPopular(sort, sort__box))
}

let form = document.forms.search

form.onsubmit = (e) => {
    e.preventDefault()

    let inp = new FormData(form).get("inp")

    if (inp !== "") {
        fetchData("goods")
            .then(res => sortSearch(res, inp))

        nameType.textContent = `Товары по вашим запросам: ${inp}`
        search_modal.classList.remove("active")
        document.body.style.cssText = `overflow: visible`


    }
}