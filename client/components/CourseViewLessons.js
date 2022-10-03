import { Accordion, ActionIcon, Divider, Group } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons";
import React from "react";

const CourseViewLessons = ({ setOpened, setPreview, sections }) => {
	return (
		<Accordion p={10}>
			{sections?.map((s, i) => (
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
								<Group
									sx={{
										"&:hover": {
											backgroundColor: "#eee",
										},
										padding: 16,

										cursor: "pointer",
									}}
									position='apart'>
									<div>
										<p>
											{i + 1}.{l.title}
										</p>
										<p>3min</p>
									</div>
									{l?.free_preview && (
										<ActionIcon
											onClick={() => {
												setPreview(l?.video?.Location);
												setOpened(true);
											}}
											color='green'
											radius='xl'
											variant='filled'>
											<IconPlayerPlay size={18} />
										</ActionIcon>
									)}
								</Group>
								<Divider my='md' variant='dashed' />
							</>
						))}
					</Accordion.Panel>
				</Accordion.Item>
			))}
		</Accordion>
	);
};

export default CourseViewLessons;
