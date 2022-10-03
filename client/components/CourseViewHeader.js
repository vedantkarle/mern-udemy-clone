import {
	BackgroundImage,
	Box,
	Button,
	Grid,
	Image,
	Text,
	Title,
} from "@mantine/core";
import { IconCheck, IconInfoCircle, IconPlayerPlay } from "@tabler/icons";
import { useRouter } from "next/router";
import { currencyFormatter } from "../utils/helpers";

const CourseViewHeader = ({
	course,
	setPreview,
	setOpened,
	handleFreeEnrollment,
	handlePaidEnrollment,
	user,
	loading,
	enrolled,
}) => {
	const router = useRouter();

	return (
		<BackgroundImage
			sx={{ height: "300px" }}
			src='https://images.unsplash.com/photo-1588420343618-6141b3784bce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80'
			radius={0}>
			<Box p={20}>
				<Grid>
					<Grid.Col span={8}>
						<Title mt={20} align='left' color='#fff' order={1}>
							{course?.name}
						</Title>

						<Text mt={20} style={{ color: "#fff" }}>
							Create by {course?.instructor?.name}
						</Text>
						<Text mt={20} style={{ color: "#fff" }}>
							Last updated {new Date(course?.updatedAt).toLocaleDateString()}
						</Text>
						<Title mt={20} align='left' color='#fff' order={2}>
							{course?.paid
								? currencyFormatter({
										amount: course?.price,
										currency: "inr",
								  })
								: "Free"}
						</Title>
						{user ? (
							enrolled ? (
								<Button
									onClick={() => router.push(`/user/course/${course?.slug}`)}
									color='dark'
									leftIcon={<IconInfoCircle />}
									mt={10}
									loading={loading}>
									Go To Course
								</Button>
							) : (
								<Button
									onClick={
										course?.paid ? handlePaidEnrollment : handleFreeEnrollment
									}
									color='lime'
									leftIcon={<IconCheck />}
									mt={10}
									loading={loading}>
									Enroll For Course
								</Button>
							)
						) : (
							<Button
								onClick={() => router.push("/login")}
								color='teal'
								leftIcon={<IconInfoCircle />}
								mt={10}
								loading={loading}>
								Login To Enroll
							</Button>
						)}
					</Grid.Col>
					<Grid.Col span={4}>
						{course?.sections[0]?.lessons[0]?.video &&
						course?.sections[0]?.lessons[0]?.video?.Location ? (
							<div
								style={{ position: "relative" }}
								onClick={e => {
									setPreview(course?.sections[0]?.lessons[0]?.video?.Location);
									setOpened(true);
								}}>
								<Image
									width='100%'
									height='225px'
									src={
										course?.image?.Location ||
										"https://akm-img-a-in.tosshub.com/indiatoday/images/story/201811/online-3412473_1920_1.jpeg?tz.RfsTe_UTLHiDqxmpG7PY_nTIBjwF7"
									}
								/>
								<IconPlayerPlay
									style={{
										position: "absolute",
										top: "50%",
										left: "50%",
										transform: "translate(-50%,-50%)",
										backgroundColor: "#000",
										color: "#fff",
										borderRadius: "50%",
										padding: "10px",
										cursor: "pointer",
									}}
									size={48}
								/>
							</div>
						) : (
							<Image width={400} radius='md' src={course?.image?.Location} />
						)}
					</Grid.Col>
				</Grid>
			</Box>
		</BackgroundImage>
	);
};

export default CourseViewHeader;
