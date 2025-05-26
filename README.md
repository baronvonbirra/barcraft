# 🍹 BarCraft

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Styled Components](https://img.shields.io/badge/Styled_Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)](https://styled-components.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Version: 0.0.0](https://img.shields.io/badge/Version-0.0.0-blue.svg?style=for-the-badge)](package.json)
<!-- Placeholder for Build Status: [![Build Status](https://img.shields.io/github/actions/workflow/status/your-username/barcraft/main.yml?branch=main&style=for-the-badge)](https://github.com/your-username/barcraft/actions) -->

BarCraft is a classy, dark, and modern React web application for browsing, discovering, and learning to make cocktails. It features multi-bar inventory tracking, curated menus, and personalized user experiences, all wrapped in an elegant, responsive interface.

<!-- 
**Visual Placeholder:** 
Imagine a stylish banner image here, or a couple of high-quality screenshots showcasing the app's dark theme and key features.
-->

## ✨ Features

*   **Browse Cocktails:** Explore drinks by categories.
*   **Detailed Recipes:** View comprehensive cocktail details including photo, ingredients, step-by-step instructions, glass type, difficulty, and history.
*   **Bar-Specific Views:** Navigate dedicated "corners" for Bar A and Bar B, showing cocktails makeable with their specific inventory.
*   **Multi-Bar Availability Icons:** Quickly see if a cocktail is available in Bar A and/or Bar B directly from list items and detail pages.
*   **Dynamic Image Loading:** Smoothly loads all cocktail and category images.
*   **Favorites:** Mark and manage your favorite cocktails (persisted in Local Storage).
*   **Surprise Me!:** Get a random cocktail suggestion (functionality present in `FilterSidebar`, adaptable to other areas).
*   **Curated Menus:** (Conceptual/Data Structure) Support for bar-specific curated menus.
*   **Clickable Details:** Discover related cocktails by clicking on tags, flavors, or glass types on a cocktail's detail page.
*   **Classy Dark Theme:** A sophisticated, custom dark theme implemented for an elegant user experience. Light theme has been removed for consistency.
*   **Fully Responsive Design:** Adapts seamlessly to various screen sizes, from mobile to desktop, with a mobile-first approach in mind.
*   **UX Enhancements:** Includes subtle page transitions, a "Back to Top" button, and improved empty state displays.
*   **Accessibility Considerations:** ARIA attributes, focus management, and contrast checks have been implemented.

<!-- 
**Screenshots Placeholder:** 
- Screenshot of HomePage (Cocktail of the Week, Categories)
- Screenshot of Cocktail Detail Page
- Screenshot of Bar Specific Page
-->

## 🛠️ Tech Stack

*   **Framework:** [React](https://react.dev/) (v19)
*   **Routing:** [React Router](https://reactrouter.com/) (v6)
*   **Styling:** [Styled Components](https://styled-components.com/)
*   **State Management:** React Context API
*   **Development/Build Tool:** [Vite](https://vitejs.dev/)
*   **Linting:** [ESLint](https://eslint.org/)
*   **Testing:** [Vitest](https://vitest.dev/) (with React Testing Library)
*   **Data Format:** JSON for all cocktail, category, and bar stock information.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   **Node.js:** Version 18.x or later recommended.
*   **npm:** Version 9.x or later (or Yarn equivalent).

You can check your Node.js and npm versions by running:
```bash
node -v
npm -v
```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/baronvonbirra/barcraft.git 
    # Replace with your actual repository URL if different
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd barcraft
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    # or if you prefer yarn:
    # yarn install
    ```

4.  **Environment Variables:**
    Currently, no environment variables (`.env` file) are needed to run this project.

5.  **Running the Development Server:**
    ```bash
    npm run dev
    # or if you prefer yarn:
    # yarn dev
    ```
    This will start the Vite development server. By default, the application should be available at **http://localhost:5173** (Vite's default port, but check your terminal output).

## 📂 Project Structure

A brief overview of the main source code directories:

```
barcraft/
├── public/              # Static assets (e.g., favicon in root, index.html)
├── src/
│   ├── assets/          # Images, icons, etc.
│   ├── components/      # Reusable UI components (Button, Card, Navbar, etc.)
│   ├── contexts/        # React Context API providers (ThemeContext, BarContext, etc.)
│   ├── data/            # JSON data files (cocktails, categories, bar stocks)
│   ├── hooks/           # Custom React Hooks (useFavorites, useCocktailFilter)
│   ├── pages/           # Page-level components (HomePage, CocktailPage, etc.)
│   ├── styles/          # Global styles, theme definitions (GlobalStyles.js)
│   ├── utils/           # Utility functions (e.g., cocktailImageLoader.js)
│   ├── App.jsx          # Main application component, routing setup
│   └── main.jsx         # Entry point of the application
├── .eslintrc.cjs        # ESLint configuration
├── index.html           # Main HTML template (managed by Vite)
├── package.json         # Project metadata, dependencies, and scripts
├── README.md            # This file
├── vite.config.js       # Vite configuration
└── vitest.config.js     # Vitest configuration
```

## 📜 Available Scripts

In the project directory, you can run the following scripts:

*   **`npm run dev`** or **`yarn dev`**
    Runs the app in development mode with hot module replacement.
    Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.

*   **`npm run build`** or **`yarn build`**
    Builds the app for production to the `dist` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.

*   **`npm run lint`** or **`yarn lint`**
    Runs ESLint to analyze the code for potential errors and style issues.

*   **`npm run preview`** or **`yarn preview`**
    Serves the production build from the `dist` folder locally. This is a good way to check the production build before deploying.

*   **`npm test`** or **`yarn test`**
    Launches the Vitest test runner in interactive watch mode.

*   **`npm run deploy`** or **`yarn deploy`**
    Builds the project and deploys it to GitHub Pages (requires `gh-pages` setup).

## 📊 Data Source

All cocktail recipes, category information, bar-specific stock levels, and curated menu details are currently managed via local JSON files located in the `src/data/` directory. This includes:
*   `cocktails.json`
*   `categories.json`
*   `bar1_stock.json`
*   `bar2_stock.json`
*   `bar_specific_data.json`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please feel free to check the [issues page](https://github.com/baronvonbirra/barcraft/issues) of the repository.

## 📝 License

Distributed under the MIT License. See `LICENSE` file for more information (assuming a `LICENSE` file with MIT content will be added to the repository).
```
