import { Container, Divider, Group, Paper, Text, Title } from "@mantine/core";
import { IconReportMoney } from "@tabler/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { currencyFormatter } from "../../utils/helpers";

const Revenue = () => {
	const [balance, setBalance] = useState({ pending: [] });
	const [loading, setLoading] = useState(false);

	const getBalance = async () => {
		const { data } = await axios.get("/api/instructor/balance");
		setBalance(data);
	};

	useEffect(() => {
		getBalance();
	}, []);

	return (
		<InstructorRoute>
			<Container size={800} mt={20}>
				<Paper shadow='xs' p='lg' withBorder>
					<Group position='apart'>
						<div>
							<Title>Revenue Report</Title>
							<Text mt={20}>
								You get paid directlt from stripe to your bank account
							</Text>
						</div>
						<IconReportMoney size={60} />
					</Group>
					<Divider my='lg' variant='dotted' />
					<Group position='apart'>
						<div>
							<Title order={2}>Pending Balance</Title>
							<Text mt={20}>For last 48 hours</Text>
						</div>
						<Title order={2}>
							{balance?.pending?.map((b, i) => (
								<span key={i}>
									{currencyFormatter({ ...b, amount: b.amount / 100 })}
								</span>
							))}
						</Title>
					</Group>
				</Paper>
			</Container>
		</InstructorRoute>
	);
};

export default Revenue;
