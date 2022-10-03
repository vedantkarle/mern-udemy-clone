import {
	Burger,
	Button,
	Group,
	Header,
	MediaQuery,
	Menu,
	Title,
	useMantineTheme,
} from "@mantine/core";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Context } from "../context";
import UserButton from "./UserButton";

const Navbar = () => {
	const theme = useMantineTheme();
	const router = useRouter();
	const [opened, setOpened] = useState(false);

	const { state, dispatch } = useContext(Context);

	const user = state?.user;

	const logout = async () => {
		dispatch({ type: "LOGOUT" });
		window.localStorage.removeItem("user");
		await axios.get("/api/logout");
		router.push("/");
	};

	return (
		<Header height={60}>
			<Group sx={{ height: "100%" }} px={20} position='apart'>
				<MediaQuery largerThan='sm' styles={{ display: "none" }}>
					<Burger
						opened={opened}
						onClick={() => setOpened(o => !o)}
						size='sm'
						color={theme.colors.gray[6]}
						mr='xl'
					/>
				</MediaQuery>

				<Group>
					<Link href='/'>
						<Title order={2} style={{ cursor: "pointer" }}>
							VDEMY
						</Title>
					</Link>
					{user &&
						(user?.role?.includes("Instructor") ? (
							<>
								<Link href='/instructor/course/create'>
									<Button variant='outline' uppercase ml={10}>
										Create Course
									</Button>
								</Link>
								<Link href='/instructor'>
									<Button variant='outline' uppercase ml={10}>
										Instructor
									</Button>
								</Link>
							</>
						) : (
							<Link href='/user/become-instructor'>
								<Button variant='outline' uppercase ml={10}>
									Become Instructor
								</Button>
							</Link>
						))}
				</Group>

				<Group>
					{user ? (
						<div style={{ display: "flex", alignItems: "center" }}>
							<Menu withArrow>
								<Menu.Target>
									<UserButton
										image='https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80'
										name={user?.name}
										email={user?.email}
									/>
								</Menu.Target>
							</Menu>
							<Button color='red' ml={10} onClick={logout}>
								Logout
							</Button>
						</div>
					) : (
						<>
							<Link href='/login'>
								<Button variant='outline'>Log In</Button>
							</Link>
							<Link href='/register'>
								<Button variant='outline'>Register</Button>
							</Link>
						</>
					)}
				</Group>
			</Group>
		</Header>
	);
};

export default Navbar;
