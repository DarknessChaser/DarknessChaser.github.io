<script lang="ts">
import { onMount } from "svelte";

import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import type { PostForList } from "../utils/content-utils";
import { getPostUrlBySlug } from "../utils/url-utils";

export let sortedPosts: PostForList[] = [];

interface Group {
	year: number;
	posts: PostForList[];
}

interface Filters {
	tags: string[];
	categories: string[];
	uncategorized: boolean;
}

function readFilters(): Filters {
	const params = new URLSearchParams(window.location.search);
	return {
		tags: params.getAll("tag"),
		categories: params.getAll("category"),
		uncategorized: params.get("uncategorized") !== null,
	};
}

function applyFilters(posts: PostForList[], filters: Filters): PostForList[] {
	let filtered = posts;

	if (filters.tags.length > 0) {
		filtered = filtered.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => filters.tags.includes(tag)),
		);
	}

	if (filters.categories.length > 0) {
		filtered = filtered.filter(
			(post) =>
				post.data.category && filters.categories.includes(post.data.category),
		);
	}

	if (filters.uncategorized) {
		filtered = filtered.filter((post) => !post.data.category);
	}

	return filtered;
}

// Front matter dates are UTC midnights, so read them in UTC as well; otherwise
// the build machine and the visitor's timezone could disagree about a post's
// year (and the SSR markup would not match the hydrated markup).
function groupByYear(posts: PostForList[]): Group[] {
	const grouped = new Map<number, PostForList[]>();

	for (const post of posts) {
		const year = post.data.published.getUTCFullYear();
		const bucket = grouped.get(year);
		if (bucket) {
			bucket.push(post);
		} else {
			grouped.set(year, [post]);
		}
	}

	return Array.from(grouped, ([year, list]) => ({ year, posts: list })).sort(
		(a, b) => b.year - a.year,
	);
}

// Render the complete archive at build time so the page works without JS and
// crawlers can see every post; the query string only narrows it down once the
// island hydrates.
let groups = groupByYear(sortedPosts);

onMount(() => {
	const filters = readFilters();
	if (
		filters.tags.length === 0 &&
		filters.categories.length === 0 &&
		!filters.uncategorized
	) {
		return;
	}
	groups = groupByYear(applyFilters(sortedPosts, filters));
});

function formatDate(date: Date) {
	const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
	const day = date.getUTCDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}
</script>

<div class="card-base px-8 py-6">
    {#each groups as group}
        <div>
            <div class="flex flex-row w-full items-center h-[3.75rem]">
                <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                    {group.year}
                </div>
                <div class="w-[15%] md:w-[10%]">
                    <div
                            class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
                    ></div>
                </div>
                <div class="w-[70%] md:w-[80%] transition text-left text-50">
                    {group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
                </div>
            </div>

            {#each group.posts as post}
                <a
                        href={getPostUrlBySlug(post.slug)}
                        aria-label={post.data.title}
                        class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
                >
                    <div class="flex flex-row justify-start items-center h-full">
                        <!-- date -->
                        <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
                            {formatDate(post.data.published)}
                        </div>

                        <!-- dot and line -->
                        <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                            <div
                                    class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                       outline outline-4 z-50
                       outline-[var(--card-bg)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
                            ></div>
                        </div>

                        <!-- post title -->
                        <div
                                class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                     group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                     text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden"
                        >
                            {post.data.title}
                        </div>

                        <!-- tag list -->
                        <div
                                class="hidden md:block md:w-[15%] text-left text-sm transition
                     whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
                        >
                            {formatTag(post.data.tags)}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/each}
</div>
