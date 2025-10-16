# Guía de Prueba: Cierre de Caja 🔒

## Pre-requisitos

Antes de probar el cierre de caja, asegúrate de tener:

1. ✅ Firebase configurado correctamente
2. ✅ Al menos un pago registrado en el sistema
3. ✅ Usuario autenticado como administrador

## Pasos para Probar el Cierre de Caja

### 1. Preparar Datos de Prueba

```bash
# Asegúrate de tener al menos algunos pedidos y pagos
# Puedes crear pedidos desde el rol de mesero
# Y luego pagarlos desde el panel de admin
```

### 2. Acceder al Panel de Administración

1. Inicia sesión como administrador
2. Navega a `/dashboard/admin`
3. Verifica que veas:
   - Mesas activas o historial de pagos
   - Estadísticas en la parte superior
   - Botón "🔒 Cerrar Caja" en la esquina superior derecha

### 3. Verificar Estado del Botón

**Botón Habilitado** (color rojo):
- ✅ Hay al menos un pago registrado en el sistema
- ✅ Se puede hacer clic

**Botón Deshabilitado** (color gris):
- ❌ No hay pagos en el sistema
- ❌ No se puede hacer clic

### 4. Abrir Modal de Cierre

1. Haz clic en el botón "🔒 Cerrar Caja"
2. Deberías ver un modal con:

   ```
   🔒 Cerrar Caja
   Resumen del día
   
   [Total Ventas]         [Transacciones]
   S/ XXX.XX              X
   
   💳 Desglose por Método
   💵 Efectivo       S/ XXX.XX
   💳 Tarjeta        S/ XXX.XX
   📱 Transferencia  S/ XXX.XX
   
   ⚠️ Atención
   Al cerrar la caja se guardarán todos los datos...
   
   [Cancelar] [🔒 Cerrar Caja]
   ```

### 5. Verificar Datos en el Modal

Confirma que los datos mostrados sean correctos:

- ✅ **Total Ventas**: Suma de todos los pagos del día
- ✅ **Transacciones**: Número de pagos realizados
- ✅ **Desglose**: 
  - Efectivo = suma de pagos en efectivo
  - Tarjeta = suma de pagos con tarjeta
  - Transferencia = suma de pagos por transferencia

### 6. Cancelar (Prueba 1)

1. Haz clic en "Cancelar"
2. El modal debe cerrarse
3. Los datos NO deben cambiar
4. Verifica que los pedidos y pagos sigan ahí

### 7. Cerrar Caja (Prueba 2)

1. Abre nuevamente el modal de cierre
2. Haz clic en "🔒 Cerrar Caja"
3. Debe aparecer un **alert de confirmación**:

   ```
   ⚠️ ADVERTENCIA: Cerrar Caja
   
   Esta acción guardará la sesión actual y limpiará:
   • Todos los pedidos pendientes
   • Todos los pagos del día
   
   Total a cerrar: S/ XXX.XX
   Transacciones: X
   
   ¿Estás seguro de continuar?
   
   [Cancelar] [Aceptar]
   ```

4. Haz clic en "Cancelar" en el alert
5. El modal debe permanecer abierto
6. Los datos NO deben cambiar

### 8. Confirmar Cierre (Prueba 3)

1. Abre el modal nuevamente
2. Haz clic en "🔒 Cerrar Caja"
3. En el alert, haz clic en "Aceptar"
4. Deberías ver:
   - El botón cambia a "Cerrando..."
   - El botón se deshabilita temporalmente

5. Después de unos segundos, debe aparecer un **alert de éxito**:

   ```
   ✅ Caja cerrada exitosamente
   
   💰 Total: S/ XXX.XX
   🧾 Transacciones: X
   
   [Aceptar]
   ```

### 9. Verificar Resultado

Después de cerrar la caja exitosamente:

#### En la UI:

1. ✅ El modal se cierra automáticamente
2. ✅ La vista vuelve a "Mesas Activas"
3. ✅ Las estadísticas se actualizan:
   - Mesas Activas: 0
   - Venta Pendiente: S/ 0.00
   - Ventas Hoy: S/ 0.00
   - Transacciones: 0
4. ✅ No hay mesas en la vista "Mesas Activas"
5. ✅ No hay pagos en el "Historial de Pagos"
6. ✅ El botón "🔒 Cerrar Caja" se deshabilita (gris)

#### En Firebase Console:

1. Ve a Firebase Console → Firestore Database
2. Verifica la colección **`sesiones`**:
   - ✅ Debe existir un nuevo documento
   - ✅ El documento debe tener:
     ```javascript
     {
       fechaApertura: "...",
       fechaCierre: "...",
       cajero: "admin@local.com",
       totalVentas: XXX.XX,
       totalTransacciones: X,
       pagos: [/* array con todos los pagos */],
       desglosePorMetodo: {
         efectivo: XXX,
         tarjeta: XXX,
         transferencia: XXX
       },
       estado: "cerrada"
     }
     ```

3. Verifica la colección **`pedidos`**:
   - ✅ Debe estar vacía (todos los documentos eliminados)

4. Verifica la colección **`pagos`**:
   - ✅ Debe estar vacía (todos los documentos eliminados)

### 10. Verificar Flujo Completo

Para verificar que todo funciona en un ciclo completo:

1. ✅ Crea nuevos pedidos (como mesero)
2. ✅ Paga las mesas (como admin)
3. ✅ Verifica que el botón "Cerrar Caja" se habilite
4. ✅ Cierra la caja
5. ✅ Verifica que todo se limpie
6. ✅ Repite el proceso

## Casos de Error Esperados

### Error 1: Sin Conexión a Internet
```
❌ Error al cerrar caja: FirebaseError: ...
```
**Solución**: Verifica tu conexión a internet

### Error 2: Usuario No Autenticado
El botón no ejecutará la acción si `user` es null

### Error 3: Sin Permisos de Firebase
```
❌ Error al cerrar caja: Permission denied
```
**Solución**: Verifica las reglas de seguridad de Firebase

### Error 4: No Hay Transacciones
El botón estará deshabilitado (gris) y no se podrá hacer clic

## Verificación de Datos en Sesión

Después de cerrar la caja, verifica en Firebase que la sesión guardada contiene:

```javascript
{
  // Fechas correctas
  fechaApertura: "ISO timestamp del primer pago",
  fechaCierre: "ISO timestamp actual",
  
  // Usuario correcto
  cajero: "email del usuario que cerró",
  
  // Totales correctos
  totalVentas: suma_de_todos_los_pagos,
  totalTransacciones: cantidad_de_pagos,
  
  // Todos los pagos guardados
  pagos: [
    {
      id: "...",
      mesa: "...",
      total: ...,
      items: [...],
      // ... todos los campos del pago
    }
  ],
  
  // Desglose correcto
  desglosePorMetodo: {
    efectivo: suma_efectivo,
    tarjeta: suma_tarjeta,
    transferencia: suma_transferencia
  },
  
  // Estado cerrada
  estado: "cerrada"
}
```

## Notas Importantes

⚠️ **ADVERTENCIA**: 
- Esta acción elimina PERMANENTEMENTE todos los pedidos y pagos activos
- Asegúrate de hacer respaldo si estás en producción
- Los datos se guardan en la colección `sesiones` antes de eliminar

✅ **Recomendación**:
- Cierra la caja al final de cada turno o día
- Verifica los totales antes de confirmar
- Revisa la sesión guardada en Firebase después de cerrar

## Checklist de Funcionalidad

- [ ] Botón se habilita/deshabilita correctamente
- [ ] Modal muestra datos correctos
- [ ] Desglose por método es exacto
- [ ] Confirmación doble funciona
- [ ] Se puede cancelar en cualquier momento
- [ ] Alert de éxito muestra totales correctos
- [ ] Sesión se guarda en Firebase
- [ ] Pedidos se eliminan de Firebase
- [ ] Pagos se eliminan de Firebase
- [ ] UI se actualiza correctamente
- [ ] Botón se deshabilita después de cerrar
- [ ] Se puede repetir el ciclo completo

Si todos los checks están ✅, ¡el sistema de cierre de caja funciona perfectamente! 🎉
