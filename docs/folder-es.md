# Estructuras de Carpetas para Proyectos Angular

## Introducción

Angular, como framework, ya viene con una estructura predefinida. Sin embargo, podemos adaptarla para aplicar los conceptos de Screaming Architecture y crear una organización de carpetas que refleje mejor el propósito de negocio de la aplicación.

## Niveles de Estructura en Angular

### Nivel 1: Estructura Estándar de Angular (Por tipo)

Esta es la estructura típica generada por Angular CLI:

```bash
└── src/
    ├── app/
    │   ├── components/
    │   ├── services/
    │   ├── models/
    │   ├── pipes/
    │   ├── directives/
    │   └── guards/
    ├── assets/
    ├── environments/
    └── ...
```

**Ventajas**:

- Familiar para desarrolladores Angular
- Sigue las convenciones del framework

**Desventajas**:

- No comunica el propósito del negocio
- Se vuelve difícil de mantener con el crecimiento
- Módulos relacionados están dispersos

### Nivel 2: Estructura Angular por Características

```bash
└── src/
    ├── app/
    │   ├── core/                 # Servicios singleton, guards globales, etc.
    │   │   ├── services/
    │   │   ├── guards/
    │   │   └── interceptors/
    │   ├── shared/               # Componentes compartidos, pipes, directivas
    │   │   ├── components/
    │   │   ├── directives/
    │   │   └── pipes/
    │   ├── features/             # Características de la aplicación
    │   │   ├── auth/
    │   │   │   ├── components/
    │   │   │   ├── services/
    │   │   │   └── auth.module.ts
    │   │   ├── payment/
    │   │   │   ├── components/
    │   │   │   ├── services/
    │   │   │   └── payment.module.ts
    │   │   └── employees/
    │   │       ├── components/
    │   │       ├── services/
    │   │       └── employees.module.ts
    │   └── app.module.ts
    ├── assets/
    ├── environments/
    └── ...
```

**Ventajas**:

- Organiza el código por características
- Utiliza los módulos de Angular para encapsular funcionalidades
- Mantiene componentes compartidos separados

**Desventajas**:

- Aún mantiene cierta orientación técnica en lugar de dominio

### Nivel 3: Estructura Angular con Screaming Architecture

```bash
└── src/
    ├── app/
    │   ├── core/                  # Infraestructura de la aplicación
    │   │   ├── infrastructure/    # Implementaciones técnicas
    │   │   │   ├── http/
    │   │   │   ├── storage/
    │   │   │   └── auth/
    │   │   └── ui/               # Componentes de UI base
    │   │       ├── layout/
    │   │       └── components/
    │   ├── domains/              # Dominios de negocio (modulos)
    │   │   ├── hr-management/    # Dominio: Gestión de RRHH
    │   │   │   ├── employee-directory/  # Caso de uso
    │   │   │   │   ├── components/
    │   │   │   │   ├── services/
    │   │   │   │   └── models/
    │   │   │   ├── payroll/      # Caso de uso
    │   │   │   └── hr-management.module.ts
    │   │   ├── sales/            # Dominio: Ventas
    │   │   │   ├── product-catalog/  # Caso de uso
    │   │   │   ├── checkout/     # Caso de uso
    │   │   │   └── sales.module.ts
    │   │   └── customer-support/ # Dominio: Atención al cliente
    │   │       ├── ticket-management/  # Caso de uso
    │   │       ├── knowledge-base/     # Caso de uso
    │   │       └── customer-support.module.ts
    │   ├── shared/               # Componentes compartidos entre dominios
    │   └── app.module.ts
    ├── assets/
    ├── environments/
    └── ...
```

**Ventajas**:

- La estructura "grita" el propósito del negocio
- Organiza el código por dominios y casos de uso
- Facilita entender el negocio para nuevos desarrolladores
- Cada dominio puede evolucionar de forma independiente

**Desventajas**:

- Mayor complejidad inicial
- Requiere buen conocimiento del dominio
- Puede ser excesivo para aplicaciones pequeñas

## Implementación Práctica en Angular

### 1. Uso de Módulos para Dominios

Angular tiene un sistema de módulos que encaja perfectamente con el concepto de dominios:

```typescript
// domains/hr-management/hr-management.module.ts
@NgModule({
  declarations: [...],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'employees', component: EmployeeListComponent },
      { path: 'payroll', component: PayrollComponent }
    ])
  ],
  providers: [EmployeeService, PayrollService]
})
export class HrManagementModule { }
```

### 2. Estado por Dominio (con NGRX/NGXS)

Si usas gestión de estado, cada dominio puede tener su propio estado:

```bash
└── domains/
    └── hr-management/
        ├── store/
        │   ├── actions/
        │   ├── reducers/
        │   ├── effects/
        │   └── selectors/
        └── ...
```

### 3. Modelo de Barril (Barrel Pattern)

Facilita las importaciones usando el patrón de barril:

```typescript
// domains/hr-management/index.ts
export * from './models';
export * from './services';
export * from './components';
```

### 4. Lazy Loading

Aprovecha el lazy loading de Angular para cargar dominios solo cuando se necesiten:

```typescript
// En app-routing.module.ts
const routes: Routes = [
  {
    path: 'hr',
    loadChildren: () => import('./domains/hr-management/hr-management.module')
      .then(m => m.HrManagementModule)
  },
  {
    path: 'sales',
    loadChildren: () => import('./domains/sales/sales.module')
      .then(m => m.SalesModule)
  }
];
```

## Recomendaciones según el tamaño del proyecto

### Para proyectos pequeños (1-3 desarrolladores)

- Utiliza el Nivel 2 (por características)
- Considera utilizar el enfoque de carpetas por característica sin módulos separados
- Mantén una carpeta `shared` para elementos comunes

### Para proyectos medianos (4-10 desarrolladores)

- Utiliza el Nivel 2 o 3, según la complejidad del dominio
- Implementa lazy loading para módulos/dominios
- Considera usar NgRx/NGXS con estado separado por dominio

### Para proyectos grandes (10+ desarrolladores)

- Implementa completamente el Nivel 3 con Screaming Architecture
- Considera dividir en múltiples aplicaciones o microfrontends
- Usa bibliotecas compartidas para código común entre dominios

## Ejemplo de Transformación

### Antes (Enfoque por tipo)

```bash
app/
├── components/
│   ├── product-list.component.ts
│   ├── cart.component.ts
│   └── checkout-form.component.ts
├── services/
│   ├── product.service.ts
│   └── cart.service.ts
└── models/
    ├── product.model.ts
    └── cart-item.model.ts
```

### Después (Enfoque Screaming Architecture)

```bash
app/
└── domains/
    ├── catalog/
    │   ├── components/
    │   │   └── product-list.component.ts
    │   ├── services/
    │   │   └── product.service.ts
    │   └── models/
    │       └── product.model.ts
    └── shopping/
        ├── components/
        │   ├── cart.component.ts
        │   └── checkout-form.component.ts
        ├── services/
        │   └── cart.service.ts
        └── models/
            └── cart-item.model.ts
```

## Conclusión

La implementación de Screaming Architecture en Angular es perfectamente viable, especialmente aprovechando su sistema de módulos. La clave está en organizar el código primero por dominios de negocio, luego por casos de uso, y finalmente por aspectos técnicos.

La estructura ideal dependerá del tamaño y complejidad de tu proyecto. Lo importante es que, al abrir el proyecto, cualquier desarrollador pueda entender rápidamente qué hace la aplicación, no solo que está hecha con Angular.
