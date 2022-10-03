import { BackgroundImage, Box, Group, Title } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";

const Index = () => {
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		(async () => {
			const { data } = await axios.get("/api/courses");
			setCourses(data);
		})();
	}, []);

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
						VDEMY
					</Title>
				</div>
			</BackgroundImage>
			<Box m={20}>
				<Group>
					{courses?.map(c => (
						<CourseCard course={c} />
					))}
				</Group>
			</Box>
		</div>
	);
};

export default Index;
