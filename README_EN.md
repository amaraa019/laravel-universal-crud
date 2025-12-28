# Laravel Universal CRUD for React & Shadcn/UI

[![Latest Version on Packagist](https://img.shields.io/packagist/v/amaraa019/laravel-universal-crud.svg?style=flat-square)](https://packagist.org/packages/amaraa019/laravel-universal-crud)
[![Total Downloads](https://img.shields.io/packagist/dt/amaraa019/laravel-universal-crud.svg?style=flat-square)](https://packagist.org/packages/amaraa019/laravel-universal-crud)

A package for Laravel 10, 11, and 12 that allows you to easily create all types of CRUD operations in a Breeze (React) environment. This package uses [Shadcn/UI](https://ui.shadcn.com/) and [TanStack Table](https://tanstack.com/table/v8) to create a modern, user-friendly interface.

## 🌟 Features

- **Full CRUD Operations**: Easily configure add, view, edit, and delete operations.
- **Server-Side Processing**: Fully integrates with Laravel Pagination to handle pagination, filtering, and sorting on the server side.
- **Rich Forms**: Supports various field types such as text, number, password, email, select, boolean (switch), textarea, image, and a rich text editor.
- **Image Upload**: Supports image uploads within both forms and the rich text editor.
- **Excel Export**: Export table data to an Excel file with a single click.
- **Multi-language Support**: An easy-to-manage translation system (with ready-made Mongolian and English translations).
- **Easy Installation**: Automatically performs all necessary file and configuration setups with an Artisan command.
- **Flexible Configuration**: A wide range of customization for component behavior and appearance is available through `props`.

---

## 📋 Requirements

- PHP `^8.1`
- Laravel `^10.0 | ^11.0 | ^12.0`
- Laravel Breeze (React preset)
- Node.js & NPM

---

## 🚀 Installation Guide

Follow these steps to install the `universal-crud` package in your project.

### Step 1: Install the package via Composer

Run the following command in your terminal:

```bash
composer require amaraa019/laravel-universal-crud
```

### Step 2: Run the Artisan install command

This command will automatically handle all necessary configurations.

```bash
php artisan universal-crud:install
```

This command performs the following actions:
- Publishes the React component and other files (`UniversalCrud.jsx`, `api.js`, `lang/`, etc.) to your `resources/js/` directory.
- Automatically adds the required NPM packages to your `package.json` file.

### Step 3: Install NPM packages

After the above command, install the new packages added to your `package.json` file.

> **Note:** The `universal-crud:install` command automatically adds the `UniversalCrud` component and its dependencies, such as `react-table`, `lucide-react`, `sonner`, and `ckeditor5`, to your `package.json`.

```bash
npm install
```

### Step 4: Configure Shadcn/UI

This package uses `shadcn/ui` components, so you need to set it up in your project.

**1. Initialize Shadcn/UI:**

If `shadcn/ui` is not already configured in your project, run the following command.

```bash
npx shadcn@latest init
```

You will be asked a few questions. We recommend the following answers:

```
Would you like to use TypeScript (recommended)? no / yes
Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Where is your global CSS file? › resources/css/app.css
Do you want to use CSS variables for colors? › yes
Where is your tailwind.config.js located? › tailwind.config.js
Configure the import alias for components: › @/components
Configure the import alias for utils: › @/lib/utils
Are you using React Server Components? › no
Write configuration to components.json. Proceed? › yes
```

**2. Add the required components:**

The `universal-crud` package depends on the following `shadcn/ui` components:

- `button`
- `input`
- `select`
- `table`
- `dialog`
- `alert-dialog`
- `skeleton`
- `card`
- `label`
- `switch`
- `textarea`
- `collapsible`

Run the following command to install all these components at once.

```bash
npx shadcn@latest add button input select table dialog alert-dialog skeleton card label switch textarea collapsible
```

### Step 5: Configure the .env file

Open your project's `.env` file and set the base URL for your API.

```
VITE_API_URL="${APP_URL}/api"
```

### Step 6: Run the development server

After completing all configurations, run the development server.

```bash
npm run dev
```

Now you are ready to use the `UniversalCrud` component!

---

## 📖 Usage

### 1. Backend Setup (Controller & Route)

**Controller:**

The `UniversalCrud` component is designed to work with a standard Laravel `Resource Controller`. The `index`, `store`, `update`, and `destroy` methods in the controller must return a JSON response.

```php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource and render the page.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Example of filtering by name
        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        // Example of filtering by email
        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        $data = $query->paginate($request->input('limit', 10));

        // If the request is an AJAX (JSON) request, return only the data
        if ($request->wantsJson()) {
            return response()->json($data);
        }

        // For a normal web request, render the Inertia page
        return Inertia::render('Users/Index', [
            'dt' => $data // Pass initial data
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        User::create($validated);

        return response()->json(['message' => 'success'], 201); // 201 Created
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8', // Password is not required for updates
        ]);

        // If a password is provided, update it
        if ($request->filled('password')) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json(['message' => 'success'], 200); // 200 OK
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'success'], 200); // 200 OK
    }
}
```

**Route:**

Define the following routes in your `routes/web.php` and `routes/api.php` files. Since this package uses a unified `Resource Controller`, it's easier to define all routes in `web.php`.

```php
// routes/web.php
use App\Http\Controllers\UserController;

// This will create all the necessary routes like index, store, update, and destroy.
Route::resource('users', UserController::class)->middleware(['auth', 'verified']);
```

### 2. Frontend Setup (React Page)

Create a file at `resources/js/Pages/Users/Index.jsx` and use the `UniversalCrud` component inside it.

```jsx
// resources/js/Pages/Users/Index.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UniversalCrud from '@/components/UniversalCrud'; // Import the component
import { Head } from '@inertiajs/react';

export default function Index({ auth, dt }) {

    // Define the table columns
    const attributes = [
        { label: "ID", type: "id", display: ["id"] },
        { label: "Name", type: "text", display: ["name"] },
        { label: "Email", type: "email", display: ["email"] },
        { label: "Registered", type: "text", display: ["created_at"] },
    ];

    // Define the form fields
    const form_attr = [
        { label: "Name", field: "name", type: "text", column: "col-span-6", value: "", required: true },
        { label: "Email", field: "email", type: "email", column: "col-span-6", value: "", required: true },
        { label: "Password", field: "password", type: "password", column: "col-span-6", value: "", required: false }, // Password is not required for editing
    ];

    // Define the filter fields
    const filters = [
        { label: "Filter by Name", field: "name", type: "text", value: "" },
        { label: "Filter by Email", field: "email", type: "text", value: "" },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <UniversalCrud
                        auth={auth}
                        dt={dt} // Initial data passed from the controller
                        api_link="/users" // API endpoint
                        attributes={attributes}
                        form_attr={form_attr}
                        filters={filters}
                        subject="User"
                        modes={["add", "edit", "delete", "export"]} // Enabled actions
                        methods={{ update: "post" }} // Use POST for updates if PUT doesn't work in your environment
                        dev={false} // Show development information
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
```

### `UniversalCrud` Component Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `api_link` | `string` | **(Required)** The base path for the API to perform CRUD operations. Example: `/users`. |
| `dt` | `object` | **(Required)** The initial data passed from the controller via `Inertia::render`. |
| `attributes` | `array` | **(Required)** An array of objects defining the table columns and their appearance. |
| `form_attr` | `array` | **(Required)** An array of objects defining the fields for the add/edit form. |
| `subject` | `string` | **(Required)** The name of the CRUD entity. Example: "User". Used in translations. |
| `filters` | `array` | An array of objects defining the filter fields. |
| `modes` | `array` | A list of enabled actions. Possible values: `add`, `edit`, `delete`, `export`. |
| `methods` | `object` | Use this if the update action should be `POST` instead of `PUT`. Example: `{ update: "post" }`. |
| `transformInitialData` | `function` | A function to transform the initial data before it populates the form for editing. `(data) => transformedData` |
| `transformFormData` | `function` | A function to transform the form data before it is sent to the server. `(formData) => transformedFormData` |
| `auth` | `object` | The `auth` object from Inertia. |
| `lang` | `string` | Sets the component's language. Possible values: `mn`, `en`. (Default: `mn`) |
| `showLangSwitcher` | `boolean` | If `true`, shows a language switcher button. (Default: `false`) |
| `lmt` | `number` | The default number of rows to show per page. (Default: `10`) |
| `formSize` | `string` | The width of the form dialog. Example: `w-[1080px]`. (Default: `w-[1080px]`) |
| `buttons` | `ReactNode` | A function to add custom buttons or components to the table header. |
| `actions` | `ReactNode` | A function to add custom buttons or components to the "Actions" column of each table row. |
| `dev` | `boolean` | If `true`, shows the form's state information below the form. (Default: `false`) |

#### Detailed explanation of the `attributes` prop

This prop defines each column of the table. Each column is an object with the following properties:

| Property | Type | Description |
| :--- | :--- | :--- |
| `label` | `string` | The name to be displayed in the table header. |
| `display` | `array` | **(Very important)** Specifies which values from the data object to display. The first value is used for sorting (`accessorKey`). |
| `type` | `string` | Specifies how to display the value. Possible values: `text`, `id`, `email`, `image`, `boolean`, `money`, `enum`, `status`, `custom`. |
| `relation` | `string` | If the data is connected via a Laravel relation, specify the name of that relation. You can access nested relations using dot notation (`user.profile`). |
| `hidden` | `boolean` | If `true`, the column will not be displayed in the table. |
| `preview` | `boolean` | Used with `type: "image"`. If `true`, clicking the image will open it in a larger view (Lightbox). |
| `imageFallback` | `string` | Used with `type: "image"`. The path to a default image to show if the image path is incorrect or the image is missing. Example: `/images/placeholder.png`. |
| `toggle` | `boolean` | Used with `type: "boolean"`. If `true`, a `Switch` component is shown instead of "Yes/No" text. |
| `values` | `array` / `object` | Used with `type: "enum"`. Converts a value from the server (e.g., 0, 1) to its corresponding text. Example: `["Pending", "Confirmed"]`. |
| `render` | `function` | Used with `type: "custom"`. A function that returns a React component to be rendered in the cell. `(item) => ReactNode`. |
| `field` | `string` | Used with `type: "custom"`. If `display` is missing, this field is used to generate the column ID and key. |

**Examples of the `display` prop:**

1.  **Simple display:**
    ```javascript
    // Displays `user.name` in the "Name" column.
    { label: "Name", type: "text", display: ["name"] }
    ```

2.  **Concatenating multiple values:**
    ```javascript
    // Displays `user.last_name` and `user.first_name` concatenated with a space in the "Full Name" column.
    { label: "Full Name", type: "text", display: ["last_name", "first_name"] }
    ```

3.  **Displaying a value from a relation:**
    ```javascript
    // Assume user information comes from a `user` relation.
    // Displays `order.user.name` in the "User" column.
    { label: "User", type: "text", display: ["name"], relation: "user" }
    ```

4.  **Displaying a value from a nested relation:**
    ```javascript
    // Displays `order.user.profile.avatar` in the "Profile Picture" column.
    { label: "Profile Picture", type: "image", display: ["avatar"], relation: "user.profile" }
    ```
5.  **Image preview (Lightbox):**
    ```javascript
    // Displays `product.image_url` in the "Image" column.
    // Setting `preview: true` allows the image to be enlarged on click.
    { label: "Image", type: "image", display: ["image_url"], preview: true, imageFallback: "/img/no-image.jpg" }
    ```

6.  **Custom Component Render:**
    ```javascript
    // Example of displaying a badge using custom logic in the "Coupon" column.
    {
        field: 'coupon',
        label: 'Coupon',
        type: 'custom',
        render: (item) => {
            const coupon = item.orders && item.orders[0] && item.orders[0].coupon;
            if (coupon) {
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {coupon.code}
                    </span>
                );
            }
            return <span className="text-gray-400">-</span>;
        }
    }
    ```

#### Detailed explanation of the `Buttons`, `Actions`, `transformInitialData` and `transformFormData` props

These props allow you to add custom buttons and logic on top of the component's standard actions.

**1. Example of the `buttons` prop**

Add an extra button to the table header. This component receives `data`, `setData`, and `load` as props.

```jsx
// Inside Users/Index.jsx

const CustomHeaderButtons = ({ data, load }) => {
    const handleCustomAction = () => {
        alert(`There are a total of ${data.length} users.`);
    };

    return (
        <Button variant="outline" onClick={handleCustomAction}>
            Show Info
        </Button>
    );
};

// ...
<UniversalCrud
    {...otherProps}
    buttons={CustomHeaderButtons}
/>
```

**2. Example of the `actions` prop**

Add a "Send Email" button to each row of the table. This component receives `item` (the data for the current row) and `load` as props.

```jsx
// Inside Users/Index.jsx

const CustomRowActions = ({ item }) => {
    const sendEmail = () => {
        alert(`Sent an email to ${item.email}.`);
    };

    return (
        <Button variant="secondary" size="sm" onClick={sendEmail} title="Send Email">
            <Mail size={16} />
        </Button>
    );
};

// ...
<UniversalCrud
    {...otherProps}
    actions={CustomRowActions}
/>
```

**3. Example of `transformInitialData` and `transformFormData` props**

Example of unpacking a `settings` JSON field from the server to display in the form and then packing it back before sending.

```jsx
// Assume the User model in the controller has a 'settings' JSON field.
// $user->settings = ['theme' => 'dark', 'notifications' => true];

// Inside Users/Index.jsx

// Form fields (add fields for settings)
const form_attr = [
    { label: "Name", field: "name", type: "text", column: "col-span-12", required: true },
    { type: "section_header", label: "Settings", column: "col-span-12" }, // Section header
    { label: "Username", field: "username", type: "text", column: "col-span-6" },
    { label: "Is Active", field: "active", type: "boolean", column: "col-span-6" },
];

// Transform data from the server before populating the form
const handleTransformInitialData = (data) => {
    const settings = data.settings || {}; // Use an empty object if 'settings' is null
    return {
        ...data,
        username: settings.username || '',
        active: settings.active ?? 1, // Default value
    };
};

// Transform form data before sending it to the server
const handleTransformFormData = (formData) => {
    const { username, active, ...rest } = formData;
    return {
        ...rest, // Other fields like name, email, password
        settings: {
            username: username,
            active: active,
        },
    };
};

// ...
<UniversalCrud
    {...otherProps}
    form_attr={form_attr}
    transformInitialData={handleTransformInitialData}
    transformFormData={handleTransformFormData}
/>
```

---

## 📄 License

This package is distributed under the MIT License.

---

## 👨‍💻 Developer

- **Amartuvshin**
- Email: amaraa019@gmail.com
- GitHub: @amaraa019