import {
	Divider,
	Tabs,
	Text,
	Title,
	TypographyStylesProvider,
} from "@mantine/core";
import { IconInfoCircle, IconVideo } from "@tabler/icons";
import React from "react";
import CourseViewLessons from "./CourseViewLessons";

const CourseViewTabs = ({ course, setPreview, setOpened }) => {
	return (
		<Tabs defaultValue='info'>
			<Tabs.List>
				<Tabs.Tab value='info' icon={<IconInfoCircle size={14} />}>
					Course Info
				</Tabs.Tab>
				<Tabs.Tab value='sections' icon={<IconVideo size={14} />}>
					Sections
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value='info' pt='xs'>
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

			<Tabs.Panel value='sections' pt='xs'>
				<Title order={2} p={10}>
					{course?.sections?.length} Sections
				</Title>
				<CourseViewLessons
					sections={course?.sections}
					setPreview={setPreview}
					setOpened={setOpened}
				/>
			</Tabs.Panel>
		</Tabs>
	);
};

export default CourseViewTabs;
