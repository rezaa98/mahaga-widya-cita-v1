import sys
from rembg import remove
from PIL import Image
import io

input_path = '/Users/rezaa_ym/Downloads/Project New/logo.jpeg'
output_path = '/Users/rezaa_ym/Downloads/Project New/mahaga-widya-cita/public/logo-transparent.png'

print("Reading image from", input_path)
with open(input_path, 'rb') as i:
    input_data = i.read()

print("Removing background using rembg...")
output_data = remove(input_data)

print("Saving transparent image to", output_path)
with open(output_path, 'wb') as o:
    o.write(output_data)

# Let's open it to check dimensions and upscale if necessary
img = Image.open(output_path)
print("Original logo dimensions:", img.size)

# If the logo is smaller than 500px in width or height, let's upscale it to make it HD
width, height = img.size
if width < 1000 or height < 1000:
    ratio = max(1000.0 / width, 1000.0 / height)
    new_size = (int(width * ratio), int(height * ratio))
    print(f"Upscaling image to {new_size} for HD quality...")
    img = img.resize(new_size, Image.Resampling.LANCZOS)
    img.save(output_path, 'PNG')
    print("HD logo saved.")
else:
    print("Logo is already high resolution.")
