import { isPlainObject } from "@vuepress/shared";
import { injectLocalizedDate } from "vuepress-shared/node";
import { convertFrontmatter } from "../compact/index.js";
import { checkFrontmatter } from "../frontmatter/check.js";
import { ArticleInfoType, PageType } from "../../shared/index.js";

import type { App, Page, PluginObject } from "@vuepress/core";
import type {
  ThemeBlogHomePageFrontmatter,
  ThemeNormalPageFrontmatter,
  ThemePageData,
  ThemeProjectHomePageFrontmatter,
} from "../../shared/index.js";

export const injectPageInfo = (page: Page<ThemePageData>): void => {
  const { filePathRelative } = page;
  const frontmatter = page.frontmatter as
    | ThemeProjectHomePageFrontmatter
    | ThemeBlogHomePageFrontmatter
    | ThemeNormalPageFrontmatter;

  const isArticle =
    // declaring this is an article
    frontmatter.article ||
    // generated from markdown files
    Boolean(frontmatter.article !== false && filePathRelative);
  const isSlide = frontmatter.layout === "Slide";

  // save page type to routeMeta
  page.routeMeta[ArticleInfoType.type] = frontmatter.home
    ? PageType.home
    : isSlide
    ? PageType.slide
    : isArticle
    ? PageType.article
    : PageType.page;

  // save relative file path into page data to generate edit link
  page.data.filePathRelative = filePathRelative;

  page.routeMeta[ArticleInfoType.title] = page.title;

  if ("icon" in frontmatter)
    page.routeMeta[ArticleInfoType.icon] = frontmatter.icon;

  // catalog related
  if (isPlainObject(frontmatter.dir)) {
    if ("order" in frontmatter.dir)
      page.routeMeta[ArticleInfoType.order] = (
        frontmatter as ThemeNormalPageFrontmatter
      ).dir!.order;
    if (
      "index" in frontmatter.dir &&
      (frontmatter as ThemeNormalPageFrontmatter).dir!.index === false
    )
      page.routeMeta[ArticleInfoType.index] = 0;
  } else {
    if ("order" in frontmatter)
      page.routeMeta[ArticleInfoType.order] = frontmatter.order;
    if ("index" in frontmatter && frontmatter.index === false)
      page.routeMeta[ArticleInfoType.index] = 0;
  }

  // resolve shortTitle
  if ("shortTitle" in frontmatter)
    page.routeMeta[ArticleInfoType.shortTitle] = frontmatter.shortTitle;
};

export const extendsPagePlugin = (legacy = true): PluginObject => ({
  name: "vuepress-theme-hope-extends-page",

  extendsPage: (page, app): void => {
    if (legacy)
      page.frontmatter = convertFrontmatter(
        page.frontmatter,
        page.filePathRelative || ""
      );

    checkFrontmatter(page, app.env.isDebug);
    injectPageInfo(<Page<ThemePageData>>page);
    injectLocalizedDate(page);
  },
});

export const useExtendsPagePlugin = (app: App, legacy = true): void => {
  app.use(extendsPagePlugin(legacy));
};
