# Setup

## Prerequisites

Install the following before running the project:

* **Node.js**
* **Rust**
* **Cargo**
* **Git**

You can verify your installation with:

```bash

node -v

npm -v

rustc --version

cargo --version

git --version

```

---

## Clone the Repository

```bash

git clone <repository-url>

cd <project-folder>

```

---

## Install Dependencies

Install all JavaScript dependencies:

```bash

npm install

```

This downloads everything listed in `package.json`, including:

* React
* Tailwind CSS
* React Router
* Tauri JavaScript API

The project also includes development dependencies used for building and documenting the application:

* **Vite** - React development server and build tool
* **JSDoc** - Generates frontend documentation
* **Babel Parser** - Allows JSDoc to parse JSX files

---

## Running the Application Start the Tauri desktop application

```bash

npm run tauri dev

```

This command:

* Starts the React development server
* Compiles the Rust backend
* Launches the desktop application

---

---

# Documentation

This project uses **JSDoc** to generate documentation for the React frontend.

JSDoc documents:

* React components
* Custom hooks
* Component props
* Frontend data flow between components

The generated documentation provides an overview of the React application's structure.

---

## Generating React Documentation

JSDoc is included as a development dependency in `package.json`.

Generate documentation using:

```bash
npm run docs
```

---

## Viewing Documentation

After generating the documentation, open:

```text
docs/index.html
```

in a web browser.

The generated documentation can be viewed locally without running the application.

---

## Updating Documentation

When React components or hooks are changed:

1. Update the JSDoc comments in the source files.
2. Generate the documentation again:

```bash
npm run docs
```

3. Refresh `docs/index.html` in the browser.

# Technologies Used:

## React

React is responsible for building the application's user interface.
Instead of manually updating HTML, React creates **components** that describe what the interface should look like based on the application's current data.

---

## Tauri

Tauri packages the React application as a native desktop application.
It consists of:

* **Frontend:** React (JavaScript)
* **Backend:** Rust

Whenever React needs to perform native operations (reading files, saving data, etc.), it sends commands to the Rust backend through Tauri.

---

## Tailwind CSS

Tailwind is a utility-first CSS framework.
Instead of writing CSS files like:

```css

button {
    background: blue;
    padding: 8px;

}

```

you style elements directly:

```tsx

<button className="bg-blue-500 px-4 py-2 rounded">
    Save
</button>

```

This keeps styling close to the component and avoids maintaining large CSS files.
Useful when paired with React.

---

### React Component

``` jsx
function Welcome() {
    return <h1>Hello</h1>;
}
```

Used inside another component:

``` jsx
function App() {
    return (
        <>
            <Welcome />
            <Welcome />
        </>
    );
}
```

Each `<Welcome />` creates its own copy of that interface.

---

### State

Components often store information using **state**.

``` jsx
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            Count: {count}
        </button>
    );
}
```

Whenever `setCount()` is called, React updates the component state and re-renders the interface using the new value.

---

### Props

Components can receive data from other components through **props**.

```jsx

function App() {
    const username = "John";
    return (
        <Profile name={username} />
    );
}

function Profile({ name }) {
    return (
        <h1>Welcome, {name}</h1>
    );
}

```
