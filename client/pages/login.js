import {
	BackgroundImage,
	Box,
	Button,
	Center,
	Group,
	PasswordInput,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../context";

const Login = () => {
	const [loading, setLoading] = useState(false);

	const { state, dispatch } = useContext(Context);

	const { user } = state;

	const router = useRouter();

	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},

		validate: {
			email: value => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
			password: value => (value.trim().length > 6 ? null : "Invalid password"),
		},
	});

	const handleSubmit = async ({ name, email, password }) => {
		setLoading(true);
		try {
			const { data } = await axios.post("/api/login", {
				email,
				password,
			});

			dispatch({ type: "LOGIN", payload: data });

			window?.localStorage.setItem("user", JSON.stringify(data));

			router.push("/user");
		} catch (error) {
			toast.error(error?.response?.data || error.message, {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
		setLoading(false);
	};

	useEffect(() => {
		if (user !== null) router.push("/");
	}, [user]);

	return (
		<div>
			<BackgroundImage
				sx={{ height: "200px" }}
				src='https://images.unsplash.com/photo-1588420343618-6141b3784bce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80'
				radius={0}>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "200px",
					}}>
					<Title color='#fff' order={1}>
						LOGIN
					</Title>
				</div>
			</BackgroundImage>
			<Center mt={50}>
				<Box sx={{ maxWidth: 500 }} mx='auto'>
					<form onSubmit={form.onSubmit(values => handleSubmit(values))}>
						<TextInput
							withAsterisk
							label='Email'
							placeholder='your@email.com'
							{...form.getInputProps("email")}
						/>
						<PasswordInput
							placeholder='Password'
							label='Password'
							description='Password must include at least one letter, number and special character'
							withAsterisk
							{...form.getInputProps("password")}
						/>

						<Group position='right' mt='md'>
							<Button loading={loading} type='submit' fullWidth>
								Login
							</Button>
						</Group>
					</form>
					<Center mt={10}>
						<Link href='/forgot-password'>
							<span
								style={{
									color: "blue",
									textDecoration: "none",
									cursor: "pointer",
								}}>
								Forgot Password ?
							</span>
						</Link>
					</Center>
				</Box>
			</Center>
		</div>
	);
};

export default Login;
