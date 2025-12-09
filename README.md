# Laravel Universal CRUD for React & Shadcn/UI

[![Latest Version on Packagist](https://img.shields.io/packagist/v/amaraa019/laravel-universal-crud.svg?style=flat-square)](https://packagist.org/packages/amaraa019/laravel-universal-crud)
[![Total Downloads](https://img.shields.io/packagist/dt/amaraa019/laravel-universal-crud.svg?style=flat-square)](https://packagist.org/packages/amaraa019/laravel-universal-crud)

Laravel 10, 11, 12-т зориулсан, Breeze (React) орчинд ажиллах, бүх төрлийн CRUD үйлдлийг хялбархан үүсгэх боломжийг олгодог сан. Энэхүү сан нь [Shadcn/UI](https://ui.shadcn.com/) болон [TanStack Table](https://tanstack.com/table/v8)-г ашиглан орчин үеийн, хэрэглэгчид ээлтэй интерфэйсийг бий болгодог.

## 🌟 Онцлог шинж чанарууд

- **Бүрэн CRUD үйлдэл**: Өгөгдөл нэмэх, харах, засах, устгах үйлдлийг хялбархан тохируулах.
- **Сервер талын боловсруулалт**: Laravel Pagination-тай бүрэн уялдаж, хуудаслалт, шүүлт, эрэмбэлэлтийг сервер талд хийнэ.
- **Баялаг Форм**: Текст, тоо, нууц үг, и-мэйл, сонголт (select), boolean (switch), текст талбар (textarea), зураг, rich text editor зэрэг олон төрлийн талбарыг дэмжинэ.
- **Зураг хуулах**: Form болон Rich Text Editor дотор зураг хуулах, удирдах боломжтой.
- **Excel экспорт**: Хүснэгтийн өгөгдлийг нэг товч дараад Excel файл руу экспортлох.
- **Олон хэлний дэмжлэг**: Орчуулгын файлыг удирдах хялбар системтэй (Монгол, Англи хэлний бэлэн орчуулгатай).
- **Хялбар суулгац**: Artisan командаар бүх шаардлагатай файл, тохиргоог автоматаар гүйцэтгэнэ.
- **Уян хатан тохиргоо**: `props`-оор дамжуулан компонентийн ажиллагаа, харагдах байдлыг өргөн хүрээнд өөрчлөх боломжтой.

---

## 📋 Шаардлага

- PHP `^8.1`
- Laravel `^10.0 | ^11.0 | ^12.0`
- Laravel Breeze (React preset)
- Node.js & NPM

---

## 🚀 Суулгах заавар

Дараах алхмуудыг дагаж `universal-crud` санг төсөлдөө суулгана уу.

### Алхам 1: Composer-оор сан суулгах

Терминал дээр дараах командыг ажиллуулна уу:

```bash
composer require amaraa019/laravel-universal-crud
```

### Алхам 2: Artisan install команд ажиллуулах

Энэ команд нь шаардлагатай бүх тохиргоог автоматаар хийх болно.

```bash
php artisan universal-crud:install
```

Энэ команд дараах үйлдлүүдийг гүйцэтгэнэ:
- React компонент болон бусад файлуудыг (`UniversalCrud.jsx`, `api.js`, `lang/` г.м) таны `resources/js/` хавтас руу хуулна (publish).
- Шаардлагатай NPM багцуудыг таны `package.json` файлд автоматаар нэмнэ.

### Алхам 3: NPM багцуудыг суулгах

Дээрх командын дараа `package.json` файлд нэмэгдсэн шинэ багцуудыг суулгана уу.

> **Тайлбар:** `universal-crud:install` команд нь таны `package.json` файлд `UniversalCrud` компонент болон түүний хамааралтай багцууд болох `react-table`, `lucide-react`, `sonner`, `ckeditor5` зэргийг автоматаар нэмнэ.

```bash
npm install
```

### Алхам 4: Shadcn/UI тохируулах

Энэ сан нь `shadcn/ui`-ийн компонентуудыг ашигладаг тул таны төсөлд тохируулах шаардлагатай.

**1. Shadcn/UI-г эхлүүлэх (init):**

Хэрэв таны төсөлд `shadcn/ui` тохируулагдаагүй бол дараах командыг ажиллуулна уу.

```bash
npx shadcn@latest init
```

Энэ үед танаас хэд хэдэн асуулт асуух бөгөөд дараах байдлаар хариулахыг зөвлөж байна:

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

**2. Шаардлагатай компонентуудыг нэмэх:**

`universal-crud` сан нь дараах `shadcn/ui` компонентуудаас хамаарна:

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

Дараах командыг ажиллуулж эдгээр компонентийг нэг дор суулгана уу.

```bash
npx shadcn@latest add button input select table dialog alert-dialog skeleton card label switch textarea collapsible
```

### Алхам 5: .env файл тохируулах

Төслийнхөө `.env` файлыг нээж, API-ийн үндсэн хаягийг зааж өгнө үү.

```
VITE_API_URL="${APP_URL}/api"
```

### Алхам 6: Development сервер ажиллуулах

Бүх тохиргоог хийж дууссаны дараа development серверийг ажиллуулна уу.

```bash
npm run dev
```

Ингээд та `UniversalCrud` компонентийг ашиглахад бэлэн боллоо!

---

## 📖 Хэрэглээ

### 1. Backend тохиргоо (Controller & Route)

**Controller:**

`UniversalCrud` компонент нь Laravel-ийн стандарт `Resource Controller`-той хамтран ажиллахад зориулагдсан. Controller доторх `index`, `store`, `update`, `destroy` методууд нь JSON хариу буцаах ёстой.

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
     * Хүснэгтийн өгөгдлийг авч, хуудсыг харуулах
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Нэрээр шүүх жишээ
        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        // И-мэйлээр шүүх жишээ
        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        $data = $query->paginate($request->input('limit', 10));

        // Хэрэв хүсэлт нь AJAX (JSON) бол зөвхөн өгөгдлийг буцаана
        if ($request->wantsJson()) {
            return response()->json($data);
        }

        // Энгийн вэб хүсэлт бол Inertia хуудсыг рендер хийнэ
        return Inertia::render('Users/Index', [
            'dt' => $data // Анхны өгөгдлийг дамжуулах
        ]);
    }

    /**
     * Шинэ өгөгдөл хадгалах (Create)
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
     * Одоо байгаа өгөгдлийг шинэчлэх (Update)
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8', // Нууц үг заавал шаардлагагүй
        ]);

        // Хэрэв нууц үг илгээгдсэн бол шинэчилнэ
        if ($request->filled('password')) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json(['message' => 'success'], 200); // 200 OK
    }

    /**
     * Өгөгдлийг устгах (Delete)
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'success'], 200); // 200 OK
    }
}
```

**Route:**

`routes/web.php` болон `routes/api.php` файлуудад дараах замуудыг тодорхойлно. Энэхүү сан нь нэгдсэн `Resource Controller` ашиглах тул `web.php` дотор бүх замыг тодорхойлж өгөх нь илүү хялбар байдаг.

```php
// routes/web.php
use App\Http\Controllers\UserController;

// Энэ нь index, store, update, destroy зэрэг бүх шаардлагатай замыг үүсгэнэ.
Route::resource('users', UserController::class)->middleware(['auth', 'verified']);
```

### 2. Frontend тохиргоо (React Page)

`resources/js/Pages/Users/Index.jsx` гэсэн файл үүсгэж, дотор нь `UniversalCrud` компонентийг ашиглана.

```jsx
// resources/js/Pages/Users/Index.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UniversalCrud from '@/components/UniversalCrud'; // Импорт хийх
import { Head } from '@inertiajs/react';

export default function Index({ auth, dt }) {

    // Хүснэгтийн багануудыг тодорхойлох
    const attributes = [
        { label: "ID", type: "id", display: ["id"] },
        { label: "Нэр", type: "text", display: ["name"] },
        { label: "И-мэйл", type: "email", display: ["email"] },
        { label: "Бүртгүүлсэн", type: "text", display: ["created_at"] },
    ];

    // Формын талбаруудыг тодорхойлох
    const form_attr = [
        { label: "Нэр", field: "name", type: "text", column: "col-span-6", value: "", required: true },
        { label: "И-мэйл", field: "email", type: "email", column: "col-span-6", value: "", required: true },
        { label: "Нууц үг", field: "password", type: "password", column: "col-span-6", value: "", required: false }, // Засах үед нууц үг заавал шаардлагагүй
    ];

    // Шүүлтийн талбаруудыг тодорхойлох
    const filters = [
        { label: "Нэрээр шүүх", field: "name", type: "text", value: "" },
        { label: "И-мэйлээр шүүх", field: "email", type: "text", value: "" },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Хэрэглэгчид</h2>}
        >
            <Head title="Хэрэглэгчид" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <UniversalCrud
                        auth={auth}
                        dt={dt} // Controller-оос дамжуулсан анхны өгөгдөл
                        api_link="/users" // API endpoint
                        attributes={attributes}
                        form_attr={form_attr}
                        filters={filters}
                        subject="Хэрэглэгч"
                        modes={["add", "edit", "delete", "export"]} // Идэвхжүүлэх үйлдлүүд
                        methods={{ update: "post" }} // Laravel-д PUT ажиллахгүй бол POST ашиглах
                        dev={false} // Хөгжүүлэлтийн мэдээлэл харуулах эсэх
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
```

### `UniversalCrud` Компонентийн Props

| Prop | Төрөл | Тайлбар |
| :--- | :--- | :--- |
| `api_link` | `string` | **(Шаардлагатай)** CRUD үйлдлүүдийг гүйцэтгэх API-ийн үндсэн зам. Жишээ: `/users`. |
| `dt` | `object` | **(Шаардлагатай)** Controller-оос `Inertia::render`-ээр дамжуулсан анхны өгөгдөл. |
| `attributes` | `array` | **(Шаардлагатай)** Хүснэгтийн багана, харагдах байдлыг тодорхойлох объектуудын массив. |
| `form_attr` | `array` | **(Шаардлагатай)** Нэмэх/Засах формын талбаруудыг тодорхойлох объектуудын массив. |
| `subject` | `string` | **(Шаардлагатай)** Тухайн CRUD-ийн нэр. Жишээ: "Хэрэглэгч". Орчуулгад ашиглагдана. |
| `filters` | `array` | Шүүлтийн талбаруудыг тодорхойлох объектуудын массив. |
| `modes` | `array` | Идэвхжүүлэх үйлдлүүдийн жагсаалт. Боломжит утгууд: `add`, `edit`, `delete`, `export`. |
| `methods` | `object` | Засах үйлдэл `PUT` биш `POST` байх тохиолдолд ашиглана. Жишээ: `{ update: "post" }`. |
| `transformInitialData` | `function` | Засах үед формын анхны өгөгдлийг сервер рүү илгээхээс өмнө өөрчлөх функц. `(data) => transformedData` |
| `transformFormData` | `function` | Формын өгөгдлийг сервер рүү илгээхээс өмнө өөрчлөх функц. `(formData) => transformedFormData` |
| `auth` | `object` | Inertia-аас ирэх `auth` объект. |
| `lang` | `string` | Компонентийн хэлийг тохируулна. Боломжит утга: `mn`, `en`. (Анхдагч: `mn`) |
| `showLangSwitcher` | `boolean` | `true` байвал хэл солих товчлуурыг харуулна. (Анхдагч: `false`) |
| `lmt` | `number` | Нэг хуудсанд харуулах мөрийн тооны анхдагч утга. (Default: `10`) |
| `formSize` | `string` | Формын цонхны өргөн. Жишээ: `w-[1080px]`. (Default: `w-[1080px]`) |
| `buttons` | `ReactNode` | Хүснэгтийн толгой хэсэгт нэмэлт товчлуур, компонент оруулах функц. |
| `actions` | `ReactNode` | Хүснэгтийн мөр бүрийн "Үйлдэл" баганад нэмэлт товчлуур, компонент оруулах функц. |
| `dev` | `boolean` | `true` байвал формын доорх `state` мэдээллийг харуулна. (Default: `false`) |

#### `attributes` prop-ийн дэлгэрэнгүй тайлбар

Энэ prop нь хүснэгтийн багана бүрийг тодорхойлно. Багана бүр нь дараах шинж чанартай объект байна:

| Шинж чанар | Төрөл | Тайлбар |
| :--- | :--- | :--- |
| `label` | `string` | Хүснэгтийн толгой дээр харагдах нэр. |
| `display` | `array` | **(Маш чухал)** Өгөгдлийн объектоос ямар утгуудыг харуулахыг заана. Эхний утга нь эрэмбэлэлтэд ашиглагдана (`accessorKey`). |
| `type` | `string` | Утгыг хэрхэн харуулахыг заана. Боломжит утгууд: `text`, `id`, `email`, `image`, `boolean`, `money`, `enum`, `status`. |
| `relation` | `string` | Хэрэв өгөгдөл нь Laravel-ийн relation-оор холбогдсон бол тэрхүү relation-ийн нэрийг заана. Цэгээр зааглан гүн рүү хандах боломжтой (`user.profile`). |
| `hidden` | `boolean` | `true` байвал хүснэгтэд харуулахгүй. |
| `preview` | `boolean` | `type: "image"` үед ашиглана. `true` байвал зураг дээр дарахад томруулж хардаг (Lightbox) болно. |
| `imageFallback` | `string` | `type: "image"` үед ашиглана. Зургийн зам буруу эсвэл зураг байхгүй үед харуулах анхдагч зургийн зам. Жишээ: `/images/placeholder.png`. |
| `toggle` | `boolean` | `type: "boolean"` үед ашиглана. `true` байвал "Тийм/Үгүй" гэсэн бичгийн оронд `Switch` компонент харуулна. |
| `values` | `array` / `object` | `type: "enum"` үед ашиглана. Серверээс ирсэн утгыг (жишээ нь: 0, 1) харгалзах текст рүү хөрвүүлнэ. Жишээ: `["Хүлээгдэж буй", "Баталгаажсан"]`. |

**`display` prop-ийн жишээнүүд:**

1.  **Энгийн харуулалт:**
    ```javascript
    // "name" баганад `user.name`-ийг харуулна.
    { label: "Нэр", type: "text", display: ["name"] }
    ```

2.  **Олон утга залгаж харуулах:**
    ```javascript
    // "Овог Нэр" баганад `user.last_name` болон `user.first_name`-ийг хоосон зай аван залгаж харуулна.
    { label: "Овог Нэр", type: "text", display: ["last_name", "first_name"] }
    ```

3.  **Relation-оос утга харуулах:**
    ```javascript
    // Хэрэглэгчийн мэдээлэл `user` relation-оор орж ирдэг гэж үзье.
    // "Хэрэглэгч" баганад `order.user.name`-ийг харуулна.
    { label: "Хэрэглэгч", type: "text", display: ["name"], relation: "user" }
    ```

4.  **Гүн relation-оос утга харуулах:**
    ```javascript
    // "Профайл зураг" баганад `order.user.profile.avatar`-г харуулна.
    { label: "Профайл зураг", type: "image", display: ["avatar"], relation: "user.profile" }
    ```
5.  **Зураг томруулж харах (Lightbox):**
    ```javascript
    // "Зураг" баганад `product.image_url`-г харуулна.
    // `preview: true` гэж зааснаар зураг дээр дарахад томруулж харах боломжтой болно.
    { label: "Зураг", type: "image", display: ["image_url"], preview: true, imageFallback: "/img/no-image.jpg" }
    ```

#### `Buttons`, `Actions`, `transformInitialData` болон `transformFormData` prop-ийн дэлгэрэнгүй тайлбар

Эдгээр пропууд нь компонентийн стандарт үйлдлүүд дээр нэмэлт, өөрийн гэсэн товчлуур, логикийг нэмэх боломжийг олгодог.

**1. `buttons` prop-ийн жишээ**

Хүснэгтийн толгой хэсэгт нэмэлт товчлуур нэмэх. Энэ компонент нь `data`, `setData`, `load` гэсэн пропуудыг хүлээн авна.

```jsx
// Users/Index.jsx дотор

const CustomHeaderButtons = ({ data, load }) => {
    const handleCustomAction = () => {
        alert(`Нийт ${data.length} хэрэглэгч байна.`);
    };

    return (
        <Button variant="outline" onClick={handleCustomAction}>
            Мэдээлэл харах
        </Button>
    );
};

// ...
<UniversalCrud
    {...otherProps}
    buttons={CustomHeaderButtons}
/>
```

**2. `actions` prop-ийн жишээ**

Хүснэгтийн мөр бүрд "И-мэйл илгээх" гэсэн нэмэлт товчлуур нэмэх. Энэ компонент нь `item` (тухайн мөрийн өгөгдөл), `load` зэрэг пропуудыг хүлээн авна.

```jsx
// Users/Index.jsx дотор

const CustomRowActions = ({ item }) => {
    const sendEmail = () => {
        alert(`${item.email} хаяг руу и-мэйл илгээлээ.`);
    };

    return (
        <Button variant="secondary" size="sm" onClick={sendEmail} title="И-мэйл илгээх">
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

**3. `transformInitialData` болон `transformFormData` prop-ийн жишээ**

Серверээс ирсэн `settings` гэх JSON талбарыг форм дээр задгай харуулж, буцааж илгээхдээ нэгтгэх жишээ.

```jsx
// Controller дээр User модел нь 'settings' гэсэн JSON талбартай гэж үзье.
// $user->settings = ['theme' => 'dark', 'notifications' => true];

// Users/Index.jsx дотор

// Формын талбарууд (settings-ийн талбаруудыг нэмж өгнө)
const form_attr = [
    { label: "Нэр", field: "name", type: "text", column: "col-span-12", required: true },
    { type: "section_header", label: "Тохиргоо", column: "col-span-12" }, // Хэсгийн гарчиг
    { label: "Хэрэглэгчийн нэр", field: "username", type: "text", column: "col-span-6" },
    { label: "Идэвхтэй эсэх", field: "active", type: "boolean", column: "col-span-6" },
];

// Серверээс ирсэн өгөгдлийг формд оруулахын өмнө өөрчлөх
const handleTransformInitialData = (data) => {
    const settings = data.settings || {}; // 'settings' байхгүй бол хоосон объект
    return {
        ...data,
        username: settings.username || '',
        active: settings.active ?? 1, // Анхдагч утга
    };
};

// Формын өгөгдлийг сервер лүү илгээхийн өмнө өөрчлөх
const handleTransformFormData = (formData) => {
    const { username, active, ...rest } = formData;
    return {
        ...rest, // name, email, password г.м бусад талбарууд
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

## 📄 Лиценз

Энэхүү сан нь MIT лиценз-ийн дор тараагдана.

---

## 👨‍💻 Хөгжүүлэгч

- **Амартүвшин**
- И-мэйл: amaraa019@gmail.com
- GitHub: @amaraa019