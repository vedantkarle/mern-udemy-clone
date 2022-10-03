import { Box, NavLink } from "@mantine/core";
import { IconCreativeCommons, IconHome2, IconReportMoney } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const InstructorNav = () => {
	const router = useRouter();

	return (
		<Box>
			<Link href='/instructor' passHref>
				<NavLink
					component='a'
					label='Dashboard'
					icon={<IconHome2 size={16} stroke={1.5} />}
					active={router.pathname === "/instructor"}
				/>
			</Link>
			<Link href='/instructor/course/create' passHref>
				<NavLink
					component='a'
					label='Create Course'
					icon={<IconCreativeCommons size={16} stroke={1.5} />}
					active={router.pathname === "/instructor/course/create"}
				/>
			</Link>
			<Link href='/instructor/revenue' passHref>
				<NavLink
					component='a'
					label='Revenue'
					icon={<IconReportMoney size={16} stroke={1.5} />}
					active={router.pathname === "/instructor/revenue"}
				/>
			</Link>
		</Box>
	);
};

export default InstructorNav;
