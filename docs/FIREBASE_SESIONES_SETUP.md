# Configuración de Sesiones en Firebase

## Colección: `sesiones`

Esta colección almacena los cierres de caja con toda la información de ventas del día.

### Estructura del Documento

```typescript
{
  fechaApertura: string,           // ISO timestamp del primer pago del día
  fechaCierre: string,              // ISO timestamp del cierre de caja
  cajero: string,                   // Email del usuario que cerró la caja
  totalVentas: number,              // Suma total de todas las ventas
  totalTransacciones: number,       // Cantidad de transacciones
  pagos: Array<{                    // Copia de todos los pagos de la sesión
    id: string,
    firebaseId: string,
    pedidoId: string,
    mesa: string,
    total: number,
    pagadoCon: number,
    vuelto: number,
    metodoPago: "efectivo" | "tarjeta" | "transferencia",
    cajero: string,
    timestamp: string,
    items: Array<{
      name: string,
      quantity: number,
      price: number
    }>
  }>,
  desglosePorMetodo: {              // Totales por método de pago
    efectivo: number,
    tarjeta: number,
    transferencia: number
  },
  estado: "cerrada"                 // Estado de la sesión
}
```

### Índices Recomendados

Crear los siguientes índices compuestos en Firebase Console:

1. **Por fecha de cierre (descendente)**
   - Campo: `fechaCierre`
   - Orden: Descendente
   - Uso: Listar sesiones ordenadas por fecha

2. **Por cajero y fecha**
   - Campo 1: `cajero` (Ascendente)
   - Campo 2: `fechaCierre` (Descendente)
   - Uso: Buscar sesiones por cajero

### Reglas de Seguridad (Producción)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sesiones/{sesionId} {
      // Solo administradores pueden leer
      allow read: if request.auth != null && 
                  request.auth.token.role == 'admin';
      
      // Solo administradores pueden crear sesiones
      allow create: if request.auth != null && 
                    request.auth.token.role == 'admin';
      
      // No permitir actualización o eliminación
      allow update, delete: if false;
    }
  }
}
```

### Notas Importantes

1. **Limpieza de Datos**: Al cerrar caja se eliminan TODOS los documentos de:
   - Colección `pedidos`
   - Colección `pagos`

2. **Respaldo**: Todos los datos se guardan en la sesión antes de eliminarlos

3. **No Reversible**: Una vez cerrada la caja, no se puede revertir

4. **Reporte Diario**: Cada sesión representa un turno o día de trabajo

### Flujo de Cierre de Caja

```
1. Usuario hace clic en "🔒 Cerrar Caja"
2. Sistema muestra resumen:
   - Total de ventas
   - Total de transacciones
   - Desglose por método de pago
3. Usuario confirma
4. Sistema crea documento en colección "sesiones"
5. Sistema elimina todos los documentos de "pedidos"
6. Sistema elimina todos los documentos de "pagos"
7. Sistema muestra confirmación
8. Vista se actualiza (limpia)
```

### Consultas Útiles

#### Obtener todas las sesiones (últimas primero)
```typescript
const q = query(
  collection(db, "sesiones"),
  orderBy("fechaCierre", "desc")
);
```

#### Obtener sesiones por cajero
```typescript
const q = query(
  collection(db, "sesiones"),
  where("cajero", "==", "admin@local.com"),
  orderBy("fechaCierre", "desc")
);
```

#### Obtener sesiones de un rango de fechas
```typescript
const q = query(
  collection(db, "sesiones"),
  where("fechaCierre", ">=", startDate),
  where("fechaCierre", "<=", endDate),
  orderBy("fechaCierre", "desc")
);
```

### Vista de Sesiones (Futuro)

Se puede crear una vista para:
- Listar todas las sesiones cerradas
- Ver detalle de cada sesión
- Exportar reportes
- Generar gráficas de ventas
- Comparar ventas por día/mes
