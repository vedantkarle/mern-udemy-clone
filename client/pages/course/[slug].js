import { Box, Modal } from "@mantine/core";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import CourseViewHeader from "../../components/CourseViewHeader";
import CourseViewTabs from "../../components/CourseViewTabs";
import { Context } from "../../context";

const SingleCourse = () => {
	const [course, setCourse] = useState(null);
	const [opened, setOpened] = useState(false);
	const [preview, setPreview] = useState("");
	const [loading, setLoading] = useState(false);
	const [enrolled, setEnrolled] = useState(false);

	const {
		state: { user },
		dispatch,
	} = useContext(Context);

	const router = useRouter();
	const { slug } = router.query;

	const getCourse = async () => {
		const { data } = await axios.get(`/api/course/${slug}`);
		setCourse(data);
	};

	const checkEnrollment = async () => {
		const { data } = await axios.get(
			`/api/course/check-enrollment/${course._id}`,
		);
		setEnrolled(data.status);
	};

	const handlePaidEnrollment = async () => {
		setLoading(true);
		try {
			const {
				data: { sessionId, user: u },
			} = await axios.post(`/api/course/paid-enrollment/${course._id}`);

			const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
			stripe.redirectToCheckout({ sessionId });

			dispatch({
				type: "LOGIN",
				payload: u,
			});

			toast.success("Enrollment successfull", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} catch (error) {
			toast.error("Enrollment failed.Try again", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
		setLoading(false);
	};

	const handleFreeEnrollment = async () => {
		setLoading(true);
		try {
			const { data } = await axios.post(
				`/api/course/free-enrollment/${course._id}`,
			);
			dispatch({
				type: "LOGIN",
				payload: data,
			});

			toast.success("Enrollment successfull", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} catch (error) {
			toast.error("Enrollment failed.Try again", {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
		setLoading(false);
	};

	useEffect(() => {
		getCourse();
	}, [slug]);

	useEffect(() => {
		if (user && course) {
			checkEnrollment();
		}
	}, [user, course]);

	return (
		<div>
			{course && (
				<>
					<CourseViewHeader
						course={course}
						setPreview={setPreview}
						setOpened={setOpened}
						handleFreeEnrollment={handleFreeEnrollment}
						handlePaidEnrollment={handlePaidEnrollment}
						user={user}
						loading={loading}
						enrolled={enrolled}
					/>
					<Box p={20}>
						<CourseViewTabs
							course={course}
							setPreview={setPreview}
							setOpened={setOpened}
						/>
					</Box>
				</>
			)}
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title='Course Preview'>
				<ReactPlayer
					url={preview}
					playing={opened}
					controls={true}
					width='100%'
					height='100%'
				/>
			</Modal>
		</div>
	);
};

export default SingleCourse;
