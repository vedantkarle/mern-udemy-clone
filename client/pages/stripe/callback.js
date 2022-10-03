import { Center, Loader } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { Context } from "../../context";

const Callback = () => {
	const {
		state: { user },
		dispatch,
	} = useContext(Context);

	const router = useRouter();

	useEffect(() => {
		if (user) {
			axios
				.post("/api/get-account-status")
				.then(res => {
					dispatch({ type: "LOGIN", payload: res.data });
					window.localStorage.setItem("user", JSON.stringify(res.data));
					router.push("/instructor");
				})
				.catch(e => {
					console.error(e);
				});
		}
	}, [user]);

	return (
		<Center>
			<Loader size='xl' />
		</Center>
	);
};

export default Callback;
