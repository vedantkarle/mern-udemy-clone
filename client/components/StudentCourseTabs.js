import {
	Badge,
	Button,
	Divider,
	Grid,
	Group,
	Tabs,
	Text,
	Title,
	TypographyStylesProvider,
} from "@mantine/core";
import { IconInfoCircle, IconPlus, IconVideo } from "@tabler/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Notes from "./Notes";
import RichTextEditor from "./RichText";

const StudentCourseTabs = ({ course, currentTime, clicked }) => {
	const [notes, setNotes] = useState([]);
	const [showCreateNote, setShowCreateNote] = useState(false);
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	const addNote = async () => {
		setLoading(true);
		try {
			const { data } = await axios.post("/api/course/add-note", {
				time: currentTime,
				content,
				sectionName: clicked.sectionName,
				lessonName: clicked.title,
				courseId: course?._id,
			});
			setNotes(prev => [...prev, data]);
		} catch (error) {
			alert("Error creating note");
		}
		setContent("");
		setLoading(false);
	};

	const deleteNote = async noteId => {
		try {
			await axios.delete(`/api/course/delete-note/${noteId}`);
			setNotes(notes.filter(n => n._id !== noteId));
		} catch (error) {
			alert("Error deleting note");
		}
	};

	const getNotes = async () => {
		const { data } = await axios.get(
			`/api/course/get-user-notes/${course?._id}`,
		);
		setNotes(data);
	};

	useEffect(() => {
		getNotes();
	}, []);

	return (
		<Tabs defaultValue='overview'>
			<Tabs.List>
				<Tabs.Tab value='overview' icon={<IconInfoCircle size={14} />}>
					Overview
				</Tabs.Tab>
				<Tabs.Tab value='notes' icon={<IconVideo size={14} />}>
					Notes
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value='overview' pt='xs' p={20}>
				<Title order={2}>About this Course:</Title>
				<TypographyStylesProvider>
					<div dangerouslySetInnerHTML={{ __html: course?.description }} />
				</TypographyStylesProvider>
				<Divider my='sm' variant='dotted' />
				<Text>
					<b>Sections</b>: {course?.sections?.length}
				</Text>
				<Text>
					<b>Instructor</b>: {course?.instructor?.name}
				</Text>
			</Tabs.Panel>

			<Tabs.Panel value='notes' pt='lg' p={50}>
				{showCreateNote ? (
					<>
						<Grid grow>
							<Grid.Col span={1}>
								<Badge color='dark' variant='filled'>
									{currentTime}
								</Badge>
							</Grid.Col>
							<Grid.Col span={11}>
								<RichTextEditor
									id='rte'
									value={content}
									onChange={setContent}
									controls={[
										["bold", "italic", "underline", "code"],
										["unorderedList", "h1", "h2", "h3"],
									]}
								/>
							</Grid.Col>
						</Grid>
						<Group position='right' mt={10}>
							<Button
								color='dark'
								variant='subtle'
								onClick={() => setShowCreateNote(false)}>
								Cancel
							</Button>
							<Button
								loading={loading}
								disabled={content.length <= 0}
								color='dark'
								onClick={addNote}>
								Save Note
							</Button>
						</Group>
					</>
				) : (
					<Button
						onClick={() => setShowCreateNote(true)}
						variant='default'
						size='lg'
						fullWidth>
						<Group position='apart'>
							<span>Create a new note at {currentTime}</span>
							<IconPlus />
						</Group>
					</Button>
				)}
				<Title mt={20} mb={10} order={2}>
					Notes
				</Title>
				{notes?.length <= 0 ? (
					<Text>No notes added</Text>
				) : (
					<Notes notes={notes} onDelete={deleteNote} />
				)}
			</Tabs.Panel>
		</Tabs>
	);
};

export default StudentCourseTabs;
