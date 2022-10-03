import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/router";
import { ChevronRight } from "tabler-icons-react";

const UserButton = ({ image, name, email, icon }) => {
	const router = useRouter();

	return (
		<UnstyledButton
			onClick={() => router.push("/user")}
			sx={theme => ({
				display: "block",
				width: "100%",
				color:
					theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

				"&:hover": {
					backgroundColor:
						theme.colorScheme === "dark"
							? theme.colors.dark[8]
							: theme.colors.gray[0],
				},
			})}>
			<Group>
				<Avatar src={image} radius='xl' />

				<div style={{ flex: 1 }}>
					<Text size='sm' weight={500}>
						{name}
					</Text>

					<Text color='dimmed' size='xs'>
						{email}
					</Text>
				</div>

				{icon || <ChevronRight size={16} />}
			</Group>
		</UnstyledButton>
	);
};

export default UserButton;
