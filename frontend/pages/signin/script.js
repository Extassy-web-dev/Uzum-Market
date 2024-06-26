import { fetchData } from "../../modules/http"



let form = document.forms.signin

form.onsubmit = (e) => {
    e.preventDefault()

    let fn = new FormData(form)

    let dataUser = {
      
    }
    
    

    fn.forEach((val, key) => dataUser[key] = val)
    
   fetchData("users?email=" + dataUser.email)
   .then(res => {
            if(res[0].password == dataUser.password) {
                localStorage.setItem("token", res[0].token)
                localStorage.setItem("username", res[0].name)
                localStorage.setItem("email", res[0].email)
                localStorage.setItem("userId", res[0].id)
                window.location = "/"
            } else {
                alert("Пароль или эмайл введены не правильно")
            }
        
   }
)}
