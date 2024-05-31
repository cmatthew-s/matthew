<script>
    import { CodeBlock } from '@skeletonlabs/skeleton';
    import hljs from 'highlight.js/lib/core';

    import 'highlight.js/styles/github-dark.css';
    import shell from 'highlight.js/lib/languages/shell';
    import { storeHighlightJs } from '@skeletonlabs/skeleton';

    export let defaultClass = '';
    export let error_message = ''

    hljs.registerLanguage('shell', shell);
    storeHighlightJs.set(hljs);
</script>

<div class="w-full h-full {defaultClass}">
    <div class="bg-light-dark h-full w-full rounded-lg p-7">
        <div class="h-full max-h-[185px] overflow-y-auto rounded-lg">
            <CodeBlock language="shell" code={error_message} />
        </div>
    </div>
</div>