import { writable } from 'svelte/store';

function createWorkerAgent() {

    let data = {
        "unit_test_code": '',
        'main_code': '',
    }

	const { subscribe, set, update } = writable(data);

	return {
		subscribe,
        generate_unit_tests: async (list_of_test, code_exec_error) => 
        {
            let command_data = {
                command: {
                    prompt: ''
                },
                settings: {
                    'path': '../../ai-tools/codellama/CodeLlama-7b-Instruct',
                    'file': '../../ai-tools/codellama/worker_agent.py',
                    'tokenizer_path': '../../ai-tools/codellama/CodeLlama-7b-Instruct/tokenizer.model',
                    'mp': 1,
                    'max_seq_len': 1500,
                    'max_batch_size': 5
                }
            }

            if (code_exec_error == '')
                command_data['command']['prompt'] = `Based on this list of unit test: '${list_of_test}'. Please generate a unit test python code utilizing the python library 'unittest', always set the exit parameter to false (so that they program will not exit after finished execution), and don't provide any explanation to the result of the prompt (code only) `
            else
                command_data['command']['prompt'] = `This is my list of unit test: \`\`\`${list_of_test}\`\`\`, however it has this error '${code_exec_error}'. Please fix it in python and still utilizing the 'unittest' library, always set the exit parameter to false (so that they program will not exit after finished execution), and plus don't provide any explanation to the result of the prompt (code only)`
            
            const response = await fetch('http://127.0.0.1:8406/generate_content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(command_data)
            })

            const result = await response.json()
            if ('error' in result)
            {
                console.log(`Error Found: ${result['error']}`)
                data['unit_test_code'] = ''
                set(data)
            }
            else
            {
                let code_block = result['result']
                if (result['result'].indexOf('```') !== -1)
                {
                    let main_code = result['result'].split(/```/)
                    code_block = ''
                    for (let i = 0; i < main_code.length; i++)
                    {
                        let item = main_code[i]
                        if (i % 2 != 0)
                        {
                            code_block += `${item}\n`
                        }
                    }
                }
                console.log(code_block)
                data['unit_test_code'] = code_block
                set(data)
            }
        },
        generate_code: async(program_flow, code_exec_error, objective='') => 
        {
            let command_data = {
                command: {
                    prompt: ''
                },
                settings: {
                    'path': '../../ai-tools/codellama/CodeLlama-7b-Instruct',
                    'file': '../../ai-tools/codellama/worker_agent.py',
                    'tokenizer_path': '../../ai-tools/codellama/CodeLlama-7b-Instruct/tokenizer.model',
                    'mp': 1,
                    'max_seq_len': 1500,
                    'max_batch_size': 1
                }
            }

            if (code_exec_error == '')
            {
                command_data['command']['prompt'] = `Based on this pseudocodes ${program_flow}, please generate a python code (code only, no other explanation) that fulfill this pseudocodes, plus consider the robustness of the code and call the function to run it!!`
            }
            else
            {
                command_data['command']['prompt'] = `Based on this objectives '${objective}' given by the user, please revised this code '${data['main_code']}', since it had this error '${code_exec_error}', plus consider the robustness of the code and call the function to run it!!`
            }

            const response = await fetch('http://127.0.0.1:8406/generate_content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(command_data)
            })
            const result = await response.json()
            if ('error' in result)
            {
                console.log(`Error Found: ${result['error']}`)
                data['main_code'] = ''
                set(data)
            }
            else
            {
                let main_code = result['result'].split(/```/)
                let code_block = ''
                for (let i = 0; i < main_code.length; i++)
                {
                    let item = main_code[i]
                    if (i % 2 != 0)
                    {
                        code_block += `${item}\n`
                    }
                }
                console.log(code_block)
                data['main_code'] = code_block
                set(data)
            }

        },
        reset: () => 
        {
            data = {
                "unit_test_code": '',
                'main_code': '',
            }

            set(data)
        }
	};
}

export const worker_agent = createWorkerAgent();
