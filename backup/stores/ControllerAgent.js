import { writable } from 'svelte/store';

function createControllerAgent() {

    let data = {
        "unit_test_exec_status": [false, ''],
        "unit_test_status": [false, ''],
        "code_exec_status": [false, '']
    }

	const { subscribe, set, update } = writable(data);

	return {
		subscribe,
        check_unit_test: async (code) => 
        {
            let command_data = { code: code }
            try
            {
                const response = await fetch('http://127.0.0.1:8406/check_error', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(command_data)
                })

                const result = await response.json()

                if (result['success'] == true)
                {
                    data['unit_test_exec_status'] = [true, '']
                    set(data)
                }
                else
                {
                    console.log(result['error_message'])
                    data['unit_test_exec_status'] = [false, result['error_message']]
                    set(data)
                }
            }
            catch(error)
            {
                // TODO: This is a temporary solution, find a better way!!
                // set to true, because testing unit test inside an intepreter did not return any values
                data['unit_test_exec_status'] = [true, '']
                set(data)
            }
        
        },
        check_code: async (code) => 
        {
            let command_data = { code: code }
            try
            {
                const response = await fetch('http://127.0.0.1:8406/check_error', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(command_data)
                })

                const result = await response.json()

                if (result['success'] == true)
                {
                    data['code_exec_status'] = [true, '']
                    set(data)
                }
                else
                {
                    console.log(result['error_message'])
                    data['code_exec_status'] = [false, result['error_message']]
                    set(data)
                }
            }
            catch(error)
            {
                // TODO: This is a temporary solution, find a better way!!
                // set to true, because testing unit test inside an intepreter did not return any values
                data['code_exec_status'] = [true, '']
                set(data)
            }
        
        },
        test_code: async (code, unit_test) => 
        {
            console.log(code)
            let command_data = { code: `${code}\n\n${unit_test}` }
            console.log(command_data['code'])

            const response = await fetch('http://127.0.0.1:8406/check_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(command_data)
            })

            const result = await response.json()

            if (result['success'] == true)
            {
                console.log(result['output'])
                data['unit_test_status'] = [true, '']
                set(data)
            }
            else
            {
                console.log(result['error_message'])
                data['unit_test_status'] = [false, result['error_message']]
                set(data)
            }
        
        },
        reset: () => 
        {
            data = {
                "unit_test_exec_status": [false, ''],
                "unit_test_status": [false, ''],
                "code_exec_status": [false, '']
            }

            set(data)
        }
	};
}

export const controller_agent = createControllerAgent();
