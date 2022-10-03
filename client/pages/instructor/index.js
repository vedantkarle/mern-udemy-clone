import {
	ActionIcon,
	Avatar,
	BackgroundImage,
	Box,
	Group,
	Text,
	Title,
	Tooltip,
} from "@mantine/core";
import { IconChecks, IconCircleX } from "@tabler/icons";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InstructorRoute from "../../components/routes/InstructorRoute";

const InstructorIndex = () => {
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		loadCourses();
	}, []);

	const loadCourses = async () => {
		const { data } = await axios.get("/api/instructor-courses");
		setCourses(data);
	};

	return (
		<InstructorRoute>
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
						INSTRUCTOR DASHBOARD
					</Title>
				</div>
			</BackgroundImage>
			<Box mt={20}>
				<Group>
					{courses &&
						courses.map(c => (
							<>
								<Group m={20}>
									<Avatar
										src={c?.image?.Location || null}
										radius={50}
										size={100}
										style={{ border: "1px solid #eee" }}
									/>
									<div>
										<Link href={`/instructor/course/view/${c.slug}`}>
											<Title style={{ cursor: "pointer" }} order={2}>
												{c.name.toUpperCase()}
											</Title>
										</Link>
										<Text>
											<b>{c.sections.length} Sections</b>
										</Text>
										{c.sections.length < 2 ? (
											<Text color='yellow'>
												At least 2 sections required to publish a course
											</Text>
										) : c.published ? (
											<Text color='green'>Course is live</Text>
										) : (
											<Text color='green'>
												Your course is ready to be published
											</Text>
										)}
									</div>
									<Tooltip
										label={
											c.published
												? "Course is published"
												: "Course is not published"
										}>
										{c.published ? (
											<ActionIcon color='green' radius='xl' variant='filled'>
												<IconChecks size={18} />
											</ActionIcon>
										) : (
											<ActionIcon color='yellow' radius='xl' variant='filled'>
												<IconCircleX size={18} />
											</ActionIcon>
										)}
									</Tooltip>
								</Group>
							</>
						))}
				</Group>
			</Box>
		</InstructorRoute>
	);
};

export default InstructorIndex;
