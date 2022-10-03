import { Badge, Card, Group, Image, Text, Title } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { currencyFormatter } from "../utils/helpers";

const CourseCard = ({ course }) => {
	return (
		<Link href={`/course/${course.slug}`}>
			<Card
				shadow='sm'
				p='lg'
				radius='md'
				withBorder
				style={{ width: "400px" }}>
				<Card.Section>
					<Image
						src={
							course?.image?.Location ||
							"https://akm-img-a-in.tosshub.com/indiatoday/images/story/201811/online-3412473_1920_1.jpeg?tz.RfsTe_UTLHiDqxmpG7PY_nTIBjwF7"
						}
						height={160}
						alt='Norway'
					/>
				</Card.Section>

				<Group position='apart' mt='md' mb='xs'>
					<Text weight={500}>{course?.name}</Text>
					<Badge color='pink' variant='light'>
						{course.paid ? "PAID" : "FREE"}
					</Badge>
				</Group>

				<Text size='sm' color='dimmed'>
					By - {course?.instructor?.name}
				</Text>
				<br />
				<Title order={3}>
					{course?.paid
						? currencyFormatter({ amount: course?.price, currency: "inr" })
						: currencyFormatter({ amount: 0, currency: "inr" })}
				</Title>
			</Card>
		</Link>
	);
};

export default CourseCard;
