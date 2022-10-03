import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useEffect, useReducer } from "react";

const initialState = {
	user: null,
};

const Context = createContext();

const rootReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			return { ...state, user: action.payload };
		case "LOGOUT":
			return { ...state, user: null };
		default:
			return user;
	}
};

const Provider = ({ children }) => {
	const [state, dispatch] = useReducer(rootReducer, initialState);
	const router = useRouter();

	useEffect(() => {
		dispatch({
			type: "LOGIN",
			payload: JSON.parse(window?.localStorage.getItem("user")),
		});
	}, []);

	axios.interceptors.response.use(
		function (response) {
			return response;
		},
		function (error) {
			let res = error.response;
			if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
				return new Promise((resolve, reject) => {
					axios
						.get("/api/logout")
						.then(data => {
							dispatch({ type: "LOGOUT" });
							window?.localStorage.removeItem("user");
							router.push("/login");
						})
						.catch(e => {
							console.log(e);
							reject(e);
						});
				});
			}
			return Promise.reject(error);
		},
	);

	return (
		<Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
	);
};

export { Context, Provider };
