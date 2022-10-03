import { BackgroundImage, Container, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import CreateCourseForm from "../../../components/forms/CreateCourseForm";
import InstructorRoute from "../../../components/routes/InstructorRoute";

const InstructorCreate = () => {
	const [value, setValue] = useState({
		uploading: false,
		loading: false,
	});
	const [preview, setPreview] = useState("");
	const [image, setImage] = useState(null);

	const router = useRouter();

	const form = useForm({
		initialValues: {
			name: "",
			description: "",
			price: "299",
			paid: true,
		},

		validate: {
			name: val => (val.trim().length > 0 ? null : "Invalid name"),
			description: val =>
				val.trim().length > 0 ? null : "Invalid description",
		},
	});

	const uploadImage = file => {
		setValue({ ...value, loading: true });
		Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async uri => {
			try {
				let { data } = await axios.post("/api/course/upload-image", {
					image: uri,
				});
				setImage(data);
				toast.success("Image uploaded successfully", {
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
				setValue({ ...value, loading: false });
			}
		});
	};

	const removeImage = async () => {
		setValue({ ...value, loading: true });
		try {
			await axios.post("/api/course/remove-image", image);
			setImage(null);
			setPreview("");
			toast.success("Image removed successfully", {
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
		setValue({ ...value, loading: false });
	};

	const handleSubmit = async values => {
		try {
			const { data } = await axios.post("/api/course/create", {
				...values,
				image,
			});
			toast.success("Course created successfully", {
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
						CREATE COURSE
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
					uploadImage={uploadImage}
					image={image}
					removeImage={removeImage}
					form={form}
				/>
			</Container>
		</InstructorRoute>
	);
};

export default InstructorCreate;
