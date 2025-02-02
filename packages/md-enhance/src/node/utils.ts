import { Logger } from "vuepress-shared/node";
import { ensureEndingSlash } from "@vuepress/shared";
import { getDirname, path } from "@vuepress/utils";

const __dirname = getDirname(import.meta.url);

export const logger = new Logger("vuepress-plugin-md-enhance");

export const CLIENT_FOLDER = ensureEndingSlash(
  path.resolve(__dirname, "../client")
);
