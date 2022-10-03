import {
	Accordion,
	ActionIcon,
	BackgroundImage,
	Container,
	Divider,
	Group,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconTrash } from "@tabler/icons";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CreateCourseForm from "../../../../components/forms/CreateCourseForm";
import InstructorRoute from "../../../../components/routes/InstructorRoute";

const CourseEdit = () => {
	const [course, setCourse] = useState(null);
	const [value, setValue] = useState({
		uploading: false,
		loading: false,
	});
	const [preview, setPreview] = useState("");

	const router = useRouter();
	const { slug } = router.query;

	const handleSubmit = async values => {
		try {
			await axios.put(`/api/course/${slug}`, {
				...values,
			});
			toast.success("Course updated successfully", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			router.push("/instructor");
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

	const form = useForm({
		initialValues: {
			name: "",
			description: "",
			price: "",
			paid: true,
		},

		validate: {
			name: val => (val.trim().length > 0 ? null : "Invalid name"),
			description: val =>
				val.trim().length > 0 ? null : "Invalid description",
		},
	});

	const loadCourse = async () => {
		const { data } = await axios.get(`/api/course/${slug}`);

		form.values.name = data?.name;
		form.values.description = data?.description;
		form.values.price = data?.price.toString();
		form.values.paid = data?.paid;
		setCourse(data);
	};

	const handleDrag = (e, index) => {
		e.dataTransfer.setData("itemIndex", index);
	};

	const handleDrop = async (e, index, s) => {
		const movingItemIndex = e.dataTransfer.getData("itemIndex");
		const targetItemIndex = index;
		let allLessons = s?.lessons;

		let movingItem = allLessons[movingItemIndex];
		allLessons.splice(movingItemIndex, 1);
		allLessons.splice(targetItemIndex, 0, movingItem);

		const secs = course?.sections.map(sec => {
			if (sec._id === s._id) {
				return { ...sec, lessons: [...allLessons] };
			} else {
				return sec;
			}
		});

		setCourse({ ...course, sections: secs });
		await axios.put(`/api/course/${slug}`, {
			...course,
			sections: secs,
		});
		toast.success("Lessons updated successfully", {
			position: "top-right",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

	const handleDelete = async (index, section, isSection = false) => {
		if (isSection) {
			const secs = course?.sections.filter(sec => sec._id !== section._id);
			setCourse({ ...course, sections: secs });
			await axios.put(`/api/course/${slug}`, {
				...course,
				sections: secs,
			});
			toast.success("Sections updated successfully", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} else {
			let allLessons = section.lessons;
			allLessons.splice(index, 1);
			const secs = course?.sections.map(sec => {
				if (sec._id === section._id) {
					return { ...sec, lessons: [...allLessons] };
				} else {
					return sec;
				}
			});

			setCourse({ ...course, sections: secs });
			await axios.put(`/api/course/${slug}`, {
				...course,
				sections: secs,
			});
			toast.success("Lessons updated successfully", {
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

	useEffect(() => {
		loadCourse();
	}, [slug]);

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
						EDIT COURSE
					</Title>
				</div>
			</BackgroundImage>
			<Container mt={20}>
				<CreateCourseForm
					handleSubmit={handleSubmit}
					value={value}
					setValue={setValue}
					preview={preview}
					setPreview={setPreview}
					uploadImage={() => {}}
					image={null}
					removeImage={() => {}}
					editPage={true}
					form={form}
				/>
				<Title mt={10} order={2}>
					{course?.sections?.length} Sections
				</Title>
				<Accordion mt={20}>
					{course?.sections?.map((s, i) => (
						<Accordion.Item value={s.title}>
							<Accordion.Control style={{ backgroundColor: "#F7F9FA" }}>
								<Group position='apart'>
									<b>
										Section {i + 1}: {s.title}
									</b>
									<ActionIcon
										color='red'
										radius='xl'
										variant='filled'
										onClick={() => handleDelete(i, s, true)}>
										<IconTrash size={18} />
									</ActionIcon>
								</Group>
								<p>{s.lessons.length} Lessons</p>
							</Accordion.Control>
							<Accordion.Panel onDragOver={e => e.preventDefault()}>
								{s?.lessons.map((l, i) => (
									<>
										<Group position='apart'>
											<div
												draggable
												onDragStart={e => handleDrag(e, i, s)}
												onDrop={e => handleDrop(e, i, s)}>
												<p>
													{i + 1}.{l.title}
												</p>
												<p>3min</p>
											</div>
											<Group>
												<ActionIcon color='yellow' radius='xl' variant='filled'>
													<IconEdit size={18} />
												</ActionIcon>
												<ActionIcon
													color='red'
													radius='xl'
													variant='filled'
													onClick={() => handleDelete(i, s)}>
													<IconTrash size={18} />
												</ActionIcon>
											</Group>
										</Group>
										<Divider my='md' variant='dashed' />
									</>
								))}
							</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion>
			</Container>
		</InstructorRoute>
	);
};

export default CourseEdit;
