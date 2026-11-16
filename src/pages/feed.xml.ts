// The legacy Jekyll/Hux site published this feed at /feed.xml, so old
// subscribers still poll it. Re-export the canonical implementation instead of
// keeping a second copy of the generator in sync.
export { GET } from "./rss.xml";
