import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

const parser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

// Most posts never got an explicit description, which left the feed's
// <description> empty and made readers render blank list items. Fall back to
// the first paragraph of the rendered body, as plain text.
function firstParagraphText(html: string): string {
	const paragraph = html.match(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/i);
	if (!paragraph) return "";
	const text = sanitizeHtml(paragraph[1], {
		allowedTags: [],
		allowedAttributes: {},
	});
	return text.replace(/\s+/g, " ").trim();
}

function truncate(text: string, max: number): string {
	const chars = Array.from(text);
	return chars.length > max ? `${chars.slice(0, max).join("")}…` : text;
}

export async function GET(context: APIContext) {
	const blog = await getSortedPosts();

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: context.site ?? "https://darknesschaser.github.io",
		items: blog.map((post) => {
			const content =
				typeof post.body === "string" ? post.body : String(post.body || "");
			const cleanedContent = stripInvalidXmlChars(content);
			const html = sanitizeHtml(parser.render(cleanedContent), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
			});
			const description =
				post.data.description.trim() ||
				firstParagraphText(html) ||
				post.data.title;
			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: truncate(description, 240),
				link: url(`/${post.id}/`),
				content: html,
			};
		}),
		customData: `<language>${siteConfig.lang}</language>`,
	});
}
