import fire
from typing import Optional
from llama import Llama

def main(ckpt_dir:str, tokenizer_path:str, content:str, temperature:float=0.2, top_p:float=0.95, max_seq_len:int=512, max_batch_size:int=8, max_gen_len:Optional[int]=None):
    generator = Llama.build(
        ckpt_dir=ckpt_dir, 
        tokenizer_path=tokenizer_path, 
        max_seq_len=max_seq_len,
        max_batch_size=max_batch_size
    )

    content = content.split('-')
    content = ' '.join(content)
    instructions = [
        [
            {
                "role": "system",
                "content": "Image yourself as a 10 years experienced Software Engineer that will provide answers in detailed and robusts"
            },
            {
                "role": "user",
                "content": content
            }
        ]
    ]

    results = generator.chat_completion(instructions, max_gen_len=max_gen_len, temperature=temperature, top_p=top_p)
    print(f"Result: {results[0]['generation']['content']}")

if __name__ == "__main__":
    fire.Fire(main)
