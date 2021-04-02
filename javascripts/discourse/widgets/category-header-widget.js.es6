import { getOwner } from "discourse-common/lib/get-owner";
import { h } from "virtual-dom";
import { iconNode } from "discourse-common/lib/icon-library";
import { createWidget } from "discourse/widgets/widget";
import Category from "discourse/models/category";

function buildCategory(category, widget) {
  const content = [];

  if (category.read_restricted) {
    content.push(iconNode("lock"));
  }

  if (settings.show_category_icon) {
    try {
      content.push(widget.attach("category-icon", { category }));
    } catch {
      // if widget attaching fails, ignore it as it's probably the missing component
    }
  }

  content.push(h("h1.category-title", Testing));

  if (settings.show_description) {
    content.push(
      h(
        "div.category-title-description",
        h("div.cooked", { innerHTML: category.description })
      )
    );
  }

  return content;
}

export default createWidget("category-header-widget", {
  tagName: "span.discourse-category-banners",

  html() {
    const router = getOwner(this).lookup("router:main");
    const route = router.currentRoute;
    if (
      route &&
      route.params &&
      route.params.hasOwnProperty("category_slug_path_with_id")
    ) {
      const category = Category.findBySlugPathWithID(
        route.params.category_slug_path_with_id
      );
      const isException = settings.exceptions
        .split("|")
        .filter(Boolean)
        .includes(category.name);
      const hideMobile = !settings.show_mobile && this.site.mobileView;
      const isSubCategory =
        !settings.show_subcategory && category.parentCategory;
      const hasNoCategoryDescription =
        settings.hide_if_no_description && !category.description_text;

      if (
        !isException &&
        !hasNoCategoryDescription &&
        !isSubCategory &&
        !hideMobile
      ) {
        document.body.classList.add("category-header");

        return h(
          `div.category-title-header.category-banner-${category.slug}`,
          {
            attributes: {
              style: `background: url(example.jpg); color: blue;`,
            },
          },
          h("div.category-title-contents", buildCategory(category, this))
        );
      }
    } else {
      document.body.classList.remove("category-header");
    }
  },
});
