import { build } from "esbuild";
import { readdir } from "fs/promises";
import { join, extname } from "path";

const srcDir = "src";
const outDir = "dist";

const files = await readdir(srcDir);

const entryPoints = files
	.filter((file) => extname(file) === ".ts")
	.map((file) => join(srcDir, file));

await build({
	entryPoints,
	bundle: true,
	splitting: true,
	format: "esm",
	platform: "browser",
	target: ["chrome114"],
	outdir: outDir,
	minify: true,
});

console.log("✅ All files built with shared dependencies");
