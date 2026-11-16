import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "漆黑菌的博客",
	subtitle: "人生梦想之一是和叶绿体整合，这样就可以不吃饭了。",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "assets/images/home-bg.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// The legacy "黑" glyph: black for light mode, white for dark mode.
		{ src: "/favicon/favicon-light-32.png", theme: "light", sizes: "32x32" },
		{ src: "/favicon/favicon-light-128.png", theme: "light", sizes: "128x128" },
		{ src: "/favicon/favicon-light-180.png", theme: "light", sizes: "180x180" },
		{ src: "/favicon/favicon-light-192.png", theme: "light", sizes: "192x192" },
		{ src: "/favicon/favicon-dark-32.png", theme: "dark", sizes: "32x32" },
		{ src: "/favicon/favicon-dark-128.png", theme: "dark", sizes: "128x128" },
		{ src: "/favicon/favicon-dark-180.png", theme: "dark", sizes: "180x180" },
		{ src: "/favicon/favicon-dark-192.png", theme: "dark", sizes: "192x192" },
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.AllPosts,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/DarknessChaser", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/about-my-gentle.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "漆黑菌",
	bio: "人生梦想之一是和叶绿体整合，这样就可以不吃饭了。",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/DarknessChaser",
		},
		{
			name: "RSS",
			icon: "fa6-solid:rss",
			url: "/rss.xml",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
