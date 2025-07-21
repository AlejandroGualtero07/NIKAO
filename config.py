"""
Configuración para la aplicación Nikao
"""
import os
from datetime import timedelta

class Config:
    """Configuración base"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'nikao_secret_key_2025'
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # Session configuration
    PERMANENT_SESSION_LIFETIME = timedelta(days=31)
    
    # Database (para futuras implementaciones)
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///nikao.db'
    
    # API Keys (para integraciones futuras)
    WHATSAPP_API_KEY = os.environ.get('WHATSAPP_API_KEY')
    MAPS_API_KEY = os.environ.get('MAPS_API_KEY')
    
    # Configuración de domicilios
    DELIVERY_FEE = 5000  # Tarifa base de domicilio
    FREE_DELIVERY_MINIMUM = 35000  # Mínimo para domicilio gratis
    MAX_DELIVERY_DISTANCE = 15  # Kilómetros
    
    # Configuración de pedidos
    ORDER_TIMEOUT = 30  # Minutos antes de cancelar pedido automáticamente
    MIN_ORDER_AMOUNT = 15000  # Valor mínimo del pedido

class DevelopmentConfig(Config):
    """Configuración para desarrollo"""
    DEBUG = True
    TEMPLATES_AUTO_RELOAD = True
    
class ProductionConfig(Config):
    """Configuración para producción"""
    DEBUG = False
    
# Configuración por defecto
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
