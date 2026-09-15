<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class footer extends Component
{

    public string $githubUrl;

    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        $this->githubUrl = config('services.github.url');
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.footer', [
            'githubUrl' => $this->githubUrl,
        ]);
    }
}
