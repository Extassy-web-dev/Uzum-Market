import { fetchData, patchData } from "../../modules/http"
import { reloadPopular } from "../../modules/ui"
import { logOutFunc } from "../../modules/component"

logOutFunc()

let searchInp = document.querySelector("#searchInp")

let token = localStorage.getItem("token")

if (!token) {
    window.location = "/"
}

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

let username = document.querySelector(".user-Name")

fetchData("users?token" + token)
    .then(res => {
        username.textContent = res[0].name
        reloadValueInp(res[0])
    })

let patchForm = document.forms.patch
let id = localStorage.getItem("userId")
let init = ""
let btnsgender = document.querySelectorAll(".btnsgender p")

btnsgender.forEach(btn => {
    btn.onclick = () => {
        btn.classList.add("activebtn")
        
        

        btnsgender.forEach(item => item.classList.add("activebtn"))
        
        btn.classList.remove("activebtn")

        init = btn.id

        console.log(init);
    }
})

patchForm.onsubmit = (e) => {
    e.preventDefault()

    let fn = new FormData(patchForm)

    let dataUser = {
        name: fn.get("name"),
        surname: fn.get("surname"),
        patronymic: fn.get('patronymic'),
        email: fn.get("email"),
        phone: fn.get("phone"),
        gender: init,
        birthd: fn.get("birthd")
    }


    patchData(`users/${id}`, dataUser)
        .then(res => console.log(res))
        .catch(err => console.error(err))

}

let loguot = document.querySelector('.log-out')

loguot.onclick = () => {
    localStorage.clear()
    window.location.href = "/pages/signin/"
}

function reloadValueInp(data) {
    let name = document.querySelector(".nameInp")
    let surn = document.querySelector(".surnInp")
    let email = document.querySelector(".emailInp")
    let tel = document.querySelector(".telInp")

    name.setAttribute("value", data.name)
    surn.setAttribute("value", data.surname)
    email.setAttribute("value", data.email)
    tel.setAttribute("value", data.phone)
}