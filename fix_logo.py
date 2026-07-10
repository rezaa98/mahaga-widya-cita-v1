from PIL import Image
import numpy as np

img = Image.open('public/logo-transparent.png').convert("RGBA")
data = np.array(img)

# Find white pixels (or near white) and make them transparent
# R > 200, G > 200, B > 200 and A > 50
r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
white_mask = (r > 200) & (g > 200) & (b > 200)
data[..., 3][white_mask] = 0

img_fixed = Image.fromarray(data)
bbox = img_fixed.getbbox()
if bbox:
    img_fixed = img_fixed.crop(bbox)

# Add 20px padding to keep it centered perfectly
from PIL import ImageOps
img_fixed = ImageOps.expand(img_fixed, border=20, fill=(0,0,0,0))

img_fixed.save('public/logo-transparent-fixed.png')
print("Fixed logo saved to public/logo-transparent-fixed.png")
