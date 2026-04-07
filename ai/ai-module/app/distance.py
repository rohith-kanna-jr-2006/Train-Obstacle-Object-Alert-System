def estimate_distance(box_width_px: float) -> float:
    if box_width_px <= 0:
        return 9999.0
    K = 1000.0  # tune constant empirically
    return round(K / box_width_px, 2)
