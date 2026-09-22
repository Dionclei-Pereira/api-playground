<footer class="mt-3 container-fluid d-flex align-items-center flex-column gap-2">
    <div>
        <img data-url="{{ $githubUrl }}" id="github"
            src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"
            alt="GitHub">
    </div>
    <p class="text-center fs-6 fs-md-3 fs-lg-1">© 2026 Dionclei de Souza Pereira. All rights reserved.</p>
</footer>

@push('scripts')
    @vite(['resources/js/components/footer.ts'])
@endpush