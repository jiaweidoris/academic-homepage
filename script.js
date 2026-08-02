const languageButton = document.getElementById("language-toggle");
let currentLanguage = localStorage.getItem("academic-homepage-language") || "zh";

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value || "";
}

function makeExternalLink(link, className = "profile-link") {
  const anchor = document.createElement("a");
  anchor.href = link.href;
  anchor.textContent = link.label;
  anchor.className = className;
  if (link.href.startsWith("http")) {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }
  return anchor;
}

function renderProfile(data) {
  Object.entries(data.profile).forEach(([key, value]) => {
    if (typeof value === "string") setText(`[data-field="${key}"]`, value);
  });
  document.getElementById("profile-photo").alt = data.labels.profileAlt;

  const facts = document.getElementById("profile-facts");
  facts.innerHTML = "";
  data.profile.facts.forEach((fact) => {
    const item = document.createElement("li");
    const icon = document.createElement("span");
    const text = document.createElement("span");
    icon.textContent = fact.icon;
    text.textContent = fact.text;
    item.append(icon, text);
    facts.appendChild(item);
  });

  const links = document.getElementById("profile-links");
  links.innerHTML = "";
  data.profile.links.forEach((link) => links.appendChild(makeExternalLink(link)));

  const interests = document.getElementById("interest-list");
  interests.innerHTML = "";
  data.profile.interests.forEach((interest) => {
    const tag = document.createElement("span");
    tag.className = "interest-tag";
    tag.textContent = interest;
    interests.appendChild(tag);
  });
}

function renderBiography(paragraphs) {
  const root = document.getElementById("biography-copy");
  root.innerHTML = "";
  paragraphs.forEach((text) => {
    const paragraph = document.createElement("p");
    text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).forEach((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const strong = document.createElement("strong");
        strong.textContent = part.slice(2, -2);
        paragraph.appendChild(strong);
      } else {
        paragraph.appendChild(document.createTextNode(part));
      }
    });
    root.appendChild(paragraph);
  });
}

function renderNews(items) {
  const root = document.getElementById("news-list");
  root.innerHTML = "";
  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "news-item";
    const date = document.createElement("div");
    date.className = "news-date";
    date.textContent = item.date;
    const copy = document.createElement("p");
    copy.textContent = item.text;
    article.append(date, copy);
    root.appendChild(article);
  });
}

function renderPublications(groups) {
  const root = document.getElementById("publication-groups");
  root.innerHTML = "";
  groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "publication-group";
    const heading = document.createElement("h3");
    heading.className = "group-title";
    heading.textContent = group.title;
    const list = document.createElement("div");
    list.className = "publication-list";

    group.items.forEach((item) => {
      const article = document.createElement("article");
      article.className = `publication-item ${item.image ? "publication-item-featured" : "publication-item-compact"}`;
      let visual;
      if (item.image) {
        const image = document.createElement("img");
        image.className = "publication-figure";
        image.src = item.image;
        image.alt = item.imageAlt || item.title;
        image.loading = "lazy";
        image.decoding = "async";
        const paperLink = item.links?.[0]?.href;
        if (paperLink) {
          const anchor = document.createElement("a");
          anchor.className = "publication-figure-link";
          anchor.href = paperLink;
          anchor.target = "_blank";
          anchor.rel = "noreferrer";
          anchor.setAttribute("aria-label", `${item.title} — Paper`);
          anchor.appendChild(image);
          visual = anchor;
        } else {
          const wrapper = document.createElement("div");
          wrapper.className = "publication-figure-link";
          wrapper.appendChild(image);
          visual = wrapper;
        }
      } else {
        const badge = document.createElement("div");
        badge.className = "publication-badge";
        badge.textContent = item.badge;
        visual = badge;
      }
      const content = document.createElement("div");
      content.className = "publication-content";
      const title = document.createElement("h3");
      title.className = "publication-title";
      title.textContent = item.title;
      const authors = document.createElement("p");
      authors.className = "publication-authors";
      authors.textContent = item.authors;
      const venue = document.createElement("p");
      venue.className = "publication-venue";
      venue.textContent = item.venue;
      content.append(title, authors, venue);
      if (item.description) {
        const description = document.createElement("p");
        description.className = "publication-description";
        description.textContent = item.description;
        content.appendChild(description);
      }
      if (item.links?.length) {
        const links = document.createElement("div");
        links.className = "publication-links";
        item.links.forEach((link) => links.appendChild(makeExternalLink(link, "publication-link")));
        content.appendChild(links);
      }
      article.append(visual, content);
      list.appendChild(article);
    });
    section.append(heading, list);
    root.appendChild(section);
  });
}

function renderSimpleList(rootId, items) {
  const root = document.getElementById(rootId);
  root.innerHTML = "";
  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "simple-item";
    const date = document.createElement("div");
    date.className = "simple-date";
    date.textContent = item.date;
    const content = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title;
    const meta = document.createElement("p");
    meta.className = "simple-meta";
    meta.textContent = item.meta;
    const description = document.createElement("p");
    description.className = "simple-description";
    description.textContent = item.description;
    content.append(title, meta, description);
    article.append(date, content);
    root.appendChild(article);
  });
}

function renderHonors(items) {
  const root = document.getElementById("honor-list");
  root.innerHTML = "";
  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "honor-item";
    const year = document.createElement("div");
    year.className = "honor-year";
    year.textContent = item.year;
    const title = document.createElement("p");
    title.textContent = item.title;
    article.append(year, title);
    root.appendChild(article);
  });
}

function render(language) {
  const data = SITE_DATA[language];
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = data.labels.pageTitle;
  languageButton.textContent = language === "zh" ? "EN" : "中文";
  Object.entries(data.labels).forEach(([key, value]) => {
    document.querySelectorAll(`[data-label="${key}"]`).forEach((node) => { node.textContent = value; });
  });
  renderProfile(data);
  renderBiography(data.profile.biography);
  renderNews(data.news);
  renderPublications(data.publicationGroups);
  renderSimpleList("experience-list", data.experience);
  renderSimpleList("education-list", data.education);
  renderHonors(data.honors);
}

languageButton.addEventListener("click", () => {
  currentLanguage = currentLanguage === "zh" ? "en" : "zh";
  localStorage.setItem("academic-homepage-language", currentLanguage);
  render(currentLanguage);
});

render(currentLanguage);
