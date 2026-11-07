# Brief de dirección de arte — Parko ("Tablero de salidas")

Identidad: **Swiss / wayfinding** (señalética de aeropuerto y estación aplicada a un parqueadero universitario).

1. **Motivo visual:** el *código de plaza* (`A-14`) como pieza tipográfica y el cuadro "P". Aparece en el
   loader, el logo, el tablero del hero, cada plaza del plano, el tiquete de reserva y el footer.
2. **Escala tipográfica:** Archivo (eje de ancho `wdth` 62–125, peso 900 en display) + Martian Mono (códigos,
   placas, horas). Archivo expandido imita la señalética que se lee a distancia; la mono da el carácter de
   "dato de tablero". Display `clamp(44px, 8vw, 112px)`, tracking `-0.02em`. Body 17px/1.6. Ratio 1.333.
3. **Layout:** grid de 12 columnas asimétrico. Hero: H1 a 7/12 pegado al margen izquierdo y tablero a 5/12 que
   sangra fuera del viewport a la derecha. En el detalle de parqueadero, columna izquierda sticky + plano.
4. **Color:** fondo gris plata frío `#DDE0DC`, tinta `#0E1116`, acento único verde señal `#00A86B` (solo
   "disponible" y CTAs). Estados semánticos: ocupado `#D64545`, reservado `#E0A100`, mantenimiento `#8A8F98`.
5. **Sección firma:** (a) tablero split-flap con disponibilidad en vivo; (b) la reserva como tiquete físico con
   perforación y código de barras derivado de la placa.
6. **Movimiento:** solo el tablero y el tiquete se mueven con intención. Flaps con rotación 3D y stagger de
   60 ms (ease-out-quart); la plaza se levanta al hover; entrada de página con un único reveal escalonado.
   `prefers-reduced-motion` muestra los valores finales sin animar.

Densidad: asimétrica, aire generoso entre bloques, densidad controlada dentro del tablero.

Evitado a propósito: hero centrado, tres cards idénticas, gradiente índigo/morado, crema/beige, serif editorial,
eyebrow en cada sección, numeración 01/02/03 sin secuencia real.
