import { BackgroundImage, Button, Center, Text, Title } from "@mantine/core";
import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { UserPlus } from "tabler-icons-react";
import { Context } from "../../context";

const BecomeInstructor = () => {
	const [loading, setLoading] = useState(false);

	const {
		state: { user },
	} = useContext(Context);

	const becomeInstructor = async () => {
		setLoading(true);
		axios
			.post("/api/make-instructor")
			.then(res => {
				window.location.href = res.data;
			})
			.catch(e => {
				console.log(e);
				toast.error("Stripe onboarding failed! Try Again", {
					position: "top-right",
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			})
			.finally(() => setLoading(false));
	};

	return (
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
					BECOME INSTRUCTOR
				</Title>
			</div>
			<Center mt={20}>
				<UserPlus size={100} />
			</Center>
			<Title order={2} align='center'>
				Setup payments to publish your courses on vdemy
			</Title>
			<Text
				variant='gradient'
				gradient={{ from: "indigo", to: "cyan", deg: 45 }}
				size='xl'
				weight={700}
				align='center'>
				We partner with stripe
			</Text>
			<Center>
				<Button
					mt={20}
					mb={3}
					radius='xl'
					size='lg'
					loading={loading}
					onClick={becomeInstructor}>
					Setup Payout
				</Button>
			</Center>
		</BackgroundImage>
	);
};

export default BecomeInstructor;
