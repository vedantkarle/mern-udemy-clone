import { Accordion, Group } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons";
import React from "react";

const StudentCourseLessons = ({ sections, setClicked, clicked }) => {
	return (
		<Accordion defaultValue='0' multiple>
			{sections?.map((s, si) => (
				<Accordion.Item value={`${si}`} key={s.title}>
					<Accordion.Control style={{ backgroundColor: "#F7F9FA" }}>
						<b>
							Section {si + 1}: {s.title}
						</b>
						<p>{s.lessons.length} Lessons</p>
					</Accordion.Control>
					<Accordion.Panel>
						{s?.lessons.map((l, i) => (
							<Group
								sx={{
									"&:hover": {
										backgroundColor: "#eee",
									},
									padding: 16,
									backgroundColor:
										clicked?.title === l.title ? "#eee" : "transparent",
									cursor: "pointer",
								}}
								onClick={() =>
									setClicked({
										title: l.title,
										lesson_index: i,
										section_index: si,
										sectionName: s.title,
									})
								}
								key={i}>
								<IconPlayerPlay
									style={{
										backgroundColor: "#000",
										color: "#fff",
										borderRadius: "50%",
										padding: "5px",
										cursor: "pointer",
									}}
									size={20}
								/>
								<Group position='apart'>
									<div>
										<p>
											{i + 1}.{l.title}
										</p>
										<p>3min</p>
									</div>
								</Group>
							</Group>
						))}
					</Accordion.Panel>
				</Accordion.Item>
			))}
		</Accordion>
	);
};

export default StudentCourseLessons;
