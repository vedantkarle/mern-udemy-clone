import {
	Button,
	FileInput,
	Grid,
	Switch,
	Textarea,
	TextInput,
	useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";
import React from "react";

const AddLessonForm = ({
	form2,
	addLesson,
	uploading,
	uploadVideo,
	video,
	removeVideo,
}) => {
	const theme = useMantineTheme();

	return (
		<form onSubmit={form2.onSubmit(values => addLesson(values))}>
			<TextInput
				withAsterisk
				label='Lesson Name'
				placeholder='lesson name'
				{...form2.getInputProps("title")}
			/>
			<Textarea
				withAsterisk
				label='Content'
				placeholder='content'
				{...form2.getInputProps("content")}
			/>
			<Grid>
				<Grid.Col span={form2.values.video ? 8 : 12}>
					<FileInput
						mt={10}
						placeholder='Upload Video'
						label='Video'
						withAsterisk
						{...form2.getInputProps("video")}
						accept='video/*'
					/>
				</Grid.Col>
				<Grid.Col span={4}>
					{!video && form2.values.video && (
						<Button
							mt={31}
							radius='xl'
							onClick={() => uploadVideo(form2.values.video)}
							loading={uploading}>
							Upload
						</Button>
					)}
					{video && (
						<Button
							mt={31}
							radius='xl'
							color='red'
							onClick={() => removeVideo()}>
							Remove
						</Button>
					)}
				</Grid.Col>
			</Grid>

			<Switch
				mt={10}
				{...form2.getInputProps("free_preview")}
				checked={form2.values.free_preview}
				color='teal'
				size='md'
				label='Free Preview'
				thumbIcon={
					form2.values.free_preview ? (
						<IconCheck
							size={12}
							color={theme.colors.teal[theme.fn.primaryShade()]}
							stroke={3}
						/>
					) : (
						<IconX
							size={12}
							color={theme.colors.red[theme.fn.primaryShade()]}
							stroke={3}
						/>
					)
				}
			/>
			<Button loading={uploading} mt={10} type='submit'>
				Add
			</Button>
		</form>
	);
};

export default AddLessonForm;
