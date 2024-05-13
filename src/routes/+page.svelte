<script>

    // stores
    import { master_agent } from './stores/MasterAgent.js';
    import { controller_agent } from './stores/ControllerAgent.js';
    import { worker_agent } from './stores/WorkerAgent.js';
    
    import { Search, Button, Modal } from 'flowbite-svelte';
    import CodingOutput from "./components/CodingOutput.svelte";
    import { CodeBlock } from '@skeletonlabs/skeleton';
    import Terminal from "./components/Terminal.svelte";

    // language available
    import hljs from 'highlight.js/lib/core';
    import 'highlight.js/styles/github-dark.css';
    import python from 'highlight.js/lib/languages/python';
    import shell from 'highlight.js/lib/languages/shell';
    import { storeHighlightJs } from '@skeletonlabs/skeleton';

    export let form;

    let prompt = ''
    let code = ''
    let clickOutsideModal = false

    hljs.registerLanguage('python', python);
    hljs.registerLanguage('shell', shell);
    storeHighlightJs.set(hljs);

    const submit_prompt = async () => 
    {        
        // Reset status
        master_agent.reset()
        controller_agent.reset()
        worker_agent.reset()

        // Set Goals
        await master_agent.define_obj(prompt) 
        await master_agent.define_flow()
        await master_agent.define_unit_test()

        // generate unit tests
        while ($controller_agent['unit_test_exec_status'][0] == false)
        {
            console.log('Generating Unit Tests...')
            await worker_agent.generate_unit_tests($master_agent['unit_tests'], $controller_agent['unit_test_exec_status'][1])
            await controller_agent.check_unit_test($worker_agent['unit_test_code'])
        }

        // generate code
        // while also test code unit test
        while ($controller_agent['unit_test_status'][0] == false) 
        {
            console.log('Generating Code....')
            while ($controller_agent['code_exec_status'][0] == false)
            {
                await worker_agent.generate_code($master_agent['program_flow'], $controller_agent['code_exec_status'][1], $master_agent['objectives'])
                await controller_agent.check_code($worker_agent['main_code'])
            }

            await controller_agent.test_code($worker_agent['main_code'], $worker_agent['unit_test_code'])
        }

        console.log($master_agent)
        console.log($worker_agent)
        console.log($controller_agent)
    }

</script>


<section class="flex w-full h-dvh z-4 space-x-7">
    <div class="min-h-full pt-[100px] pb-[40px] pl-20 w-[50%]">
        <div class="bg-light-dark h-full w-full rounded-lg relative">
            <div class="p-7">
                <!-- <Textarea id="textarea-id" placeholder="Overall code" rows="31" name="message" class="text-light bg-dark border border-light active:border-main focus:ring-0 outline-none focus:outline-none focus:border-main outline-none"/> -->
                <div class="max-h-[650px] overflow-y-auto rounded-lg">
                    <CodeBlock language="python" code={code} />
                </div>
            </div>
            <div class="flex items-center h-auto border-gray rounded-b-lg mx-auto absolute bottom-0 w-full p-7">   
                <label for="voice-search" class="sr-only">Search</label>
                <div class="relative w-full">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3">
                        <button class="cursor-pointer" type="button" on:click={() => (clickOutsideModal = true)}>
                            <svg class="w-4 h-4 text-light hover:text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2"/>
                            </svg>                  
                        </button>
                    </div>
                    <!-- <input bind:value="{inputs}" on:input={() => update_code()} type="text" id="voice-search" class="bg-dark border border-light active:border-main text-light text-sm rounded-lg focus:ring-0 outline-none focus:outline-none focus:border-main block w-full ps-10 p-2.5  placeholder-gray-400" placeholder="Prompt your command here..." required /> -->
                    <input bind:value={prompt} name="prompt"  type="text" id="voice-search" class="bg-dark border border-light active:border-main text-light text-sm rounded-lg focus:ring-0 outline-none focus:outline-none focus:border-main block w-full ps-10 p-2.5  placeholder-gray-400" placeholder="Prompt your command here..." required />
                    <button type="button" class="absolute inset-y-0 end-0 flex items-center pe-3">
                        <svg class="w-4 h-4 text-light dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"/>
                        </svg>
                    </button>
                </div>
                <button on:click={() => submit_prompt()} type="button" class="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-main rounded-lg border border-main  focus:ring-0 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg class="w-4 h-4 rotate-45 text-light-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 18-7 3 7-18 7 18-7-3Zm0 0v-5"/>
                    </svg>              
                </button>
            </div>
        </div>
    </div>
    <div class="flex h-[100%] flex-col w-[50%] pt-[100px] pb-[40px] pr-20 space-y-7">
        <CodingOutput defaultClass="h-[65%] max-h-[65%]" code={form?.code_output}/>
        <Terminal defaultClass="h-[35%] max-h-[35%]" error_message={form?.error_message}/>
    </div>
</section>


<Modal bind:open={clickOutsideModal} autoclose outsideclose size="xs" class="bg-light-dark border border-gray">
    <form class="flex flex-col space-y-8" action="#">
        <h3 class="mb-4 text-xl font-medium text-light">Prompt Setting</h3>
        
        <div>
            <div class="flex space-x-2 items-center mb-2">
                <label for="unit_test_1" class="block text-sm font-medium text-light">Unit Test</label>
                <button type="button">
                    <svg class="w-4 h-4 text-light hover:text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                    </svg>  
                </button>
            </div>

            <div class="flex space-x-3 items center justify-between relative">
                <input type="text" id="unit_test_1" class="bg-dark border border-light active:border-main text-light text-sm rounded-lg focus:ring-0 outline-none focus:outline-none focus:border-main block w-full p-2.5  placeholder-gray-400" placeholder="Insert your unit test here" required />
                <button type="submit" class="right-3 top-[50%] -translate-y-[50%] absolute inline-flex items-center ms-2 text-sm font-medium text-white rounded-lg focus:ring-0 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                    <svg class="w-4 h-4 text-light hover:text-red-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                    </svg>                                 
                </button>
            </div>
        </div>

        <div>
            <div class="flex space-x-2 items-center mb-2">
                <label for="constraint_1" class="block text-sm font-medium text-light">Constraints</label>
                <button type="button">
                    <svg class="w-4 h-4 text-light hover:text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                    </svg>  
                </button>
            </div>

            <div class="flex space-x-3 items center justify-between relative">
                <input type="text" id="constraint_1" class="bg-dark border border-light active:border-main text-light text-sm rounded-lg focus:ring-0 outline-none focus:outline-none focus:border-main block w-full p-2.5  placeholder-gray-400" placeholder="Insert your constraint here" required />
                <button type="submit" class="right-3 top-[50%] -translate-y-[50%] absolute inline-flex items-center ms-2 text-sm font-medium text-white rounded-lg focus:ring-0 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                    <svg class="w-4 h-4 text-light hover:text-red-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                    </svg>                                 
                </button>
            </div>
        </div>

        <div class="flex items-center justify-between">
            <div></div>
            <button class="mt-1 text-white w-auto bg-main  focus:ring-0 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1.5 text-center flex items-center justify-center dark:bg-blue-600 dark:hover:bg-[#4285F4] dark:focus:ring-blue-800 text-light-dark">
                Save
            </button>
        </div>
    </form>
</Modal>
