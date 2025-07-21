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
        'nombre': 'AREPA RELLENA CLÁSICA',
        'descripcion': 'Arepa dorada con queso campesino, carne desmechada jugosa, aguacate fresco y hogao criollo. El sabor tradicional que nunca pasa de moda.',
        'precio': 18000,
        'categoria': 'clasicas',
        'icono': '🫓',
        'disponible': True
    },
    {
        'id': 2,
        'nombre': 'AREPA SÚPER QUESO',
        'descripcion': 'Delicias cremosas con mezcla de queso mozzarella, campesino y costeño derretidos, acompañado de jamón ahumado y tomate cherry.',
        'precio': 16500,
        'categoria': 'clasicas',
        'icono': '🧀',
        'disponible': True
    },
    {
        'id': 3,
        'nombre': 'AREPA PAISA COMPLETA',
        'descripcion': 'La auténtica experiencia antioqueña: chicharrón crocante, chorizo paisa, morcilla, frijoles rojos, huevo frito y plátano maduro.',
        'precio': 22000,
        'categoria': 'clasicas',
        'icono': '🥩',
        'disponible': True
    },
    {
        'id': 4,
        'nombre': 'AREPA PICANTE NIKAO',
        'descripcion': 'Pollo desmechado en salsa BBQ picante, queso gratinado, cebolla caramelizada y nuestra salsa especial de la casa con toques de ají.',
        'precio': 19500,
        'categoria': 'picantes',
        'icono': '🌶️',
        'disponible': True
    },
    {
        'id': 5,
        'nombre': 'AREPA VEGGIE FRESCA',
        'descripcion': 'Opción saludable con aguacate hass, tomate riñón, queso fresco, lechuga crespa, zanahoria rallada y aderezo de yogurt.',
        'precio': 15000,
        'categoria': 'vegetarianas',
        'icono': '🥑',
        'disponible': True
    },
    {
        'id': 6,
        'nombre': 'AREPA MECHADA ESPECIAL',
        'descripcion': 'Carne mechada en su jugo con cebolla, pimentón, acompañada de queso rallado, tajadas de plátano y guacamole cremoso.',
        'precio': 20000,
        'categoria': 'clasicas',
        'icono': '🍖',
        'disponible': True
    },
    {
        'id': 7,
        'nombre': 'AREPA COSTEÑA',
        'descripcion': 'Sabores del Caribe con pescado desmechado, yuca cocida, suero costeño, cebolla encurtida y cilantro fresco.',
        'precio': 21000,
        'categoria': 'clasicas',
        'icono': '🐟',
        'disponible': True
    },
    {
        'id': 8,
        'nombre': 'AREPA DULCE MAÍZ',
        'descripcion': 'Arepa de maíz dulce rellena con queso crema, maíz tierno, bocadillo veleño y un toque de canela. Perfecta para los amantes de lo dulce.',
        'precio': 17000,
        'categoria': 'dulces',
        'icono': '🌽',
        'disponible': True
    },
    {
        'id': 9,
        'nombre': 'AREPA CAMPESINA',
        'descripcion': 'Tocineta crocante, huevo revuelto, queso campesino, frijoles refritos y chorizo artesanal. Un desayuno completo en cada bocado.',
        'precio': 18500,
        'categoria': 'clasicas',
        'icono': '🥓',
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
            'zona': 'Soacha Centro',
            'tiempo': '20-30 min',
            'costo': 3500,
            'disponible': True
        },
        {
            'zona': 'Compartir',
            'tiempo': '25-35 min',
            'costo': 4000,
            'disponible': True
        },
        {
            'zona': 'Ciudad Verde',
            'tiempo': '30-40 min',
            'costo': 4500,
            'disponible': True
        },
        {
            'zona': 'León XIII',
            'tiempo': '15-25 min',
            'costo': 3000,
            'disponible': True
        },
        {
            'zona': 'Cazucá',
            'tiempo': '35-45 min',
            'costo': 5000,
            'disponible': False
        }
    ]
    return render_template('domicilios.html', zonas=zonas_entrega)

@app.route('/carta')
def carta():
    """Página completa del menú con filtros"""
    categorias = ['todas', 'clasicas', 'picantes', 'vegetarianas', 'dulces']
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
            'respuesta': 'Atendemos de lunes a domingo de 8:00 AM a 10:00 PM. Los domicilios se realizan hasta las 9:30 PM.'
        },
        {
            'pregunta': '¿Cuál es el tiempo de entrega?',
            'respuesta': 'El tiempo de entrega varía entre 20 a 45 minutos dependiendo de la zona. Puedes consultar los tiempos específicos en nuestra sección de domicilios.'
        },
        {
            'pregunta': '¿Cuáles son las formas de pago?',
            'respuesta': 'Aceptamos efectivo, transferencias bancarias, Nequi, Daviplata y tarjetas débito/crédito.'
        },
        {
            'pregunta': '¿Hacen arepas vegetarianas?',
            'respuesta': 'Sí, tenemos opciones vegetarianas como la Arepa Veggie Fresca. También podemos personalizar arepas según tus preferencias.'
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
