# 📊 Configuración de Firebase para Sistema de Caja

## 1. Crear colección "pagos" en Firestore

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto "macao-comanda"
3. Ve a **Firestore Database**
4. La colección "pagos" se creará automáticamente al hacer el primer pago

## 2. Estructura de documentos en "pagos"

```javascript
{
  pedidoId: string,        // ID del pedido original
  mesa: string,            // Número de mesa
  total: number,           // Total a pagar
  pagadoCon: number,       // Monto con el que pagó el cliente
  vuelto: number,          // Vuelto calculado
  metodoPago: string,      // "efectivo" | "tarjeta" | "transferencia"
  cajero: string,          // Email del usuario que registró el pago
  items: array,            // Array de items del pedido
  timestamp: timestamp     // Fecha y hora del pago
}
```

## 3. Índices Compuestos Recomendados

Para optimizar las consultas, crea estos índices en Firestore:

### Índice 1: Pagos ordenados por fecha
- Colección: `pagos`
- Campos:
  - `timestamp` (Descendente)
- Estado de consulta: Automático

### Índice 2: Pagos por mesa
- Colección: `pagos`
- Campos:
  - `mesa` (Ascendente)
  - `timestamp` (Descendente)

### Índice 3: Pagos por cajero
- Colección: `pagos`
- Campos:
  - `cajero` (Ascendente)
  - `timestamp` (Descendente)

**Cómo crear índices:**
1. Ve a Firestore Database
2. Click en la pestaña "Índices"
3. Click en "Crear índice"
4. Sigue las instrucciones anteriores

## 4. Reglas de Seguridad Recomendadas (Producción)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Pedidos - todos pueden leer, solo autenticados pueden escribir
    match /pedidos/{pedidoId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Menú - todos pueden leer, solo admin puede escribir
    match /menu/{itemId} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.auth.token.role == 'admin';
    }
    
    // Pagos - solo autenticados pueden leer y escribir
    match /pagos/{pagoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
                            && request.auth.token.role == 'admin';
    }
  }
}
```

**Nota:** Por ahora las reglas están en modo prueba (`allow read, write: if true`). 
En producción, implementa Firebase Authentication y usa las reglas de arriba.

## 5. Backup y Exportación

Configura backups automáticos:
1. Ve a Firestore Database
2. Click en "Importar/Exportar"
3. Configura exportaciones programadas a Cloud Storage

## 6. Próximos Pasos

- [ ] Implementar Firebase Authentication
- [ ] Configurar roles de usuario (admin, cajero, mesero, cocina)
- [ ] Agregar Cloud Functions para lógica de negocio
- [ ] Implementar notificaciones push con FCM
- [ ] Configurar Analytics para tracking de ventas
