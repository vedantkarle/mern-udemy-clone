import { Center, Grid, Loader } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InstructorNav from "../nav/InstructorNav";

const InstructorRoute = ({ children }) => {
	const [hidden, setHidden] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const {
					data: { ok },
				} = await axios.get("/api/current-instructor");
				if (ok) setHidden(true);
			} catch (error) {
				console.log(error);
				setHidden(false);
				router.push("/");
			}
		};
		fetchUser();
	}, []);

	return (
		<>
			{!hidden ? (
				<Center>
					<Loader size='xl' />
				</Center>
			) : (
				<Grid grow gutter={0}>
					<Grid.Col span={2}>
						<InstructorNav />
					</Grid.Col>
					<Grid.Col span={10}>{children}</Grid.Col>
				</Grid>
			)}
		</>
	);
};

export default InstructorRoute;
