import { Center, Grid, Title } from "@mantine/core";
import { IconVideo } from "@tabler/icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import PlayerControls from "../../../components/PlayerControls";
import StudentRoute from "../../../components/routes/StudentRoute";
import StudentCourseLessons from "../../../components/StudentCourseLessons";
import StudentCourseTabs from "../../../components/StudentCourseTabs";

const format = seconds => {
	const result = new Date(seconds * 1000).toISOString().slice(14, 19);
	return result;
};

let count = 0;

const SingleCourse = () => {
	const [course, setCourse] = useState(null);
	const [clicked, setClicked] = useState(null);
	const [playing, setPlaying] = useState(false);
	const [muted, setMuted] = useState(false);
	const [volume, setVolume] = useState(1);
	const [played, setPlayed] = useState(0);
	const [seeking, setSeeking] = useState(false);

	const router = useRouter();
	const { slug } = router.query;

	const playerRef = useRef(null);
	const playerContainerRef = useRef(null);
	const controlsRef = useRef(null);

	const loadCourse = async () => {
		const { data } = await axios.get(`/api/user/course/${slug}`);
		setCourse(data);
	};

	const handlePlayPause = () => {
		setPlaying(!playing);
	};

	const handleRewind = () => {
		playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
	};

	const handleForward = () => {
		playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
	};

	const handleMute = () => {
		setMuted(!muted);
	};

	const onVolumeChange = v => {
		setVolume(parseFloat(v / 100));
		setMuted(v === 0 ? true : false);
	};

	const onVolumeSeekDown = v => {
		setVolume(parseFloat(v / 100));
		setMuted(v === 0 ? true : false);
	};

	const onToggleFullscreen = () => {
		screenfull.toggle(playerContainerRef.current);
	};

	const handleProgress = changeState => {
		if (count > 3) {
			controlsRef.current.style.visibility = "hidden";
			count = 0;
		}

		if (controlsRef.current.style.visibility == "visible") {
			count += 1;
		}

		if (!seeking) {
			setPlayed(changeState.played);
		}
	};

	const onSeek = v => {
		setPlayed(parseFloat(v / 100));
	};

	const onSeekMouseUp = v => {
		setSeeking(false);
		playerRef.current.seekTo(v / 100);
	};

	const onSeekMouseDown = e => {
		setSeeking(true);
	};

	const handleMouseMove = () => {
		controlsRef.current.style.visibility = "visible";
		count = 0;
	};

	const currentTime = format(playerRef?.current?.getCurrentTime() || 0);

	useEffect(() => {
		if (slug) {
			loadCourse();
		}
	}, [slug]);

	return (
		<StudentRoute>
			<Grid>
				<Grid.Col span={9}>
					{clicked ? (
						<>
							<div
								ref={playerContainerRef}
								className='player-wrapper'
								onMouseMove={handleMouseMove}>
								<ReactPlayer
									width='100%'
									height='100%'
									ref={playerRef}
									url={
										course?.sections[clicked?.section_index || 0]?.lessons[
											clicked?.lesson_index || 0
										].video.Location
									}
									playing={playing}
									muted={muted}
									volume={volume}
									onProgress={handleProgress}
								/>
								<PlayerControls
									ref={controlsRef}
									clicked={clicked}
									playing={playing}
									muted={muted}
									volume={volume}
									played={played}
									onPlayPause={handlePlayPause}
									onRewind={handleRewind}
									onForward={handleForward}
									onMute={handleMute}
									onVolumeChange={onVolumeChange}
									onVolumeSeekDown={onVolumeSeekDown}
									onToggleFullscreen={onToggleFullscreen}
									onSeek={onSeek}
									onSeekMouseUp={onSeekMouseUp}
									onSeekMouseDown={onSeekMouseDown}
								/>
							</div>
							<StudentCourseTabs
								course={course}
								currentTime={currentTime}
								clicked={clicked}
							/>
						</>
					) : (
						<Center mt={20}>
							<Title>Please Select a lesson</Title>
							<IconVideo size={100} color='blue' />
						</Center>
					)}
				</Grid.Col>
				<Grid.Col span={3}>
					<StudentCourseLessons
						sections={course?.sections}
						setClicked={setClicked}
						clicked={clicked}
					/>
				</Grid.Col>
			</Grid>
		</StudentRoute>
	);
};

export default SingleCourse;
