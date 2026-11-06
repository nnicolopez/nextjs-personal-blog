# PersonalCMS v2 — Prácticas e instrumentos

> Rediseño pensado primero para mi propio sitio (dogfooding). El modelo de datos queda genérico para abrir la plataforma a otros más adelante.

## Concepto

Practico cosas distintas — batería, guitarra jazz, musculación, taller/domótica, código — y para cada una construyo mis propias herramientas con IA como socio. No todas son software: hay apps, hardware impreso en 3D, documentos generados y rutinas.

El sitio muestra eso: **prácticas** (lo que hago), **instrumentos** (lo que construyo para hacerlo mejor) y una **bitácora** (el proceso).

### El elemento memorable: el secuenciador

El hero es una grilla tipo step sequencer de batería: una fila por práctica, 16 columnas = últimas 16 semanas. La intensidad de cada celda es la cantidad de entradas de bitácora de esa semana. Al cargar, un playhead recorre las 16 columnas una sola vez y "enciende" las celdas. Click en una fila filtra los instrumentos.

Funciona porque une el vocabulario de todas las prácticas: compases, series y repeticiones, pasos del motor paso a paso. La constancia es el tema.

Todo lo demás es sobrio: una sola familia tipográfica, sin tarjetas idénticas, sin degradados.

## Tokens

### Color

| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#ECEEE9` | Fondo (yeso frío) |
| `--paper-2` | `#E1E4DE` | Superficies hundidas, celdas apagadas |
| `--ink` | `#1C2629` | Texto principal |
| `--ink-soft` | `#55615F` | Texto secundario (contraste 5.6:1 sobre paper) |
| `--rule` | `#C7CCC4` | Divisores |
| `--musica` | `#A97C1F` | Latón — Música |
| `--entreno` | `#2E6B57` | Hierro pintado — Entrenamiento |
| `--taller` | `#2F57C4` | Plano azul — Taller y domótica |
| `--codigo` | `#8B3D8F` | Ciruela — Código |

Los colores de práctica se usan en celdas, barras y puntos; el texto siempre va en `--ink` (el latón no llega a 4.5:1 como texto).

Cada práctica tiene un color configurable desde el dashboard; el usuario elige de una paleta validada, no un color libre.

### Tipografía

Una sola familia: **Archivo** (variable, ejes `wdth` 62–125 y `wght` 100–900). El ancho es la herramienta expresiva:

| Rol | Ancho | Peso | Tamaño |
|---|---|---|---|
| Display (nombre, H1) | 118% | 750 | 50–67px |
| H2 | 110% | 700 | 28px |
| H3 / nombre de instrumento | 100% | 650 | 21px |
| Cuerpo | 100% | 400 | 17px / 1.55 |
| Datos, etiquetas de fila, fechas | 75% | 560 | 14px |

Sin mayúsculas sostenidas, sin monoespaciada para datos: los datos van en Archivo condensada.

### Layout

- Columna de lectura máx. 68ch, alineada a la izquierda.
- Grilla de 12 columnas, gutter 24px, máx. 1200px.
- Radios: 2px en celdas del secuenciador, 6px en medios embebidos, nada en listas.

## Modelo de contenido

```
Practica
  id, nombre, slug, color, orden, descripcion, visibleEnSecuenciador

Instrumento                     ← reemplaza la "sección" genérica como unidad principal
  id, practicaId, nombre, slug
  tipo: app | hardware | documento | rutina
  estado: en-uso | prototipo | en-construccion | archivado
  resumen (1 línea), problema (qué resuelve en la práctica)
  rolIA (cómo intervino la IA, texto corto)
  materiales[] (stack o componentes: "ESP32", "NEMA 17", "React"...)
  demo: { kind: iframe | video | imagenes, url }
  capturas[]
  enlaces[] (Probar, Descargar PDF, Ver video) — sin repositorio por defecto
  destacado: boolean, visibilidad: publico | borrador

Entrada (bitácora)
  id, practicaId, instrumentoId?, fecha, titulo, tipo: nota | video | audio | foto, cuerpo, media[]
```

El secuenciador se calcula de `Entrada` agrupando por práctica y semana ISO.

Fase 2 (no diseñada todavía): widgets con datos vivos por instrumento (stats de la Libreta de hierro, estado de la cortina) vía webhook.

## Mockups

| Archivo | Qué muestra |
|---|---|
| `mockups/06-publico-home.html` | Home pública: secuenciador, índice de instrumentos, bitácora |
| `mockups/07-publico-instrumento.html` | Ficha de un instrumento (cortina enrollable) |
| `mockups/08-dashboard.html` | Dashboard: editar instrumentos y prácticas con preview |

Los mockups 01–05 (landing de plataforma, auth, onboarding, dashboard v1) quedan como referencia de la etapa multiusuario. Los tokens azul oscuro de v1 se reemplazan por los de este documento.

## Implementación

- Esquema: `db/schema.ts` (`practices`, `instruments`, `entries`, `pages.headline`). Aplicar con `npm run db:push`.
- Plantilla pública: `components/public/practices/` (`PracticesPage`, `PracticesBoard` con el secuenciador y el filtro, `InstrumentView`). Se activa eligiendo la plantilla "Prácticas" en el dashboard.
- Ficha de instrumento: `/[username]/[slug]`.
- Dashboard: `/dashboard/practices`, `/dashboard/instruments` (editor con vista previa en vivo, escritorio y móvil) y `/dashboard/journal`.
- Los estilos usan container queries en vez de media queries, así la vista previa del dashboard cambia de layout igual que la página real.
- Las imágenes son links por ahora; la subida de archivos queda para cuando entre el almacenamiento de medios.
