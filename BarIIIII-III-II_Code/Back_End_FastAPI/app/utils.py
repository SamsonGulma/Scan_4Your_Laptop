import barcode
from barcode.writer import ImageWriter
import os

def generate_barcode(user_id: int):
    CODE128 = barcode.get_barcode_class('code128')
    code = CODE128(f"{user_id}", writer=ImageWriter())
    path = f"app/static/barcode/{user_id}.png"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    code.save(path)
    return path
