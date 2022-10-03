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
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../context";

const Register = () => {
	const [loading, setLoading] = useState(false);

	const {
		state: { user },
	} = useContext(Context);

	const router = useRouter();

	const form = useForm({
		initialValues: {
			name: "",
			email: "",
			password: "",
		},

		validate: {
			name: value => (value.trim().length > 3 ? null : "Invalid name"),
			email: value => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
			password: value => (value.trim().length > 6 ? null : "Invalid password"),
		},
	});

	const handleSubmit = async ({ name, email, password }) => {
		setLoading(true);
		try {
			await axios.post("/api/register", {
				name,
				email,
				password,
			});
			router.push("/login");
			toast.success("Registered Successfully!You can now login", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
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
						REGISTER
					</Title>
				</div>
			</BackgroundImage>
			<Center mt={50}>
				<Box sx={{ maxWidth: 500 }} mx='auto'>
					<form onSubmit={form.onSubmit(values => handleSubmit(values))}>
						<TextInput
							withAsterisk
							label='Your Name'
							placeholder='abc'
							{...form.getInputProps("name")}
						/>
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
								Register
							</Button>
						</Group>
					</form>
				</Box>
			</Center>
		</div>
	);
};

export default Register;
