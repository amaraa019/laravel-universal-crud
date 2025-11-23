<?php

namespace Amaraa019\UniversalCrud;

use Illuminate\Support\ServiceProvider;

class UniversalCrudProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        if ($this->app->runningInConsole()) {
            // Artisan командыг бүртгэх
            $this->commands([
                InstallCommand::class,
            ]);

            // React компонентуудыг publish хийх
            $this->publishes([
                __DIR__ . '/resources/js/components' => resource_path('js/components/universal-crud'),
                __DIR__ . '/resources/js/utils' => resource_path('js/utils'),
                __DIR__ . '/resources/js/lang' => resource_path('js/lang'),
            ], 'universal-crud-assets');
        }
    }
}