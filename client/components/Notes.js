import {
	ActionIcon,
	Badge,
	Grid,
	Group,
	TypographyStylesProvider,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import React from "react";

const Notes = ({ notes, onDelete }) => {
	return (
		<>
			{notes.map(n => (
				<Grid grow>
					<Grid.Col span={1}>
						<Badge color='dark' variant='filled'>
							{n.time}
						</Badge>
					</Grid.Col>
					<Grid.Col span={11}>
						<Group position='apart'>
							<span>
								<b>{n.sectionName}: </b>
								<span>{n.lessonName}</span>
							</span>
							<ActionIcon onClick={() => onDelete(n._id)}>
								<IconTrash size={18} />
							</ActionIcon>
						</Group>
						<TypographyStylesProvider
							mt={10}
							sx={{ backgroundColor: "#F7F9FA", padding: 10 }}>
							<div dangerouslySetInnerHTML={{ __html: n.content }} />
						</TypographyStylesProvider>
					</Grid.Col>
				</Grid>
			))}
		</>
	);
};

export default Notes;
