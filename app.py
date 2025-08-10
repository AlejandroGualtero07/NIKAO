# Aplicación Flask para Nikao - Arepas Rellenas
from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import datetime
from werkzeug.utils import secure_filename
import os
from config import config

# Crear aplicación Flask
app = Flask(__name__)

# Configurar la aplicación
env = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config[env])

# Asegurar que la carpeta de uploads existe
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Datos de productos (esto después se puede mover a una base de datos)
PRODUCTOS = [
    {
        'id': 1,
        'nombre': 'AREPA SENCILLA',
        'descripcion': 'Arepa tradicional con mantequilla y sal. Simple y deliciosa.',
        'precio': 1000,
        'categoria': 'sencillas',
        'icono': '🫓',
        'disponible': True
    },
    {
        'id': 2,
        'nombre': 'AREPA DE QUESO',
        'descripcion': 'Arepa rellena con queso derretido.',
        'precio': 2800,
        'categoria': 'sencillas',
        'icono': '�',
        'disponible': True
    },
    {
        'id': 3,
        'nombre': 'AREPA DE JAMÓN Y QUESO',
        'descripcion': 'Clásica combinación de jamón y queso derretido.',
        'precio': 4000,
        'categoria': 'sencillas',
        'icono': '🥪',
        'disponible': True
    },
    {
        'id': 4,
        'nombre': 'AREPA QUESUDA',
        'descripcion': 'Arepa con 3 lonjas de queso derretido.',
        'precio': 5500,
        'categoria': 'sencillas',
        'icono': '🧀',
        'disponible': True
    },
    {
        'id': 5,
        'nombre': 'AREPA DE CHORIZO',
        'descripcion': 'Arepa rellena con chorizo artesanal.',
        'precio': 6500,
        'categoria': 'clasicas',
        'icono': '🌭',
        'disponible': True
    },
    {
        'id': 6,
        'nombre': 'AREPA RANCHERA',
        'descripcion': 'Chorizo, queso y salsa al gusto.',
        'precio': 8500,
        'categoria': 'clasicas',
        'icono': '�',
        'disponible': True
    },
    {
        'id': 7,
        'nombre': 'AREPA BURGER',
        'descripcion': 'Carne de hamburguesa 125gr, jamón, queso y papas chips.',
        'precio': 9500,
        'categoria': 'especiales',
        'icono': '🍔',
        'disponible': True
    },
    {
        'id': 8,
        'nombre': 'AREPA DE POLLO',
        'descripcion': 'Pollo, huevo de codorniz o jamón.',
        'precio': 9500,
        'categoria': 'clasicas',
        'icono': '🐔',
        'disponible': True
    },
    {
        'id': 9,
        'nombre': 'AREPA RANCHERA FELIZ',
        'descripcion': 'Chorizo, queso, jamón, papas chips y salsa al gusto.',
        'precio': 9500,
        'categoria': 'especiales',
        'icono': '😊',
        'disponible': True
    },
    {
        'id': 10,
        'nombre': 'PERRO CALIENTE',
        'descripcion': 'Chorizo, queso, jamón y papas chips.',
        'precio': 9500,
        'categoria': 'perros',
        'icono': '🌭',
        'disponible': True
    },
    {
        'id': 11,
        'nombre': 'AREPA DE CARNE',
        'descripcion': 'Carne, huevo de codorniz o jamón.',
        'precio': 10500,
        'categoria': 'clasicas',
        'icono': '�',
        'disponible': True
    },
    {
        'id': 12,
        'nombre': 'AREPA MIXTA',
        'descripcion': 'Pollo, carne, huevo de codorniz o jamón.',
        'precio': 11500,
        'categoria': 'clasicas',
        'icono': '🍖',
        'disponible': True
    },
    {
        'id': 13,
        'nombre': 'AREPA DE LA CASA',
        'descripcion': 'Carne, pollo, chicharrón, queso, jamón, huevo de codorniz y salsas al gusto.',
        'precio': 19000,
        'categoria': 'especiales',
        'icono': '�',
        'disponible': True
    },
    {
        'id': 14,
        'nombre': 'AREPA ESQUINA DEL ANTOJO',
        'descripcion': 'Carne, pollo, chorizo, queso, jamón, huevo de codorniz y salsas al gusto.',
        'precio': 19000,
        'categoria': 'especiales',
        'icono': '�',
        'disponible': True
    },
    {
        'id': 15,
        'nombre': 'AREPA MASTER',
        'descripcion': 'Carne, pollo, jamón, huevo de codorniz, costilla ahumada, maíz tierno y baño de queso.',
        'precio': 19000,
        'categoria': 'especiales',
        'icono': '👑',
        'disponible': True
    },
    {
        'id': 16,
        'nombre': 'PERRO CALIENTE FELIZ',
        'descripcion': 'Pan Bimbo, chorizo, carne, pollo, queso, jamón y papas chips.',
        'precio': 20000,
        'categoria': 'perros',
        'icono': '�',
        'disponible': True
    },
    {
        'id': 17,
        'nombre': 'DORILOCO',
        'descripcion': 'Doritos, chorizo, pollo, carne, costilla, chicharrón, queso y salsas al gusto.',
        'precio': 30000,
        'categoria': 'premium',
        'icono': '🔥',
        'disponible': True
    },
    {
        'id': 18,
        'nombre': 'DORIESPECIAL',
        'descripcion': 'Chorizo, carne, pollo, costilla, chicharrón, huevos de codorniz y Doritos.',
        'precio': 65000,
        'categoria': 'premium',
        'icono': '💎',
        'disponible': True
    }
]

# Base de datos simple para pedidos (esto después se puede mover a una base de datos real)
PEDIDOS = []

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# ==================== RUTAS PRINCIPALES ====================

@app.route('/')
def index():
    """Página principal con el carrusel y resumen de productos"""
    productos_destacados = PRODUCTOS[:6]  # Mostrar solo los primeros 6 productos
    return render_template('index.html', productos=productos_destacados)

@app.route('/domicilios')
def domicilios():
    """Página de información sobre domicilios"""
    zonas_entrega = [
        {
            'zona': 'Ciudad Latina',
            'costo': 2000,
            'disponible': True
        },
        {
            'zona': 'Hogares Soacha',
            'costo': 2000,
            'disponible': True
        },
        {
            'zona': 'Maipore',
            'costo': 2000,
            'disponible': True
        },
        {
            'zona': 'Soacha Compartir',
            'costo': 2000,
            'disponible': True
        },
        {
            'zona': 'Parque de Soacha Altico',
            'costo': 2000,
            'disponible': True
        }
    ]
    return render_template('domicilios.html', zonas=zonas_entrega)

@app.route('/carta')
def carta():
    """Página completa del menú con filtros"""
    categorias = ['todas', 'sencillas', 'clasicas', 'especiales', 'perros', 'premium']
    return render_template('carta.html', productos=PRODUCTOS, categorias=categorias)

@app.route('/rastrear')
def rastrear():
    """Página para rastrear pedidos"""
    return render_template('rastrear.html')

@app.route('/ayuda')
def ayuda():
    """Página de ayuda y FAQ"""
    faqs = [
        {
            'pregunta': '¿Cuáles son los horarios de atención?',
            'respuesta': 'Atendemos de lunes a sábados y festivos de 5:00 PM a 12:00 AM. Los domingos no atendemos.'
        },
        {
            'pregunta': '¿Cuáles son las formas de pago?',
            'respuesta': 'Aceptamos efectivo, Nequi y Daviplata.'
        },
        {
            'pregunta': '¿Puedo cancelar mi pedido?',
            'respuesta': 'Puedes cancelar tu pedido si aún no ha sido preparado. Contáctanos inmediatamente al WhatsApp 304 202 5223.'
        }
    ]
    return render_template('ayuda.html', faqs=faqs)

# ==================== API ENDPOINTS ====================

@app.route('/api/productos')
def api_productos():
    """API para obtener todos los productos"""
    return jsonify(PRODUCTOS)

@app.route('/api/productos/<categoria>')
def api_productos_categoria(categoria):
    """API para obtener productos por categoría"""
    if categoria == 'todas':
        productos_filtrados = PRODUCTOS
    else:
        productos_filtrados = [p for p in PRODUCTOS if p['categoria'] == categoria]
    return jsonify(productos_filtrados)

@app.route('/api/pedido', methods=['POST'])
def crear_pedido():
    """API para crear un nuevo pedido"""
    try:
        data = request.get_json()
        
        pedido = {
            'id': len(PEDIDOS) + 1,
            'cliente': {
                'nombre': data.get('nombre'),
                'telefono': data.get('telefono'),
                'direccion': data.get('direccion'),
                'zona': data.get('zona')
            },
            'productos': data.get('productos', []),
            'total': data.get('total', 0),
            'estado': 'pendiente',
            'fecha_pedido': datetime.datetime.now().isoformat(),
            'tiempo_estimado': data.get('tiempo_estimado', 30),
            'metodo_pago': data.get('metodo_pago', 'efectivo')
        }
        
        PEDIDOS.append(pedido)
        
        return jsonify({
            'success': True,
            'pedido_id': pedido['id'],
            'mensaje': 'Pedido creado exitosamente'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/pedido/<int:pedido_id>')
def obtener_pedido(pedido_id):
    """API para obtener información de un pedido específico"""
    pedido = next((p for p in PEDIDOS if p['id'] == pedido_id), None)
    
    if pedido:
        return jsonify(pedido)
    else:
        return jsonify({'error': 'Pedido no encontrado'}), 404

@app.route('/api/rastrear/<int:pedido_id>')
def rastrear_pedido(pedido_id):
    """API para rastrear el estado de un pedido"""
    pedido = next((p for p in PEDIDOS if p['id'] == pedido_id), None)
    
    if not pedido:
        return jsonify({'error': 'Pedido no encontrado'}), 404
    
    # Simular progreso del pedido
    tiempo_transcurrido = (datetime.datetime.now() - datetime.datetime.fromisoformat(pedido['fecha_pedido'])).seconds // 60
    
    if tiempo_transcurrido < 5:
        estado = 'recibido'
        progreso = 25
    elif tiempo_transcurrido < 15:
        estado = 'preparando'
        progreso = 50
    elif tiempo_transcurrido < 25:
        estado = 'en_camino'
        progreso = 75
    else:
        estado = 'entregado'
        progreso = 100
    
    return jsonify({
        'pedido_id': pedido_id,
        'estado': estado,
        'progreso': progreso,
        'tiempo_transcurrido': tiempo_transcurrido,
        'tiempo_estimado': pedido['tiempo_estimado'],
        'cliente': pedido['cliente']['nombre']
    })

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
