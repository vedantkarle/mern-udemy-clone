import {
	BackgroundImage,
	Box,
	Button,
	Center,
	Group,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../context";

const ForgotPassword = () => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const { state, dispatch } = useContext(Context);

	const { user } = state;

	const router = useRouter();

	const form = useForm({
		initialValues: {
			email: "",
		},

		validate: {
			email: value => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
		},
	});

	const handleSubmit = async ({ email }) => {
		setLoading(true);
		try {
			const { data } = await axios.post("/api/forgot-password", { email });
			setSuccess(true);
			toast.success("Check your email for the reset code", {
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
		if (user) router.push("/");
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
						FORGOT PASSWORD
					</Title>
				</div>
			</BackgroundImage>
			<Center mt={50}>
				<Box sx={{ maxWidth: 500 }} mx='auto'>
					<form onSubmit={form.onSubmit(values => handleSubmit(values))}>
						<TextInput
							withAsterisk
							label='Your Email'
							placeholder='email@example.com'
							{...form.getInputProps("email")}
						/>
						<Group position='right' mt='md'>
							<Button loading={loading} type='submit' fullWidth>
								Submit
							</Button>
						</Group>
					</form>
				</Box>
			</Center>
		</div>
	);
};

export default ForgotPassword;
