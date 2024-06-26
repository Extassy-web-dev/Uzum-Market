import { reloadPopular } from "../../modules/ui"
import { fetchData, postData } from "../../modules/http"
import { logOutFunc } from "../../modules/component"


logOutFunc()

let token = localStorage.getItem("token");


let productID = localStorage.getItem("productID")



let type = localStorage.getItem("typeProduct")
fetchData(`goods?id=${productID}`)
    .then((res) => reloadProduct(res[0], column, colors, placeDiagonal))

let placeDiagonal = document.querySelector(".diogonals")
let column = document.querySelector(".column")
let colors = document.querySelector(".colors")

let svg = document.querySelector("#svgLike")

svg.onclick = () => {
    svg.innerHTML = `
     <svg data-v-ff0a7354="" width="20" height="20" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg" alt="like" class="ui-icon ">
<path d="M5.45 0.169434C8.01792 0.169434 9.5 2.32178 9.5 2.32178C9.5 2.32178 10.985 0.169434 13.55 0.169434C16.205 0.169434 18.5 2.23943 18.5 5.11943C18.5 9.34995 12.0604 13.7892 9.86509 15.7297C9.65819 15.9126 9.34179 15.9126 9.13488 15.7297C6.94056 13.7903 0.5 9.34976 0.5 5.11943C0.5 2.23943 2.795 0.169434 5.45 0.169434Z" fill="#8967F0"></path>
</svg>
    `
}
let price_w_p = document.querySelector(".priceP")

function reloadProduct(data, place, colorPlace, placeDiagonal) {
    let title = document.querySelector("title")
    let rating = document.querySelector("#rating")
    let name = document.querySelector(".name")
    let price = document.querySelector(".originalPrice")
    let opisanie = document.querySelector(".opisanieP")
    let poster = document.querySelector(".poster")
    let category = document.querySelector(".category")
    let arrPrice = []

    arrPrice.push(data.price)

    localStorage.setItem("userId", data[0].id)

    if (data.salePercentage) {
        let newPrice = (Math.floor(data.price * `0.${data.salePercentage}`))
        price_w_p.textContent = data.price - newPrice + " сум"
    } else {
        price_w_p.textContent = data.price + " сум"
    }
    category.textContent = data.type
    title.innerHTML = data.title
    rating.textContent = data.rating
    name.textContent = data.title
    poster.src = data.media[0]
    price.textContent = data.price + " сум"

    if (data.description) {
        opisanie.textContent = data.description
    } else {
        opisanie.style.textAlign = "center"
        opisanie.textContent = "У этого товара нет описания"
    }

    for (let item of data.media) {
        let columns = document.createElement("img")
        columns.src = item

        columns.onclick = () => {
            poster.src = columns.src
        }

        place.append(columns)
    }


    if (data.colors) {
        for (let color of data.colors) {

            let colorP = document.createElement("p")

            colorP.textContent = color

            if (color === "white") {
                colorP.style.color = "rgb(218, 218, 218)"
            } else {
                colorP.style.color = color
            }

            colorPlace.append(colorP)
        }
    } else {
        colorPlace.innerHTML = "У этого товара нет цветов"
    }

    if (data.dioganal) {
        for (let item of data.dioganal) {
            let dioganalP = document.createElement("p")

            dioganalP.textContent = item
            placeDiagonal.append(dioganalP)
        }

    } else {
        placeDiagonal.textContent = "У этого товара нет размеров"
    }



    plus.onclick = () => {

        amount.textContent = +amount.textContent + 1

        arrPrice.push(data.price)

        let total_price = arrPrice.reduce((a, b) => a + b)

        if (data.salePercentage) {


            let newPrice = (Math.floor(total_price * `0.${data.salePercentage}`))

            price_w_p.textContent = total_price - newPrice + " сум"

        } else {
            price_w_p.textContent = total_price + " сум"
        }



    }



    minus.onclick = () => {
        if (amount.textContent > 1) {

            amount.textContent = +amount.textContent - 1

            arrPrice.splice(arrPrice.indexOf(data.price), 1)

            if (data.salePercentage) {
                let newPrice = (Math.floor(arrPrice.reduce((a, b) => a + b) * `0.${data.salePercentage}`))
                price_w_p.textContent = arrPrice.reduce((a, b) => a + b) - newPrice + " сум"
            } else {
                price_w_p.textContent = arrPrice.reduce((a, b) => a + b) + " сум"
            }


        }


    }

    add_to_izbranoe.onclick = () => {
        let dataItem = {
            itemProduct: data,
            email: data.email,
            id: data.id
        }

        fetchData(`favorite?id=${data.id}`)
            .then(res => {
                if (res.length > 0) {
                    alert("Товар уже добавлен в избранное")

                    return
                } else {
                    postData("favorite", dataItem)
                        .then(res => console.log(res))
                }
            })
    }




    add_to_buscet.onclick = () => {

        let dataItem = {
            itemProduct: data,
            email: data.email,
            countProduct: 1,
            id: data.id
        }
        fetchData(`buscet?id=${data.id}`)
            .then(res => {
                if (res.length > 0) {
                    alert("Товар уже добавлен в корзину")

                    return
                } else {
                    postData("buscet", dataItem)
                        .then(res => console.log(res))
                }
            })
    }

}

let similar = document.querySelector(".similar__box")

fetchData(`goods?type=${type}`)
    .then((res) => reloadPopular(res.slice(0, 5), similar))

let plus = document.querySelector(".plus")
let minus = document.querySelector(".minus")
let amount = document.querySelector(".count")

let add_to_izbranoe = document.querySelector(".add_to_izbranoe")
let add_to_buscet = document.querySelector(".add_to_buscet")

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