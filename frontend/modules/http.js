import axios from "axios";

let BASE_URL = "http://localhost:3001/"

export async function fetchData(path) {
	try {
		let res = await axios.get(BASE_URL + path)

		return res.data
	} catch (error) {
		throw error;
	}
}


export async function postData(path, body) {

	try {
		let res = await axios.post(BASE_URL + path, body);

		return res.data;
	} catch (error) {
		throw error
	}
}

export async function deleteData(path) {
	try {
		let res = await axios.delete(BASE_URL + path)

		return res.data
	} catch (error) {
		throw error
	}
}

export async function patchData(path, body) {
	try {
		let res = await axios.patch(BASE_URL + path, body)

		return res.data
	} catch (error) {
		throw error
	}
}