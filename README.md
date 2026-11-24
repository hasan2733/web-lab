# Web Lab

A collection of HTML, CSS, and JavaScript exercises created while practicing
web-page structure, styling, forms, tables, responsive layouts, and small
front-end applications.

The repository contains four learning projects:

1. A basic HTML table and list exercise
2. A styled resume page
3. An HTML/CSS recipe-card lab report
4. A FindIt lost-and-found interface, including a static version and a
   JavaScript-enabled backup version

## Run Locally

Clone the repository and start a local static server from the repository root:

```bash
git clone https://github.com/hasan2733/web-lab.git
cd web-lab
python3 -m http.server 8000
```

Open <http://localhost:8000> in a browser, then choose a project directory.
The pages use relative links, so serving the repository is more reliable than
opening files directly with `file://`.

## Project Map

```text
web-lab/
├── Lab_Performance_1/       Basic tables and lists
├── assignment-1/            Resume page and profile image
├── lab_project/              Static FindIt pages
├── lab_project_backup/       Interactive FindIt pages
├── lab_report_html_css/      Chicken biryani recipe lab
├── LICENSE                   Apache 2.0 license
└── README.md                 This guide
```

---

## `Lab_Performance_1`

This folder is a basic HTML exercise focused on table structure, merged table
cells, ordered lists, and linking an external stylesheet.

### `Lab_Performance_1/index.html`

The main exercise page. It contains:

- A heading and welcome paragraph
- A three-column personal-information table
- A `rowspan` example that merges the `Steve` cell across two rows
- An ordered list of technologies: HTML, CSS, and JavaScript
- Links to `styles.css` for presentation

Open: [`Lab_Performance_1/index.html`](Lab_Performance_1/index.html)

### `Lab_Performance_1/styles.css`

The stylesheet for the performance page. It defines the visual appearance of
the table, list containers, tabs, spacing, borders, and page-level layout.

Open: [`Lab_Performance_1/styles.css`](Lab_Performance_1/styles.css)

---

## `assignment-1`

This folder contains a two-column resume/CV page. The left column presents
contact information, languages, and hobbies. The right column presents the
profile heading, career objective, education, experience, skills, projects,
and personal information.

### `assignment-1/index.html`

The resume document. It demonstrates:

- A two-column page layout
- Profile-image placement
- Contact and social links
- Education history
- Skills grouped by category
- Project links to external GitHub repositories
- Semantic sections separated with headings and horizontal rules

Open: [`assignment-1/index.html`](assignment-1/index.html)

### `assignment-1/style.css`

The resume stylesheet. It controls the left/right column layout, typography,
profile image, section headings, education rows, colors, spacing, and the
visual emphasis used for the resume name and awards.

Open: [`assignment-1/style.css`](assignment-1/style.css)

### `assignment-1/profile-pic.jpg`

The profile photograph displayed near the top of the resume. It is loaded by
`index.html` through the `<img>` element and styled with the `.profile` class.

Open: [`assignment-1/profile-pic.jpg`](assignment-1/profile-pic.jpg)

---

## `lab_report_html_css`

This folder is an HTML and CSS lab report presented as a chicken-biryani
recipe card. It intentionally demonstrates many HTML elements and CSS
techniques in one page.

### `lab_report_html_css/index.html`

The primary recipe page. It demonstrates:

- HTML document structure and metadata
- Headings, paragraphs, line breaks, and inline styles
- An image with `src`, `alt`, `width`, and `height`
- Superscript and subscript text
- `blockquote`, `q`, and `abbr` elements
- Preformatted content with `<pre>`
- Absolute and relative links
- Unordered, ordered, and description lists
- A nutrition table using `colspan` and `rowspan`
- `id` and `class` attributes for CSS targeting
- A chef-contact section

Open: [`lab_report_html_css/index.html`](lab_report_html_css/index.html)

### `lab_report_html_css/styles.css`

The external stylesheet for the recipe page. It styles the banner, recipe
container, headings, image area, lists, nutrition table, contact section, and
highlighted text. The page also includes a small internal CSS example in
`index.html`.

Open: [`lab_report_html_css/styles.css`](lab_report_html_css/styles.css)

### `lab_report_html_css/recipe.html`

A secondary placeholder page linked from the main recipe page through the
“More Recipes” link. It currently provides a minimal page titled “More
Recipe” and can be extended with additional recipe content.

Open: [`lab_report_html_css/recipe.html`](lab_report_html_css/recipe.html)

### `lab_report_html_css/image.png`

The recipe image displayed in the main recipe card as the chicken-biryani
illustration.

Open: [`lab_report_html_css/image.png`](lab_report_html_css/image.png)

---

## `lab_project`

This folder is the static presentation version of **FindIt**, a lost-and-found
platform concept. It contains the page layouts and shared styling, but unlike
`lab_project_backup`, it does not include the JavaScript data and interaction
files.

### `lab_project/index.html`

The FindIt landing page. It presents the product introduction, search area,
statistics, workflow steps, categories, recent lost/found items, active
locations, success stories, and frequently asked questions.

Open: [`lab_project/index.html`](lab_project/index.html)

### `lab_project/explore.html`

The lost-and-found browsing page. It provides the layout for search, category,
location, date, status, and sorting filters, together with a results grid and
pagination area.

Open: [`lab_project/explore.html`](lab_project/explore.html)

### `lab_project/report.html`

The item-reporting page. It contains a form for reporting a lost or found
item, including item details, location, date/time, description, identifying
features, contact preference, and a photo preview area.

Open: [`lab_project/report.html`](lab_project/report.html)

### `lab_project/details.html`

The item-details page. It provides the layout for displaying a selected
lost/found item and its detailed information.

Open: [`lab_project/details.html`](lab_project/details.html)

### `lab_project/dashboard.html`

The account dashboard page. It organizes dashboard statistics and sections for
the user's lost items, found items, and claim requests.

Open: [`lab_project/dashboard.html`](lab_project/dashboard.html)

### `lab_project/css/style.css`

The shared stylesheet for all static FindIt pages. It defines:

- Buttons, links, navigation, and responsive hamburger controls
- Hero sections and statistics cards
- Workflow steps, category chips, item grids, and charts
- Explore filters, report forms, and dashboard sections
- Details-page layout, footer, spacing, colors, and responsive breakpoints

Open: [`lab_project/css/style.css`](lab_project/css/style.css)

---

## `lab_project_backup`

This folder is the more complete interactive version of FindIt. It reuses the
same page concepts and shared styling while adding JavaScript for sample data,
authentication UI, filtering, details, reporting, matching, and dashboard
rendering.

### HTML pages

#### `lab_project_backup/index.html`

The interactive FindIt home page. It provides dynamic containers for
statistics, recent lost/found items, location data, success stories, and
navigation/authentication controls.

Open: [`lab_project_backup/index.html`](lab_project_backup/index.html)

#### `lab_project_backup/explore.html`

The interactive search page. It contains the filter controls, search input,
result grid, result count, active filter tags, and pagination containers used
by `explore.js`.

Open: [`lab_project_backup/explore.html`](lab_project_backup/explore.html)

#### `lab_project_backup/report.html`

The interactive report form. It collects lost/found item information and
connects the form, character counter, photo preview, URL query parameters,
and report submission behavior to `report.js`.

Open: [`lab_project_backup/report.html`](lab_project_backup/report.html)

#### `lab_project_backup/details.html`

The interactive item-details page. It displays the selected item and provides
the verification form/modal used when a user attempts to claim an item.

Open: [`lab_project_backup/details.html`](lab_project_backup/details.html)

#### `lab_project_backup/dashboard.html`

The interactive account dashboard. It renders user statistics, lost items,
found items, and claim requests, with shared authentication and navigation
behavior.

Open: [`lab_project_backup/dashboard.html`](lab_project_backup/dashboard.html)

### CSS

#### `lab_project_backup/css/style.css`

The shared visual system for the interactive FindIt pages. It includes the
navigation, hero, cards, forms, filters, dashboard, modals, toast messages,
responsive layout rules, and reusable button styles.

Open: [`lab_project_backup/css/style.css`](lab_project_backup/css/style.css)

### JavaScript

#### `lab_project_backup/js/app.js`

Shared application behavior used across the pages. It initializes the sample
data, updates match scores, manages authentication UI, handles navigation and
mobile menus, renders shared item cards, and provides common notifications and
interaction helpers.

Open: [`lab_project_backup/js/app.js`](lab_project_backup/js/app.js)

#### `lab_project_backup/js/data.js`

The client-side data layer. It stores sample lost/found items and user-related
state in browser storage, initializes default data, and provides the data
helpers consumed by the other scripts.

Open: [`lab_project_backup/js/data.js`](lab_project_backup/js/data.js)

#### `lab_project_backup/js/index.js`

Home-page controller. It populates the landing-page statistics, recent lost
and found item cards, location information, success stories, and FAQ
interactions.

Open: [`lab_project_backup/js/index.js`](lab_project_backup/js/index.js)

#### `lab_project_backup/js/explore.js`

Explore-page controller. It reads filters and URL parameters, filters and
sorts the available items, renders result cards, updates the result count,
manages active filter tags, and controls pagination.

Open: [`lab_project_backup/js/explore.js`](lab_project_backup/js/explore.js)

#### `lab_project_backup/js/report.js`

Report-page controller. It selects lost/found mode, reads query parameters,
updates the character count, previews uploaded images, validates form input,
and saves submitted reports.

Open: [`lab_project_backup/js/report.js`](lab_project_backup/js/report.js)

#### `lab_project_backup/js/details.js`

Details-page controller. It finds the requested item, renders its information,
and handles the ownership-verification flow and claim submission.

Open: [`lab_project_backup/js/details.js`](lab_project_backup/js/details.js)

#### `lab_project_backup/js/dashboard.js`

Dashboard-page controller. It loads the current user's reports and claims,
updates dashboard statistics, and renders the lost-item, found-item, and
claim-request sections.

Open: [`lab_project_backup/js/dashboard.js`](lab_project_backup/js/dashboard.js)

---

## `LICENSE`

The repository license. It contains the Apache License 2.0 terms governing
the use, modification, and distribution of this project.

Open: [`LICENSE`](LICENSE)

## Learning Path

For a gradual introduction, start with:

1. `Lab_Performance_1` for basic HTML tables and lists
2. `assignment-1` for page layout and CSS styling
3. `lab_report_html_css` for a broad HTML element exercise
4. `lab_project` for multi-page layout design
5. `lab_project_backup` for JavaScript-driven UI behavior
