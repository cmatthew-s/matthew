import subprocess
import io
import contextlib

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # allow 'Access-Control-Allow-Origin' to all routes 

@app.route('/generate_content', methods=['POST'])
def run_model():
    data = request.get_json()
    # init params
    prompt = data['command']['prompt'].replace('`', "'").split(' ')
    prompt = '-'.join(prompt)
    path = data['settings']['path']
    file = data['settings']['file']
    tokenizer_path = data['settings']['tokenizer_path']
    mp = data['settings']['mp']
    max_seq_len = data['settings']['max_seq_len']
    max_batch_size = data['settings']['max_batch_size']

    # set command
    command = f'torchrun  --nproc_per_node {mp} {file} --ckpt_dir {path}/ --tokenizer_path {tokenizer_path} --max_seq_len {max_seq_len} --max_batch_size {max_batch_size} --content """{prompt}"""'
    print(command)

    if not command.startswith("torchrun"):
        return jsonify({'error': 'Command is not allowed.'})
    
    # execute command
    try:
        # Run the command using subprocess
        result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT)
        result = result.decode('utf-8').strip()
        index = result.find('Result: ') + 9
        result = result[index:]

        return jsonify({'result': result})
    except subprocess.CalledProcessError as e:
        return jsonify({'error': f'Command failed with error: {e.output.decode("utf-8").strip()}'})
    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'})

@app.route('/check_error', methods=['POST'])
def check_error():
    data = request.get_json()
    code = data['code']

    error_message = ''
    code_success_status = True

    with io.StringIO() as f:
        with contextlib.redirect_stdout(f):  # Redirect output to the file-like object
            try:
                exec(code)  # Execute the code string
                code_success_status = True

                # print("Code executed successfully. Output:\n" + output)
            except Exception as e:
                code_success_status = False
                error_message = str(e)

    result = {
        'success': code_success_status,
        'error_message': error_message
    }

    return jsonify(result)

@app.route('/check_code', methods=['POST'])
def check_code():
    data = request.get_json()
    code = data['code']

    error_message = ''
    code_success_status = True
    output = ''

    print('testimg unit tests...')

    with io.StringIO() as f:
        with contextlib.redirect_stdout(f):  # Redirect output to the file-like object
            try:
                exec(code)  # Execute the code string
                output = f.getvalue()
                code_success_status = True
            except Exception as e:
                code_success_status = False
                error_message = str(e)

    result = {
        'success': code_success_status,
        'error_message': error_message,
        'output': output
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8406)
