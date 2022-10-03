import { Box, NavLink } from "@mantine/core";
import { IconHome2 } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const UserNav = () => {
	const router = useRouter();

	return (
		<Box>
			<Link href='/user' passHref>
				<NavLink
					component='a'
					label='Dashboard'
					icon={<IconHome2 size={16} stroke={1.5} />}
					active={router.pathname === "/user"}
				/>
			</Link>
		</Box>
	);
};

export default UserNav;
