from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base

class TrainRegistry(Base):
    __tablename__ = "train_registry"
    train_id = Column(String(50), primary_key=True, index=True)
    train_type = Column(String(20))
    status = Column(String(20))

class DetectionLog(Base):
    __tablename__ = "detection_log"
    id = Column(Integer, primary_key=True, index=True)
    train_id = Column(String(50))
    object_type = Column(String(50))
    confidence = Column(Float)
    distance = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    train_id = Column(String(50))
    alert_level = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GPSLog(Base):
    __tablename__ = "gps_logs"
    id = Column(Integer, primary_key=True, index=True)
    train_id = Column(String(50))
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())