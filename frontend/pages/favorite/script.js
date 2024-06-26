import { fetchData } from "../../modules/http"
import { reloadPopularAdded, reloadPopular } from "../../modules/ui"
import { logOutFunc } from "../../modules/component"

logOutFunc()

let token = localStorage.getItem("token");



let myFavorite = document.querySelector(".myFavorite")
let email = localStorage.getItem("email")
let box = document.querySelector(".boxAddFav")
let boxProduct = document.querySelector(".boxProduct")
let popular_box = document.querySelector(".popular__box")
fetchData(`favorite?token=${token}`)
    .then(res => {
        if (!res[0]) {
            reloadAddFavorite(box)
        } else {
            myFavorite.textContent = "Мои желания"
            reloadPopularAdded(res, boxProduct)
        }
        localStorage.setItem("userId", res[0].id)
    })


function reloadAddFavorite(place) {
    let add_favorite = document.createElement("div")
    let img = document.createElement("img")
    let h2 = document.createElement("h2")
    let p = document.createElement("p")

    add_favorite.classList.add("addFavorite")
    img.src = "https://uzum.uz/static/img/hearts.cf414be.png"
    h2.textContent = "Добавьте то, что понравилось"
    p.textContent = "Нажмите на ♡ в товаре. Войдите в аккаунт и всё избранное сохранится"

    place.append(add_favorite)
    add_favorite.append(img, h2, p)
}

fetchData("goods")
    .then(res => popular_filter(res))

function popular_filter(arr) {
    let popular = arr.filter(item => item.rating == 5)

    reloadPopular(popular.slice(0, 4), popular_box)
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
catalogBtn.onclick = () => {
    document.body.classList.toggle("active_body")
    catalog_modal.classList.toggle("active_modal")
}

let sort__box = document.querySelector(".sort__box")

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