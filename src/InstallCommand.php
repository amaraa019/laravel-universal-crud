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
        $this->info('🚀 Installing Universal CRUD...');

        // 1. Publish vendor assets
        $this->comment('Publishing configuration and component files...');
        $this->call('vendor:publish', ['--provider' => 'Amaraa019\UniversalCrud\UniversalCrudProvider', '--force' => true]);

        // 2. Minify and overwrite the UniversalCrud.jsx component
        $this->minifyJsxComponent();

        // 3. Update package.json
        $this->updateNodeDependencies();

        $this->line('');
        $this->info('✅ Universal CRUD installed successfully!');
        $this->comment('Next steps:');
        $this->comment('1. Run "npm install" to install the new packages.');
        $this->comment('2. Run "npm run dev" to build your assets.');
        $this->comment('3. Install the required shadcn/ui components: npx shadcn@latest add ...');

        return self::SUCCESS;
    }

    /**
     * Minify the published UniversalCrud.jsx component.
     */
    protected function minifyJsxComponent()
    {
        $this->comment('Minifying UniversalCrud.jsx component...');

        $sourcePath = resource_path('js/components/UniversalCrud.jsx');

        if (!file_exists($sourcePath)) {
            $this->error('UniversalCrud.jsx not found after publishing. Skipping minification.');
            return;
        }

        $content = file_get_contents($sourcePath);

        // Basic minification: remove multi-line comments, single-line comments, and extra whitespace
        $content = preg_replace('!/\*.*?\*/!s', '', $content); // Remove multi-line comments
        $content = preg_replace('!//.*?!', '', $content);       // Remove single-line comments
        $content = preg_replace('/^\s*\n/m', '', $content);     // Remove empty lines
        $content = preg_replace('/\s+/', ' ', $content);        // Replace multiple spaces with a single space

        // Overwrite the file with minified content
        file_put_contents($sourcePath, $content);

        $this->info('UniversalCrud.jsx has been minified.');
    }


    /**
     * Update the "package.json" file with the required dependencies.
     */
    protected function updateNodeDependencies()
    {
        if (! file_exists(base_path('package.json'))) {
            return;
        }

        $this->comment('Updating package.json...');

        $packages = [
            "@tanstack/react-table" => "^8.17.3",
            "lucide-react" => "^0.395.0",
            "react-dropzone" => "^14.2.3",
            "react-datepicker" => "^7.2.0",
            "date-fns" => "^3.6.0",
            "xlsx" => "^0.18.5",
            "file-saver" => "^2.0.5",
            "yet-another-react-lightbox" => "^3.20.0",
            "axios" => "^1.7.2",
            "sonner" => "^1.5.0",
            "@editorjs/editorjs" => "^2.29.1",
            "@editorjs/header" => "^2.8.1",
            "@editorjs/list" => "^1.9.0",
            "@editorjs/image" => "^2.9.0",
            "@editorjs/quote" => "^2.6.0",
            "@editorjs/link" => "^2.6.2"
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