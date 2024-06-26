import Swiper from "swiper";
import { fetchData } from "./modules/http.js";
import { reloadPopular } from "./modules/ui.js";

var swiper = new Swiper('.swiper', {

    loop: true,

    scrollbar: {
        el: '.swiper-scrollbar',
    },

    autoplay: {
        delay: 1000
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});


let token = localStorage.getItem("token");

if (token) {
    fetchData("users?token=" + token)
        .then((res) => {
            reloadUser(res[0])
            localStorage.setItem("userId", res[0].id)
        })
        .catch((error) => console.log(error));


}

let logout = document.querySelector(".logout")

logout.onclick = () => {
    localStorage.clear()
    window.location.reload()
}


function reloadUser(data) {
    let userName = document.querySelector(".userName")
    
    userName.textContent = data.name
}



let popular__box = document.querySelector(".popular__box")
let pc__box = document.querySelector(".pc__box")
let audio__box = document.querySelector(".audio__box")
let tv__box = document.querySelector(".tv__box")
let kitchen__box = document.querySelector(".kitchen__box")
let showMore = document.querySelector(".show")

fetchData("goods?type=PC")
    .then(res => reloadPopular(res.slice(0, 5), pc__box))
fetchData("goods?type=audio")
    .then(res => reloadPopular(res.slice(0, 5), audio__box))
fetchData("goods?type=TV")
    .then(res => reloadPopular(res.slice(0, 5), tv__box))
fetchData("goods?type=kitchen")
    .then(res => reloadPopular(res.slice(0, 5), kitchen__box))


let sort__box = document.querySelector(".sort__box")
let sort = document.querySelectorAll(".sort p")
let init = ""

let nameType = document.querySelector("#nameType")
sort.forEach(p => {
    p.onclick = (e) => {
        init = e.target.id


        if (init === "") {

            nameType.textContent = "All"
        }

        nameType.textContent = e.target.innerHTML
        sortFetchData(init)
    }
})


function sortFetchData(init) {
    fetchData(`goods?type=${init}`)
        .then(res => reloadPopular(res, sort__box))
}

let catalogBtn = document.querySelector(".catalogBtn")
let catalog_modal = document.querySelector(".catalog_modal")
catalogBtn.onclick = () => {
    document.body.classList.toggle("active_body")
    catalog_modal.classList.toggle("active_modal")
}






fetchData("goods")
    .then(res => popular_filter(res))

function popular_filter(arr) {
    let popular = arr.filter(item => item.rating >= 5)
    let items = 5
    reloadPopular(popular.slice(0, 5), popular__box)

    showMore.onclick = () => {
        items += 5
        fetchData(`goods`)
            .then(res => {

                if (popular.length < items) {
                    showMore.style.display = "none"
                }
                reloadPopular(popular.slice(0, items), popular__box)
            })
    }
}


let friday__box = document.querySelector(".friday__box")

fetchData("goods")
    .then(res => blackFridayFilter(res))

function blackFridayFilter(arr) {
    let black_friday = arr.filter(item => item.isBlackFriday)

    reloadPopular(black_friday, friday__box)
}

let percentage__box = document.querySelector(".percentage__box")

fetchData("goods")
    .then(res => percentageFilter(res))

function percentageFilter(arr) {
    let percentage = arr.filter(item => item.salePercentage >= 50)

    reloadPopular(percentage, percentage__box)
}

let price__box = document.querySelector(".price__box")


fetchData("goods")
    .then(res => priceLess(res))

function priceLess(arr) {
    let price = arr.filter(item => item.price <= 10000)

    reloadPopular(price, price__box)
}

let game_box = document.querySelector(".game__box")

fetchData("goods")
    .then(res => gameFilter(res))

function gameFilter(arr) {
    let game = arr.filter(item => item.title.toLowerCase().includes("игр"))

    reloadPopular(game.slice(0, 5), game_box)

    let btnGamers = document.querySelector("#BtnGamers")

    let items1 = 5

    btnGamers.onclick = () => {
        items1 += 5

        if (game.length < items1) {
            btnGamers.style.display = "none"
        }

        reloadPopular(game.slice(0, items1), game_box)

    }
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