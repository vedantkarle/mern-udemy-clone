import { Center, Grid, Loader } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserNav from "../nav/UserNav";

const StudentRoute = ({ children, showNav }) => {
	const [hidden, setHidden] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const {
					data: { ok },
				} = await axios.get("/api/current-user");
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
					{showNav && (
						<Grid.Col span={2}>
							<UserNav />
						</Grid.Col>
					)}
					<Grid.Col span={showNav ? 10 : 12}>{children}</Grid.Col>
				</Grid>
			)}
		</>
	);
};

export default StudentRoute;
