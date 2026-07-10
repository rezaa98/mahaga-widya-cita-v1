from PIL import Image, ImageDraw, ImageFont

def create_og_image():
    # 1. Create a base image (1200x630)
    width, height = 1200, 630
    img = Image.new('RGB', (width, height), color='#0B2D6B')
    draw = ImageDraw.Draw(img)

    # 2. Draw a simple diagonal gradient effect using polygons/lines
    for y in range(height):
        # Interpolate between #0B2D6B (11, 45, 107) and #061e4f (6, 30, 79)
        r = int(11 - (11 - 6) * (y / height))
        g = int(45 - (45 - 30) * (y / height))
        b = int(107 - (107 - 79) * (y / height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # 3. Add some subtle geometric shapes (gold and white curves with low opacity)
    # PIL doesn't easily support opacity on polygons unless drawn on RGBA, so we'll use an overlay
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Gold circle
    overlay_draw.ellipse([(-200, -200), (400, 400)], fill=(212, 175, 55, 30))
    # Another circle
    overlay_draw.ellipse([(800, 300), (1500, 1000)], fill=(255, 255, 255, 10))

    img.paste(overlay, (0, 0), overlay)

    # 4. Load the logo, resize and paste
    try:
        logo = Image.open('public/logo-transparent.png').convert('RGBA')
        logo_size = 350
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Center the logo horizontally and vertically, slightly shifted up
        x = (width - logo_size) // 2
        y = (height - logo_size) // 2 - 40
        img.paste(logo, (x, y), logo)
    except Exception as e:
        print(f"Could not load logo: {e}")

    # 5. Add Text (PT Mahaga Widya Cita)
    # For a server with no guaranteed fonts, we'll draw it using default font, but wait, default font is tiny.
    # We can try to load a system font or just rely on the logo. 
    # Since the logo is 1000x1000, it probably has the company name! 
    # If it's just the icon, we can add some large text if we find Arial or Helvetica.
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 64)
        subfont = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
        
        text = "PT Mahaga Widya Cita"
        # Get text bounding box
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        
        tx = (width - tw) // 2
        ty = y + logo_size + 20
        draw.text((tx, ty), text, font=font, fill=(255, 255, 255))
        
        subtext = "Mitra Terpercaya untuk Edukasi dan Tata Kelola Profesional"
        sbbox = draw.textbbox((0, 0), subtext, font=subfont)
        stw = sbbox[2] - sbbox[0]
        draw.text(((width - stw) // 2, ty + th + 30), subtext, font=subfont, fill=(212, 175, 55))
        
    except Exception as e:
        print("Could not load font, skipping text.", e)

    # 6. Save image
    img.save('public/og-image.jpg', quality=95)
    print("Created public/og-image.jpg successfully!")

if __name__ == "__main__":
    create_og_image()
