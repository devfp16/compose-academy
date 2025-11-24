# 🎨 Semana 2: Material 3 Design System

¡Bienvenido a la segunda semana! 🥳
Esta semana dejaremos de ver "cajas grises" y haremos que nuestras apps se vean **INCREÍBLES** usando Material Design 3 (M3).

---

## 📚 Temas de la Semana

1.  **Theming con Material 3** (Colores, Tipografía, Formas)
2.  **Color Schemes** (Modo Claro ☀️ / Oscuro 🌙)
3.  **Dynamic Colors** (Magia con el fondo de pantalla)
4.  **Componentes M3** (Button, Card, TextField, TopAppBar, NavigationBar)
5.  **Typography y Shapes** (Personalizando la marca)
6.  **Surface y Elevation** (Profundidad y jerarquía)

---

## 1. Theming con Material 3 🎨

En Compose, el tema se define en `Theme.kt`. Material 3 usa tres pilares principales:
*   **ColorScheme**: La paleta de colores.
*   **Typography**: Los estilos de texto.
*   **Shapes**: Las formas de los componentes.

```kotlin
@Composable
fun MiAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        shapes = Shapes, // ¡No olvides las formas!
        content = content
    )
}
```

> **Nota:** ¡Ya no tienes que elegir colores a mano! Usa el [Material Theme Builder](https://m3.material.io/theme-builder) para generar tu paleta automáticamente. 🪄

---

## 2. Color Schemes & Dynamic Colors 🌈

Material 3 introduce **Dynamic Colors** (en Android 12+), que extrae colores del fondo de pantalla del usuario.

```kotlin
val colorScheme = when {
    dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
        val context = LocalContext.current
        if (darkTheme) dynamicDarkColorScheme(context) 
        else dynamicLightColorScheme(context)
    }
    darkTheme -> DarkColorScheme
    else -> LightColorScheme
}
```

### Usando los colores en tu UI
Nunca uses `Color.Red` o `Color.Blue` directamente. Usa los roles semánticos:

```kotlin
// ✅ Correcto: Usa el tema
Text(
    text = "Hola Mundo",
    color = MaterialTheme.colorScheme.primary
)

// ❌ Incorrecto: Hardcoded
Text(
    text = "Hola Mundo",
    color = Color(0xFF6200EE)
)
```

---

## 3. Typography y Shapes ✍️🔶

### Typography
No uses `fontSize = 20.sp`. Usa la escala de tipos de Material 3 para consistencia.

```kotlin
// En Type.kt
val Typography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 57.sp,
        lineHeight = 64.sp,
        letterSpacing = (-0.25).sp
    ),
    // ... define headline, title, body, label
)

// En tu UI
Text(
    text = "Título Importante",
    style = MaterialTheme.typography.headlineMedium
)
```

### Shapes
Las formas definen qué tan redondeadas son las esquinas de tus componentes.

```kotlin
// En Shape.kt
val Shapes = Shapes(
    small = RoundedCornerShape(4.dp),
    medium = RoundedCornerShape(8.dp),
    large = RoundedCornerShape(16.dp)
)

// En tu UI
Surface(
    shape = MaterialTheme.shapes.medium, // Usa la forma del tema
    color = MaterialTheme.colorScheme.primaryContainer
) {
    // Contenido
}
```

---

## 4. Surface y Elevation 🏔️

En Material 3, la elevación ya no se representa solo con sombras, sino también con **cambios de color** (tonal elevation). Cuanto más elevada es una superficie, más claro se vuelve su color (en modo oscuro) o más tintada con el color primario.

```kotlin
// Surface maneja el color de fondo y el contenido automáticamente
Surface(
    modifier = Modifier.size(200.dp),
    tonalElevation = 8.dp, // ¡Esto cambia el color ligeramente!
    shadowElevation = 8.dp, // Esto añade la sombra clásica
    shape = MaterialTheme.shapes.large
) {
    Box(contentAlignment = Alignment.Center) {
        Text("Elevación 8.dp")
    }
}
```

> **Importante:** `tonalElevation` es clave para la accesibilidad y visibilidad en modo oscuro.

---

## 5. Componentes M3 Esenciales 🛠️

### Buttons 🔘
```kotlin
Button(onClick = { }) { Text("Filled") }
OutlinedButton(onClick = { }) { Text("Outlined") }
TextButton(onClick = { }) { Text("Text") }
```

### Cards 🃏
```kotlin
ElevatedCard(onClick = { }) { /* ... */ } // Con sombra
OutlinedCard(onClick = { }) { /* ... */ } // Con borde
Card(onClick = { }) { /* ... */ }         // Filled
```

### Text Fields 📝
```kotlin
OutlinedTextField(
    value = text,
    onValueChange = { text = it },
    label = { Text("Nombre") }
)
```

### Scaffold & NavigationBar 🏗️
El esqueleto de tu pantalla.

```kotlin
Scaffold(
    topBar = {
        CenterAlignedTopAppBar(
            title = { Text("Mi App M3") },
            colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer
            )
        )
    },
    bottomBar = {
        NavigationBar {
            NavigationBarItem(
                icon = { Icon(Icons.Default.Home, null) },
                label = { Text("Home") },
                selected = true,
                onClick = { }
            )
        }
    }
) { innerPadding ->
    Column(modifier = Modifier.padding(innerPadding)) {
        Text("Contenido")
    }
}
```

---

## 🎓 Tarea de la Semana

Crea una pantalla de "Perfil de Usuario" aplicando todo lo aprendido:
1.  Usa `Scaffold` con `TopAppBar`.
2.  Crea una `ElevatedCard` para la información principal.
3.  Usa `MaterialTheme.typography` para todos los textos.
4.  Aplica `MaterialTheme.shapes` personalizados a una imagen o caja.
5.  Verifica que el `tonalElevation` funcione en modo oscuro.

¡A rockear con Material 3! 🎸
