from PIL import Image
from pyzbar.pyzbar import decode
import io

def read_barcode_from_image(image_bytes: bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))
        decoded = decode(image)

        if not decoded:
            return None

        # Return first barcode result
        return decoded[0].data.decode("utf-8")

    except Exception as e:
        print("Error reading barcode:", e)
        return None
