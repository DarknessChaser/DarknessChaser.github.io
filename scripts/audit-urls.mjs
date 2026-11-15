// URL parity audit: legacy Jekyll URLs (from git jekyll-legacy branch) vs new dist URLs
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const raw = execSync('git -c core.quotepath=off ls-tree -r --name-only jekyll-legacy -- _posts', {
	encoding: "utf8",
	cwd: path.resolve(import.meta.dirname, ".."),
});
const oldUrls = raw
	.split(/\r?\n/)
	.map((line) => {
		const m = line.match(/^_posts\/(\d{4})-(\d{1,2})-(\d{1,2})-(.*)\.md$/);
		if (!m) return null;
		return `${m[1]}/${m[2].padStart(2, "0")}/${m[3].padStart(2, "0")}/${m[4]}`;
	})
	.filter(Boolean);

const walk = (dir, acc = []) => {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) walk(p, acc);
		else if (e.name === "index.html") acc.push(path.relative(".", p).replace(/\\/g, "/").replace(/^dist\//, "").replace(/\/index\.html$/, "/"));
	}
	return acc;
};
const newUrls = walk(path.resolve(import.meta.dirname, "..", "dist")).filter((u) => /^20\d\d\//.test(u));

const missing = oldUrls.filter((u) => !newUrls.includes(`${u}/`));
const extra = newUrls.filter((u) => !oldUrls.includes(u.slice(0, -1)));
console.log(`old: ${oldUrls.length}, new: ${newUrls.length}, missing: ${missing.length}, extra: ${extra.length}`);
missing.forEach((x) => console.log("MISSING", x));
extra.forEach((x) => console.log("EXTRA", x));
