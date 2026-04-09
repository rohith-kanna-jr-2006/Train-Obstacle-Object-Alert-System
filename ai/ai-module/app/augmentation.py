import cv2
import numpy as np

def apply_fog(image, intensity=0.5):
    """
    Simulates fog by blending the image with a white/grey overlay and adding noise.
    """
    row, col, ch = image.shape
    fog_color = [200, 200, 200] # Light grey
    
    # Create fog layer
    fog_layer = np.full((row, col, ch), fog_color, dtype=np.uint8)
    
    # Blend image with fog layer
    result = cv2.addWeighted(image, 1 - intensity, fog_layer, intensity, 0)
    
    # Add subtle blur to simulate fog dispersion
    result = cv2.GaussianBlur(result, (21, 21), 0)
    
    return result

def apply_thermal(image):
    """
    Simulates a thermal camera view by converting to heatmap.
    """
    # Convert to grayscale first (representing 'heat' intensity)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply a color map to simulate thermal view
    # COLORMAP_JET or COLORMAP_HOT are good choices
    thermal = cv2.applyColorMap(gray, cv2.COLORMAP_JET)
    
    return thermal
