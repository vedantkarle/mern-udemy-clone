import { Center, Loader } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import UserRoute from "../../../components/routes/UserRoute";

const Success = () => {
	const router = useRouter();
	const { id } = router.query;

	const successRequest = async () => {
		const { data } = await axios.get(`/api/course/stripe-success/${id}`);
		router.push(`/user/course/${data.course.slug}`);
	};

	useEffect(() => {
		if (id) successRequest();
	}, [id]);

	return (
		<UserRoute showNav={false}>
			<Center mt={40}>
				<Loader color='green' size='xl' />
			</Center>
		</UserRoute>
	);
};

export default Success;
