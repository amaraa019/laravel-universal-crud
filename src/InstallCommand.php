<?php

namespace Amaraa019\UniversalCrud;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class InstallCommand extends Command
{
    protected $signature = 'universal-crud:install';
    protected $description = 'Install all of the Universal CRUD resources';

    public function handle()
    {
        $this->info('🚀 Universal CRUD-г суулгаж байна...');

        // 1. Publish vendor assets
        $this->comment('Тохиргоо болон компонент файлуудыг publish хийж байна...');
        $this->call('vendor:publish', ['--provider' => 'Amaraa019\UniversalCrud\UniversalCrudProvider', '--force' => true]);

        // 2. Update package.json
        $this->updateNodeDependencies();

        $this->line('');
        $this->info('✅ Universal CRUD амжилттай суулаа!');
        $this->comment('Дараагийн алхмууд:');
        $this->comment('1. "npm install" командыг ажиллуулж, шинээр нэмэгдсэн багцуудыг суулгана уу.');
        $this->comment('2. "npm run dev" командыг ажиллуулж, asset-уудаа build хийнэ үү.');
        $this->comment('3. Шаардлагатай shadcn/ui компонентуудыг суулгана уу: npx shadcn-ui@latest add ...');

        return self::SUCCESS;
    }

    /**
     * Update the "package.json" file with the required dependencies.
     */
    protected function updateNodeDependencies()
    {
        if (! file_exists(base_path('package.json'))) {
            return;
        }

        $this->comment('package.json файлыг шинэчилж байна...');

        $packages = [
            "@tanstack/react-table" => "^8.17.3",
            "lucide-react" => "^0.395.0",
            "react-dropzone" => "^14.2.3",
            "react-datepicker" => "^7.2.0",
            "date-fns" => "^3.6.0",
            "xlsx" => "^0.18.5",
            "file-saver" => "^2.0.5",
            "yet-another-react-lightbox" => "^3.20.0",
            "@ckeditor/ckeditor5-react" => "^8.0.0",
//            "ckeditor5-custom-build" => "file:./ckeditor5", // Жишээ, хэрэглэгч өөрөө тохируулна
            "axios" => "^1.7.2",
            "sonner" => "^1.5.0"
        ];

        $this->updateNodePackages(function ($dependencies) use ($packages) {
            return $packages + $dependencies;
        });
    }

    /**
     * Update the "package.json" file.
     *
     * @param  callable  $callback
     * @param  bool  $dev
     * @return void
     */
    protected static function updateNodePackages(callable $callback, $dev = true)
    {
        if (! file_exists(base_path('package.json'))) {
            return;
        }

        $configurationKey = $dev ? 'devDependencies' : 'dependencies';

        $packages = json_decode(file_get_contents(base_path('package.json')), true);

        $packages[$configurationKey] = $callback(
            array_key_exists($configurationKey, $packages) ? $packages[$configurationKey] : [],
            $configurationKey
        );

        ksort($packages[$configurationKey]);

        file_put_contents(
            base_path('package.json'),
            json_encode($packages, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT).PHP_EOL
        );
    }
}