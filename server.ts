import { statSync } from "node:fs";
import path from "node:path";

const DEFAULT_PORT = 3000;
const DIST_DIR = path.join(import.meta.dir, "dist");
const INDEX_PATH = path.join(DIST_DIR, "index.html");

const parsedPort = Number.parseInt(process.env.PORT ?? `${DEFAULT_PORT}`, 10);
const PORT = Number.isFinite(parsedPort) ? parsedPort : DEFAULT_PORT;
const HOST = process.env.HOST ?? "0.0.0.0";

const securityHeaders = {
	"Cache-Control": "no-cache",
	"Cross-Origin-Opener-Policy": "same-origin",
	"Cross-Origin-Resource-Policy": "same-origin",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"X-Content-Type-Options": "nosniff",
} satisfies Record<string, string>;

const ensureDistExists = () => {
	try {
		const stat = statSync(INDEX_PATH);

		if (!stat.isFile()) {
			throw new Error("index.html nao encontrado");
		}
	} catch {
		throw new Error(
			"Build nao encontrado em dist/. Execute `bun run build` antes de iniciar o servidor.",
		);
	}
};

const resolveAssetPath = (pathname: string) => {
	const trimmedPath = pathname.replace(/^\/+/, "");
	const normalizedPath = path.normalize(trimmedPath);
	const candidatePath = path.resolve(DIST_DIR, normalizedPath);
	const relativePath = path.relative(DIST_DIR, candidatePath);

	if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
		return null;
	}

	try {
		const stat = statSync(candidatePath);
		return stat.isFile() ? candidatePath : null;
	} catch {
		return null;
	}
};

const fileResponse = (filePath: string, cacheControl: string) =>
	new Response(Bun.file(filePath), {
		headers: {
			...securityHeaders,
			"Cache-Control": cacheControl,
		},
	});

ensureDistExists();

const server = Bun.serve({
	development: false,
	hostname: HOST,
	port: PORT,
	fetch(request) {
		if (request.method !== "GET" && request.method !== "HEAD") {
			return new Response("Method Not Allowed", {
				headers: securityHeaders,
				status: 405,
			});
		}

		const url = new URL(request.url);

		if (url.pathname === "/health") {
			return new Response("ok", {
				headers: securityHeaders,
				status: 200,
			});
		}

		const assetPath = resolveAssetPath(url.pathname);

		if (assetPath) {
			const isImmutableAsset = url.pathname.startsWith("/assets/");
			const cacheControl = isImmutableAsset
				? "public, max-age=31536000, immutable"
				: "public, max-age=3600";

			return fileResponse(assetPath, cacheControl);
		}

		return fileResponse(INDEX_PATH, "no-cache");
	},
});

console.log(`Serving Onda Finance on http://${server.hostname}:${server.port}`);
