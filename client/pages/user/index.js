import {
	Avatar,
	BackgroundImage,
	Center,
	Group,
	List,
	Loader,
	Text,
	Title,
} from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserRoute from "../../components/routes/UserRoute";

const UserIndex = () => {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const loadCourses = async () => {
		setLoading(true);
		const { data } = await axios.get("/api/course/user-courses");
		setCourses(data);
		setLoading(false);
	};

	useEffect(() => {
		loadCourses();
	}, []);

	return (
		<UserRoute showNav>
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
						USER DASHBOARD
					</Title>
				</div>
			</BackgroundImage>
			{courses?.length > 0 ? (
				<List p={10} spacing='sm' size='xl' listStyleType='none' center>
					{courses?.map(c => (
						<List.Item>
							<Group position='apart'>
								<Group>
									<Avatar
										radius='xs'
										size={100}
										src={
											c?.image?.Location ||
											"https://akm-img-a-in.tosshub.com/indiatoday/images/story/201811/online-3412473_1920_1.jpeg?tz.RfsTe_UTLHiDqxmpG7PY_nTIBjwF7"
										}></Avatar>
									<div>
										<Text>
											<b>{c?.name}</b>
										</Text>
										<Text size='sm'>
											<b>Sections: {c?.sections.length}</b>
										</Text>
										<Text size='sm'>
											<i>Created by - {c?.instructor.name}</i>
										</Text>
									</div>
								</Group>
								<IconPlayerPlay
									onClick={() => router.push(`/user/course/${c?.slug}`)}
									style={{
										backgroundColor: "#000",
										color: "#fff",
										borderRadius: "50%",
										padding: "10px",
										cursor: "pointer",
									}}
									size={40}
								/>
							</Group>
						</List.Item>
					))}
				</List>
			) : loading ? (
				<Center>
					<Loader size='xl' />
				</Center>
			) : (
				<Center>
					<Title>No Courses Enrolled</Title>
				</Center>
			)}
		</UserRoute>
	);
};

export default UserIndex;
