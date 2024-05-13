<script>
    import { CodeBlock } from '@skeletonlabs/skeleton';
    import hljs from 'highlight.js/lib/core';

    import 'highlight.js/styles/github-dark.css';
    import python from 'highlight.js/lib/languages/python';
    import { storeHighlightJs } from '@skeletonlabs/skeleton';

    export let defaultClass = '';
    export let code = '';

    hljs.registerLanguage('python', python);
    storeHighlightJs.set(hljs);

</script>

<div class="h-full w-full {defaultClass}">
    <div class="bg-light-dark h-full w-full rounded-lg p-7">
        <div class="h-full overflow-y-auto rounded-lg">
            <CodeBlock language="python" code={code} />
        </div>
    </div>
</div>