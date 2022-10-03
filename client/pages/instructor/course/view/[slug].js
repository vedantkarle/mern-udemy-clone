import {
	Accordion,
	ActionIcon,
	Avatar,
	Button,
	Center,
	Divider,
	Group,
	Loader,
	Modal,
	Text,
	TextInput,
	Title,
	Tooltip,
	TypographyStylesProvider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
	IconBookUpload,
	IconCheck,
	IconCircleX,
	IconEdit,
	IconQuestionMark,
	IconUsers,
} from "@tabler/icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import InstructorRoute from "../../../../components/routes/InstructorRoute";

const CourseView = () => {
	const [course, setcourse] = useState({});
	const [opened, setOpened] = useState(false);
	const [opened2, setOpened2] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [video, setVideo] = useState(null);
	const [section, setSection] = useState(null);
	const [students, setStudents] = useState(0);

	const router = useRouter();
	const { slug } = router.query;

	const form1 = useForm({
		initialValues: {
			name: "",
		},

		validate: {
			name: val => (val.trim().length > 0 ? null : "Invalid name"),
		},
	});

	const form2 = useForm({
		initialValues: {
			title: "",
			content: "",
			video: "",
			free_preview: false,
		},

		validate: {
			title: val => (val.trim().length > 0 ? null : "Invalid title"),
			content: val => (val.trim().length > 0 ? null : "Invalid content"),
		},
	});

	const loadCourse = async () => {
		const { data } = await axios.get(`/api/course/${slug}`);
		setcourse(data);
	};

	const addSection = async ({ name }) => {
		const { data } = await axios.post(`/api/course/addSection`, {
			slug,
			title: name,
		});
		setcourse(data);
		setOpened(false);
	};

	const addLesson = async values => {
		try {
			const { data } = await axios.post(
				`/api/course/lesson/${slug}/${course.instructor._id}`,
				{ ...values, video, section },
			);

			form2.reset();
			setOpened2(false);
			setcourse(data);
			setSection(null);
			toast.success("Lesson added", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} catch (error) {
			console.log(error);
			toast.error(error?.response?.data || error.message, {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	};

	const uploadVideo = async file => {
		setUploading(true);
		try {
			const videoData = new FormData();
			videoData.append("video", file);

			const { data } = await axios.post("/api/course/upload-video", videoData, {
				onUploadProgress: e => {
					setProgress(Math.round((100 * e.loaded) / e.total));
				},
			});

			setVideo(data);
			toast.success("Video uploaded successfully", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} catch (error) {
			console.log(error);
			toast.error(error?.response?.data || error.message, {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} finally {
			setUploading(false);
		}
	};

	const removeVideo = async () => {
		setUploading(true);
		try {
			await axios.post("/api/course/remove-video", video);

			setVideo(null);
			setProgress(0);
			form2.values.video = "";

			toast.success("Video removed successfully", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} catch (error) {
			console.log(error);
			toast.error(error?.response?.data || error.message, {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} finally {
			setUploading(false);
		}
	};

	const handlePublish = async () => {
		try {
			let answer = window.confirm(
				"Once you publish your course it will be live in market place",
			);
			if (!answer) return;

			const { data } = await axios.put(`/api/course/publish/${course?._id}`);
			setcourse(data);

			toast.success("Your course is live!", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} catch (error) {
			toast.error("Failed to publish course.Try again", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	};

	const handleUnpublish = async () => {
		try {
			let answer = window.confirm(
				"Once you unpublish your course it will not be live in market place",
			);
			if (!answer) return;

			const { data } = await axios.put(`/api/course/unpublish/${course?._id}`);
			setcourse(data);

			toast.success("Your course is unpublished!", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} catch (error) {
			toast.error("Failed to unpublish course.Try again", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	};

	const studentCount = async () => {
		const { data } = await axios.post(`/api/instructor/student-count`, {
			courseId: course?._id,
		});
		setStudents(data);
	};

	useEffect(() => {
		loadCourse();
	}, [slug]);

	useEffect(() => {
		course && studentCount();
	}, [course]);

	return (
		<InstructorRoute>
			{course ? (
				<>
					<Group position='apart' p={20}>
						<Group>
							<Avatar
								src={course?.image?.Location || null}
								radius={50}
								size={100}
								style={{ border: "1px solid #eee" }}
							/>
							<div>
								<Title order={2}>{course?.name?.toUpperCase()}</Title>

								<Text>
									<b>{course?.sections?.length} Sections</b>
								</Text>
							</div>
						</Group>
						<Group>
							<Tooltip label={`${students} Students Enrolled`}>
								<ActionIcon color='teal' radius='xl' variant='filled'>
									<IconUsers size={18} />
								</ActionIcon>
							</Tooltip>
							<Tooltip label='Edit'>
								<ActionIcon
									onClick={() => router.push(`/instructor/course/edit/${slug}`)}
									color='yellow'
									radius='xl'
									variant='filled'>
									<IconEdit size={18} />
								</ActionIcon>
							</Tooltip>
							{course?.sections?.length < 2 ? (
								<Tooltip label='Min 2 sections required to publish'>
									<ActionIcon color='green' radius='xl' variant='filled'>
										<IconQuestionMark size={18} />
									</ActionIcon>
								</Tooltip>
							) : course?.published ? (
								<Tooltip label='Unpublish'>
									<ActionIcon
										onClick={handleUnpublish}
										color='red'
										radius='xl'
										variant='filled'>
										<IconCircleX size={18} />
									</ActionIcon>
								</Tooltip>
							) : (
								<Tooltip label='Publish'>
									<ActionIcon
										onClick={handlePublish}
										color='green'
										radius='xl'
										variant='filled'>
										<IconCheck size={18} />
									</ActionIcon>
								</Tooltip>
							)}
						</Group>
					</Group>
					<Divider my='sm' variant='dotted' />
					<TypographyStylesProvider>
						<div dangerouslySetInnerHTML={{ __html: course?.description }} />
					</TypographyStylesProvider>
					<Divider my='sm' variant='dotted' />
					<Center>
						<Button
							leftIcon={<IconBookUpload />}
							onClick={() => setOpened(true)}>
							Add Section
						</Button>
					</Center>
					<Title order={2} p={10}>
						{course?.sections?.length} Sections
					</Title>
					<Accordion mt={10} p={10}>
						{course?.sections?.map((s, i) => (
							<Accordion.Item value={s.title}>
								<Accordion.Control style={{ backgroundColor: "#F7F9FA" }}>
									<b>
										Section {i + 1}: {s.title}
									</b>
									<p>{s.lessons.length} Lessons</p>
								</Accordion.Control>
								<Accordion.Panel>
									{s?.lessons.map((l, i) => (
										<>
											<div
												style={{
													padding: 10,
												}}>
												<p>
													{i + 1}.{l.title}
												</p>
												<p>3min</p>
											</div>
											<Divider my='md' variant='dashed' />
										</>
									))}
									<Center>
										<Button
											leftIcon={<IconBookUpload />}
											onClick={() => {
												setOpened2(true);
												setSection(s.title);
											}}>
											Add Lesson
										</Button>
									</Center>
								</Accordion.Panel>
							</Accordion.Item>
						))}
					</Accordion>
				</>
			) : (
				<Center>
					<Loader size='xl' />
				</Center>
			)}
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title='Add New Section'>
				<form onSubmit={form1.onSubmit(values => addSection(values))}>
					<TextInput
						withAsterisk
						label='Section Name'
						placeholder='section name'
						{...form1.getInputProps("name")}
					/>
					<Button mt={10} type='submit'>
						Add
					</Button>
				</form>
			</Modal>
			<Modal
				opened={opened2}
				onClose={() => setOpened2(false)}
				title='Add New Lesson'>
				<AddLessonForm
					form2={form2}
					addLesson={addLesson}
					uploading={uploading}
					progress={progress}
					uploadVideo={uploadVideo}
					video={video}
					removeVideo={removeVideo}
				/>
			</Modal>
		</InstructorRoute>
	);
};

export default CourseView;
