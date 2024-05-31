
<script>
    
    export let project_structure;
    export let classes;

    let active_tabs = project_structure['children'][0]['sprint']
</script>


<div class="md:flex {classes}">
    <ul class="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
        
        {#each project_structure['children'] as sprint, idx}
            <li>
                <a on:click={() => {active_tabs = sprint['sprint']}} href="#" class="inline-flex items-center px-4 py-3 text-gray {sprint['sprint'] == active_tabs ? 'bg-main' : 'bg-light'} rounded-lg active w-28 dark:bg-blue-600">
                    {sprint['sprint']}
                </a>
            </li>
        {/each}
    </ul>

    {#each project_structure['children'] as sprint, idx}
        <div class="{active_tabs == sprint['sprint'] ? '' : 'hidden'} p-6 bg-light text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{sprint['sprint']}</h3>
            <p class="mb-2">{sprint['description']}</p>
            <ul class="ps-5 mt-2 space-y-1 list-disc list-inside">
                {#each sprint['children'] as episode, idx}
                    <li>{episode['episode']}</li>
                    <ul class="ps-5 mt-2 space-y-1 list-[circle] list-inside">
                        {#each episode['children'] as step, idx}
                        <li>{step['step']}</li>
                        {/each}
                    </ul>
                {/each}
            </ul>
        </div>
    {/each}
</div>

