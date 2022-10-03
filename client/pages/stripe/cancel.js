import { Center, Title } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons";
import React from "react";
import UserRoute from "../../components/routes/UserRoute";

const Cancel = () => {
	return (
		<UserRoute showNav={false}>
			<Center mt={40}>
				<IconAlertTriangle size={100} color='red' />
				<Title>Payment Failed!</Title>
			</Center>
		</UserRoute>
	);
};

export default Cancel;
