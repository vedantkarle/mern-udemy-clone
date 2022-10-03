import { MantineProvider } from "@mantine/core";
import Router from "next/router";
import nProgress from "nprogress";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { Provider } from "../context";
import "../public/css//nprogress.css";
import "../public/css/styles.css";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

function MyApp({ Component, pageProps }) {
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<Provider>
				<Navbar />
				<ToastContainer />
				<Component {...pageProps} />
			</Provider>
		</MantineProvider>
	);
}

export default MyApp;
