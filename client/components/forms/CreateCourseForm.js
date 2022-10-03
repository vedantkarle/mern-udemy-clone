import {
	Avatar,
	Button,
	FileInput,
	Grid,
	Group,
	Input,
	Select,
	TextInput,
} from "@mantine/core";
import React from "react";
import RichTextEditor from "../../components/RichText";

const CreateCourseForm = ({
	value,
	handleSubmit,
	preview,
	setPreview,
	uploadImage,
	image,
	removeImage,
	editPage = false,
	form,
}) => {
	return (
		<form onSubmit={form.onSubmit(values => handleSubmit(values))}>
			<TextInput
				withAsterisk
				label='Name'
				placeholder='course name'
				{...form.getInputProps("name")}
			/>

			<Input.Wrapper label='Description' required>
				<RichTextEditor
					{...form.getInputProps("description")}
					id='rte'
					controls={[
						["bold", "italic", "underline", "link"],
						["unorderedList", "h1", "h2", "h3"],
						["sup", "sub"],
						["alignLeft", "alignCenter", "alignRight"],
					]}
				/>
			</Input.Wrapper>

			<Select
				mt={10}
				label='Course Type'
				placeholder='Select type'
				data={[
					{ value: true, label: "Paid" },
					{ value: false, label: "Free" },
				]}
				{...form.getInputProps("paid")}
			/>
			{form.values.paid ? (
				<Select
					mt={10}
					label='Course Price'
					placeholder='Select rate'
					data={[
						{ value: "299", label: "Rs.299" },
						{ value: "399", label: "Rs.399" },
						{ value: "499", label: "Rs.499" },
					]}
					{...form.getInputProps("price")}
				/>
			) : null}

			<Grid>
				<Grid.Col span={preview ? 8 : 12}>
					<FileInput
						mt={10}
						placeholder='Upload Image'
						label='Image'
						withAsterisk
						value={preview}
						onChange={setPreview}
						accept='image/png,image/jpeg'
					/>
				</Grid.Col>
				{preview && (
					<Grid.Col span={4}>
						<Group>
							<Avatar
								mt={33}
								radius='xl'
								src={window.URL.createObjectURL(preview)}
								alt='Course image'
							/>
							{!image && (
								<Button
									mt={31}
									radius='xl'
									onClick={() => uploadImage(preview)}
									loading={value.loading}>
									Upload
								</Button>
							)}
							{image && (
								<Button
									mt={31}
									radius='xl'
									color='red'
									onClick={removeImage}
									loading={value.loading}>
									Remove
								</Button>
							)}
						</Group>
					</Grid.Col>
				)}
			</Grid>
			<Button
				radius='xl'
				mt={20}
				fullWidth
				type='submit'
				loading={value.loading || value.uploading}>
				Save & Continue
			</Button>
		</form>
	);
};

export default CreateCourseForm;
