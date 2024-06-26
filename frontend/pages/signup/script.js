import { fetchData, postData } from "../../modules/http";


let form = document.forms[0];
let inps_req = document.querySelectorAll('.request')

inps_req.forEach((inp) => {
	inp.onkeyup = () => {
		if (/^[a-z ,.'-]+$/i.test(inp.value)) {
			inp.style.border = "1px solid black"
			inp.style.outlineColor = "#0047ff"
		} else {
			inp.style.border = "1px solid red"
			inp.style.outlineColor = "red"
		}
	}
})

form.onsubmit = (e) => {
	e.preventDefault();

	let token = generateToken();
	let fn = new FormData(form);

	let user = {
		name: fn.get("name"),
		surname: fn.get("surname"),
		email: fn.get("email"),
		password: fn.get("password"),
		phone: fn.get("phone"),
		token: token,
		gender: "",
		birthd: "",
		patronymic: ""
	};


	fetchData("users?email=" + user.email)
		.then((res) => {
			if (res.length > 0) {
				alert("Account already exists");
				return;
			}


			postData("users", user)
				.then((res) => {
					localStorage.setItem("token", token);
					localStorage.setItem("username", user.name);
					window.location.pathname = "/";

				})
				.catch((error) => console.error(error));
		})
		.catch((error) => console.error(error));
};

function generateToken() {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	let token = "";

	for (let i = 0; i < 10; i++) {
		let rnd = Math.floor(Math.random() * characters.length);

		token += characters[rnd];
	}

	return token;
}
