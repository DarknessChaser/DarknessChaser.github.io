// One-shot migration: Jekyll/Hux posts -> Fuwari content collections
// Reads _posts/*.md, writes src/content/posts/YYYY/MM/DD/<slug>.md
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(ROOT, "_posts");
const OUT_DIR = path.join(ROOT, "src", "content", "posts");

function parseFrontMatter(text) {
	const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!m) return { data: null, body: text };
	const lines = m[1].split(/\r?\n/);
	const data = {};
	let currentKey = null;
	for (const line of lines) {
		const listItem = line.match(/^\s{2,}-\s?(.*)$/);
		if (listItem && currentKey) {
			if (!Array.isArray(data[currentKey])) data[currentKey] = [];
			data[currentKey].push(listItem[1].trim().replace(/^["']|["']$/g, ""));
			continue;
		}
		const kv = line.match(/^([A-Za-z_-]+):\s*(.*)$/);
		if (!kv) continue;
		const key = kv[1];
		let value = kv[2].trim();
		currentKey = key;
		if (value === "") { data[key] = null; continue; }
		// inline array [a, b]
		if (value.startsWith("[") && value.endsWith("]")) {
			data[key] = value.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
			continue;
		}
		// strip quotes
		if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}
		data[key] = value;
	}
	return { data, body: text.slice(m[0].length) };
}

function yamlString(s) {
	// emit as double-quoted YAML-safe string
	return JSON.stringify(s);
}

const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith(".md"));
const report = { migrated: 0, skipped: [], liquidLeftovers: [], kramdownAttrs: [], dateFixed: [], emptyHeaderImg: [] };

for (const file of files) {
	const raw = fs.readFileSync(path.join(SRC_DIR, file), "utf8");
	const { data, body } = parseFrontMatter(raw);

	// date from filename or front-matter (front-matter wins if valid)
	const dateMatch = file.match(/^(\d{4})-(\d{1,2})-(\d{1,2})-/);
	let y, mo, d;
	if (data && data.date) {
		const dm = String(data.date).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
		if (dm) { y = dm[1]; mo = dm[2].padStart(2, "0"); d = dm[3].padStart(2, "0"); }
		else { report.skipped.push(`${file}: bad date field ${data.date}`); continue; }
		if (mo !== dm[2] || d !== dm[3]) report.dateFixed.push(file);
	} else if (dateMatch) {
		y = dateMatch[1]; mo = dateMatch[2].padStart(2, "0"); d = dateMatch[3].padStart(2, "0");
	} else {
		report.skipped.push(`${file}: no date`);
		continue;
	}

	if (!data || !data.title) { report.skipped.push(`${file}: no title`); continue; }

	const slug = file.replace(/^\d{4}-\d{1,2}-\d{1,2}-/, "").replace(/\.md$/, "");
	if (!slug) { report.skipped.push(`${file}: empty slug`); continue; }

	const out = {};
	out.title = data.title;
	out.published = `${y}-${mo}-${d}`;
	if (data.subtitle && String(data.subtitle).trim() !== "") out.description = String(data.subtitle);
	if (data.tags && (Array.isArray(data.tags) ? data.tags.length : String(data.tags).trim() !== "")) {
		out.tags = Array.isArray(data.tags) ? data.tags : String(data.tags).split(",").map(s => s.trim()).filter(Boolean);
	}
	if (data["header-img"] && String(data["header-img"]).trim() !== "") {
		let img = String(data["header-img"]).trim();
		if (/^https?:\/\//.test(img)) out.image = img;
		else if (img.startsWith("/")) out.image = img;
		else out.image = "/" + img.replace(/^\.?\//, "");
	} else {
		report.emptyHeaderImg.push(file);
	}

	// leftover syntax scan
	const liquid = body.match(/\{%[\s\S]{0,80}%\}/g);
	if (liquid) report.liquidLeftovers.push(`${file}: ${liquid.length}x liquid tag`);
	const kram = body.match(/^\{:\s*[#.][^\n]*\}/gm);
	if (kram) report.kramdownAttrs.push(`${file}: ${kram.length}x kramdown attr`);

	const fm = ["---"];
	fm.push(`title: ${yamlString(out.title)}`);
	fm.push(`published: ${out.published}`);
	if (out.description !== undefined) fm.push(`description: ${yamlString(out.description)}`);
	if (out.image !== undefined) fm.push(`image: ${yamlString(out.image)}`);
	if (out.tags) fm.push(`tags: [${out.tags.map(t => yamlString(t)).join(", ")}]`);
	fm.push("---", "");

	const outDir = path.join(OUT_DIR, y, mo, d);
	fs.mkdirSync(outDir, { recursive: true });
	fs.writeFileSync(path.join(outDir, `${slug}.md`), fm.join("\n") + body.replace(/^\r?\n/, ""), "utf8");
	report.migrated++;
}

console.log(`migrated: ${report.migrated}/${files.length}`);
if (report.skipped.length) console.log("SKIPPED:\n  " + report.skipped.join("\n  "));
if (report.dateFixed.length) console.log(`date normalized (front-matter): ${report.dateFixed.length}`);
if (report.emptyHeaderImg.length) console.log(`no header-img: ${report.emptyHeaderImg.length} -> ${report.emptyHeaderImg.join(", ")}`);
if (report.liquidLeftovers.length) console.log("LIQUID TAGS LEFT:\n  " + report.liquidLeftovers.join("\n  "));
if (report.kramdownAttrs.length) console.log("KRAMDOWN ATTRS LEFT:\n  " + report.kramdownAttrs.join("\n  "));
