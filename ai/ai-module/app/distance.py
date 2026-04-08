# Known widths of objects in meters (averages)
KNOWN_WIDTHS = {
    "person": 0.5,
    "vehicle": 1.8,
    "animal": 1.2,
    "obstacle": 1.0
}

# Focal length in pixels. 
# This depends on your webcam. 
# Typical value for 640x480 webcam is ~500-700
FOCAL_LENGTH = 600.0 

def estimate_distance(pixel_width: float, label: str) -> float:
    if pixel_width <= 0:
        return 9999.0
    
    known_width = KNOWN_WIDTHS.get(label, 1.0)
    
    # Formula: (Known Width * Focal Length) / Pixel Width
    distance_meters = (known_width * FOCAL_LENGTH) / pixel_width
    
    return round(distance_meters, 2)
