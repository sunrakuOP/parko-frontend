# Brief de dirección de arte v2 — Parko ("Plano del campus")

Reemplaza al brief v1 ("Tablero de salidas"), que resultó genérico. Esta versión sale de cómo funcionan
de verdad los parqueaderos de la Javeriana Cali: no se reserva, se mira **cuántos cupos quedan, en qué
lado y si hay fila**, y el tiquete es un papel con QR y solo la placa.

Identidad: **orgánico / natural** ejecutado como **cartografía** (plano esquemático del campus).

1. **Motivo visual:** la *celda de plaza*. Cada sector se dibuja como una grilla de celdas (una por
   cupo, hasta 40) que se llenan según la ocupación. Aparece en el mapa, en las barras de sector, en el
   tiquete (perforación) y en el favicon/logo.
2. **Tipografía:** Bricolage Grotesque (display y numerales, eje óptico y de ancho) + Hanken Grotesk
   (texto). Sin monoespaciada: los números grandes son el dato y se leen mejor con el display.
   Display `clamp(44px, 7.5vw, 104px)`, tracking `-0.03em`. Body 17px/1.6. Ratio 1.333.
3. **Layout:** el mapa ocupa 2/3 del hero y sangra a la izquierda; el texto es una columna angosta a la
   derecha. Debajo, los parqueaderos son filas editoriales de ancho completo (no tarjetas iguales).
4. **Color:** concreto frío `#E3E5DF`, tinta verde-negro `#15231C`, verde samán `#2E6B4D` (marca, libre,
   CTAs). Estados: ámbar `#C98A0B` (quedan pocos) y ladrillo `#B2452A` (lleno / fila larga).
5. **Sección firma:** el plano esquemático interactivo (Cañas Gordas en L de Palmas a Lagos, Almendros
   atrás, Gualanday sobre la vía de la Icesi hacia Pance) y el **tiquete de papel** con QR y placa.
6. **Movimiento:** al cargar, las celdas del plano se llenan en cascada una sola vez (stagger 12 ms); la
   fila larga se muestra con carros que avanzan en bucle lento; hover levanta el parqueadero. Todo
   con `transform`/`opacity` y `prefers-reduced-motion` respetado.

Datos: nombres y ubicaciones reales (Google Maps): Cañas Gordas (campus, Cl. 18 # 118-250), Parqueadero
Del Almendros, Parqueadero Gualanday (Kr 122 entre Cl 17A y 16). **Capacidades estimadas** (marcadas con
asterisco en la interfaz) hasta tener el dato oficial.
