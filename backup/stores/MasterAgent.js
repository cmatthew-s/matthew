import { writable } from 'svelte/store';

function createMasterAgent() {
    
    let data = {
        'objectives': '',
        'unit_tests': '', // python code
        'program_flow': ''
    }

	const { subscribe, set, update } = writable(data);

    let command_data = {
        command: {
            prompt: ''
        },
        settings: {
            'path': '../../ai-tools/codellama/CodeLlama-7b-Instruct',
            'file': '../../ai-tools/codellama/master_agent.py',
            'tokenizer_path': '../../ai-tools/codellama/CodeLlama-7b-Instruct/tokenizer.model',
            'mp': 1,
            'max_seq_len': 512,
            'max_batch_size': 2
        }
    }


	return {
		subscribe,
        define_obj: async (prompt) => 
        {
            command_data['command']['prompt'] = `Based on this user prompt: '${prompt}'. What is the objective of the user (Focus only to the problem and make it detailed)?`
            command_data['settings']['max_seq_len'] = 512
            const response = await fetch('http://127.0.0.1:8406/generate_content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(command_data)
            })

            const result = await response.json()
            if ('error' in result)
            {
                console.log(`Error Found: ${result['error']}`)
                data['objectives'] = ''
                set(data)
            }
            else
            {
                console.log(result['result'])
                data['objectives'] = result['result']
                set(data)
            }
        },
        define_unit_test: async () => 
        {
            console.log('defining unit test...')
            command_data['command']['prompt'] = `Based on this pseudocode: ${data['program_flow']}. Please a list of possible and robust unit test cases (more than 3 and maximum 5 unit tests) to tackle logical error and to proof the code does work, with example of inputs and outputs with no code`
            command_data['settings']['max_seq_len'] = 1500
            const response = await fetch('http://127.0.0.1:8406/generate_content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(command_data)
            })

            const result = await response.json()
            if ('error' in result)
            {
                console.log(`Error Found: ${result['error']}`)
                data['unit_tests'] = ''
                set(data)
            }
            else
            {
                console.log(result['result'])
                data['unit_tests'] = result['result']
                set(data)
            }
        },
        define_flow: async () => 
        {
            command_data['command']['prompt'] = `Based on this objectives: '${data['objectives']}'. Please generate a robust and detailed comprehensive Pseudocode that contains the list of inputs, outputs, function names and steps including the examples and yet without any code or explanation to satisfy the objectives`
            command_data['settings']['max_seq_len'] = 1024
            const response = await fetch('http://127.0.0.1:8406/generate_content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(command_data)
            })

            const result = await response.json()
            if ('error' in result)
            {
                console.log(`Error Found: ${result['error']}`)
                data['program_flow'] = ''
                set(data)
            }
            else
            {
                console.log(result['result'])
                data['program_flow'] = result['result']
                set(data)
            }
        },
        reset: () => 
        {
            data = {
                'objectives': '',
                'unit_tests': '', // python code
                'program_flow': ''
            }

            set(data)
        }
	};
}

export const master_agent = createMasterAgent();
