# 📱 Semana 1: Composables y Estado Básico
**Nivel 1 - Fundamentos de Jetpack Compose**

---

## 🎯 Objetivos de la Semana

Al finalizar esta semana serás capaz de:
- ✅ Crear y entender funciones `@Composable`
- ✅ Manejar estado con `remember` y `mutableStateOf`
- ✅ Comprender cómo funciona la Recomposition
- ✅ Usar layouts básicos: `Column`, `Row`, `Box`
- ✅ Dominar el sistema de `Modifier`

---

## 📚 Tema 1: Funciones `@Composable` Básicas

### ¿Qué es una función Composable?

Una función composable es una función que describe una parte de tu UI. Se marca con la anotación `@Composable`.

**Características clave:**
- No devuelven nada (Unit), emiten UI
- Se pueden llamar solo desde otras funciones composables
- Describen la UI de forma declarativa (qué mostrar, no cómo mostrarlo)
- Se ejecutan en un orden específico

### Ejemplo Básico

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hola, $name!")
}

// Uso
@Composable
fun MyApp() {
    Greeting(name = "Luis")
}
```

### Composables Comunes

```kotlin
@Composable
fun BasicComposables() {
    // Texto
    Text(
        text = "Hola Compose",
        fontSize = 24.sp,
        fontWeight = FontWeight.Bold,
        color = Color.Blue
    )
    
    // Imagen
    Image(
        painter = painterResource(id = R.drawable.ic_launcher),
        contentDescription = "App icon"
    )
    
    // Ícono
    Icon(
        imageVector = Icons.Default.Favorite,
        contentDescription = "Favorito",
        tint = Color.Red
    )
    
    // Botón
    Button(onClick = { /* acción */ }) {
        Text("Click aquí")
    }
}
```

### 🔨 Práctica 1

Crea una función composable que muestre:
- Tu nombre en texto grande
- Una descripción tuya
- Un ícono de tu elección

---

## 📚 Tema 2: Estado con `remember` y `mutableStateOf`

### ¿Por qué necesitamos estado?

En Compose, la UI es **inmutable**. Para cambiarla, necesitamos **estado** que al modificarse, dispara una recomposición.

### `mutableStateOf`

Crea un observable que Compose puede rastrear.

```kotlin
@Composable
fun Counter() {
    val count = mutableStateOf(0) // ❌ Problema: se reinicia cada recomposición
    
    Button(onClick = { count.value++ }) {
        Text("Clicks: ${count.value}")
    }
}
```

### `remember`

Preserva el estado entre recomposiciones.

```kotlin
@Composable
fun Counter() {
    val count = remember { mutableStateOf(0) } // ✅ Correcto
    
    Button(onClick = { count.value++ }) {
        Text("Clicks: ${count.value}")
    }
}
```

### Delegado `by`

Simplifica el acceso al valor.

```kotlin
@Composable
fun Counter() {
    // En lugar de count.value, solo usas count
    var count by remember { mutableStateOf(0) }
    
    Button(onClick = { count++ }) {
        Text("Clicks: $count")
    }
}
```

### Diferentes tipos de estado

```kotlin
@Composable
fun StateExamples() {
    // String
    var name by remember { mutableStateOf("") }
    
    // Boolean
    var isChecked by remember { mutableStateOf(false) }
    
    // Lista
    var items by remember { mutableStateOf(listOf<String>()) }
    
    // Objeto custom
    var user by remember { mutableStateOf(User()) }
}
```

### 🔨 Práctica 2

Crea:
1. Un contador que sume y reste
2. Un switch que cambie entre light/dark mode (simulado con color)
3. Un TextField que muestre el texto que escribes

---

## 📚 Tema 3: Recomposition

### ¿Qué es la Recomposition?

Es el proceso donde Compose **vuelve a ejecutar** las funciones composables cuando el estado cambia.

**Puntos clave:**
- Solo se recomponen las funciones que leen el estado modificado
- Es inteligente: salta lo que no cambió
- Puede ocurrir en cualquier momento
- Puede ocurrir en paralelo

### Ejemplo de Recomposition

```kotlin
@Composable
fun RecompositionExample() {
    var count by remember { mutableStateOf(0) }
    
    Column {
        // Esta parte se recompone cuando count cambia
        Text("Count: $count")
        
        // Esta parte NO se recompone (no lee count)
        Text("Este texto es estático")
        
        Button(onClick = { count++ }) {
            Text("Incrementar")
        }
    }
}
```

### Reglas importantes

1. **Las funciones composables deben ser idempotentes**: mismo input = mismo output
2. **No hacer side effects directamente**: usar LaunchedEffect (lo verás en semana 4)
3. **Son rápidas**: diseñadas para ejecutarse frecuentemente

```kotlin
// ❌ MAL: side effect directo
@Composable
fun BadExample() {
    var count by remember { mutableStateOf(0) }
    count++ // Se ejecuta en cada recomposición = loop infinito
    Text("Count: $count")
}

// ✅ BIEN: estado modificado por eventos
@Composable
fun GoodExample() {
    var count by remember { mutableStateOf(0) }
    
    Button(onClick = { count++ }) {
        Text("Count: $count")
    }
}
```

### 🔨 Práctica 3

Observa la recomposition:
1. Agrega logs en diferentes composables
2. Cambia estado y observa qué se recompone
3. Crea un contador con múltiples textos y nota cuáles se actualizan

---

## 📚 Tema 4: Layouts Fundamentales

### `Column` - Vertical

Apila elementos verticalmente.

```kotlin
@Composable
fun ColumnExample() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.SpaceBetween, // distribución
        horizontalAlignment = Alignment.CenterHorizontally // alineación
    ) {
        Text("Top")
        Text("Middle")
        Text("Bottom")
    }
}
```

**Arrangements comunes:**
- `Arrangement.Top` - arriba
- `Arrangement.Center` - centro
- `Arrangement.Bottom` - abajo
- `Arrangement.SpaceBetween` - espacio entre items
- `Arrangement.SpaceEvenly` - espacio uniforme
- `Arrangement.spacedBy(8.dp)` - separación específica

**Alignments:**
- `Alignment.Start` / `CenterHorizontally` / `End`

### `Row` - Horizontal

Apila elementos horizontalmente.

```kotlin
@Composable
fun RowExample() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceAround,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(Icons.Default.Home, "Home")
        Text("Inicio")
        Icon(Icons.Default.Settings, "Settings")
    }
}
```

**Arrangements:** iguales que Column (Start, Center, End, etc.)
**Alignments:** Top, CenterVertically, Bottom

### `Box` - Apilado (Z-axis)

Apila elementos uno sobre otro.

```kotlin
@Composable
fun BoxExample() {
    Box(
        modifier = Modifier.size(200.dp),
        contentAlignment = Alignment.Center
    ) {
        // Fondo
        Image(
            painter = painterResource(R.drawable.background),
            contentDescription = null,
            modifier = Modifier.matchParentSize()
        )
        
        // Texto encima
        Text(
            text = "Overlay",
            color = Color.White,
            fontSize = 24.sp
        )
    }
}
```

**Alignments:**
- `TopStart`, `TopCenter`, `TopEnd`
- `CenterStart`, `Center`, `CenterEnd`
- `BottomStart`, `BottomCenter`, `BottomEnd`

### Combinando Layouts

```kotlin
@Composable
fun ProfileCard() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        // Foto y nombre en fila
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(60.dp)
                    .background(Color.Gray, CircleShape)
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column {
                Text("Luis Pacheco", fontWeight = FontWeight.Bold)
                Text("Desarrollador Android", fontSize = 12.sp)
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Descripción
        Text("Apasionado por Kotlin y Compose 🚀")
    }
}
```

### 🔨 Práctica 4

Crea:
1. Una lista vertical de 5 items con Column
2. Una bottom bar con 3 iconos usando Row
3. Una card con imagen de fondo y texto usando Box
4. Un perfil completo combinando los 3 layouts

---

## 📚 Tema 5: Sistema de `Modifier`

### ¿Qué es Modifier?

Es la forma de modificar o decorar un composable: tamaño, padding, color, gestos, etc.

**Características:**
- Se encadenan en orden de izquierda a derecha
- El orden importa mucho
- Se pasa como parámetro `modifier`

### Modifiers Esenciales

```kotlin
@Composable
fun ModifierExamples() {
    // Tamaño
    Box(modifier = Modifier.size(100.dp))
    Box(modifier = Modifier.size(width = 100.dp, height = 50.dp))
    Box(modifier = Modifier.fillMaxWidth())
    Box(modifier = Modifier.fillMaxHeight())
    Box(modifier = Modifier.fillMaxSize())
    Box(modifier = Modifier.wrapContentSize())
    
    // Padding y Margin
    Text(
        text = "Hola",
        modifier = Modifier
            .padding(16.dp) // todos los lados
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .padding(start = 16.dp, end = 16.dp)
    )
    
    // Background
    Text(
        text = "Fondo",
        modifier = Modifier
            .background(Color.Blue)
            .background(Color.Blue, shape = RoundedCornerShape(8.dp))
    )
    
    // Border
    Box(
        modifier = Modifier
            .border(2.dp, Color.Black)
            .border(2.dp, Color.Black, RoundedCornerShape(8.dp))
    )
}
```

### El Orden Importa

```kotlin
@Composable
fun ModifierOrder() {
    // Caso 1: Padding ANTES de background
    Text(
        text = "Hola",
        modifier = Modifier
            .padding(16.dp)     // espacio primero
            .background(Color.Blue) // fondo después
        // Resultado: espacio transparente alrededor de fondo azul
    )
    
    // Caso 2: Background ANTES de padding
    Text(
        text = "Hola",
        modifier = Modifier
            .background(Color.Blue) // fondo primero
            .padding(16.dp)         // espacio después
        // Resultado: fondo azul con espacio interno
    )
}
```

### Modifiers Interactivos

```kotlin
@Composable
fun InteractiveModifiers() {
    var count by remember { mutableStateOf(0) }
    
    Text(
        text = "Clicks: $count",
        modifier = Modifier
            .clickable { count++ } // hacer clickeable
            .padding(16.dp)
    )
    
    // Con feedback visual
    Text(
        text = "Click me",
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(Color.Blue)
            .clickable { /* acción */ }
            .padding(16.dp)
    )
}
```

### Modifiers de Alineación

```kotlin
@Composable
fun AlignmentModifiers() {
    Box(modifier = Modifier.fillMaxSize()) {
        Text(
            text = "Centrado",
            modifier = Modifier.align(Alignment.Center)
        )
    }
    
    Row {
        Text(
            text = "Con peso",
            modifier = Modifier.weight(1f) // ocupa espacio disponible
        )
        Text("Fijo")
    }
}
```

### Modifiers Útiles

```kotlin
@Composable
fun UsefulModifiers() {
    // Clip (recortar)
    Image(
        painter = painterResource(R.drawable.avatar),
        contentDescription = "Avatar",
        modifier = Modifier
            .size(100.dp)
            .clip(CircleShape) // imagen circular
    )
    
    // Alpha (transparencia)
    Text(
        text = "Semi-transparente",
        modifier = Modifier.alpha(0.5f)
    )
    
    // Rotate (rotar)
    Icon(
        imageVector = Icons.Default.ArrowForward,
        contentDescription = null,
        modifier = Modifier.rotate(90f) // rotar 90 grados
    )
    
    // Scale (escalar)
    Icon(
        imageVector = Icons.Default.Favorite,
        contentDescription = null,
        modifier = Modifier.scale(1.5f) // 150% del tamaño
    )
    
    // Offset (desplazar)
    Text(
        text = "Desplazado",
        modifier = Modifier.offset(x = 10.dp, y = 5.dp)
    )
}
```

### 🔨 Práctica 5

Crea:
1. Un botón con bordes redondeados y padding
2. Una imagen circular con borde
3. Elementos clickeables que cambien de color al tocar
4. Un layout donde entiendas el orden de modifiers

---

## 🎯 Proyecto de Práctica: Perfil de Usuario

Crea una pantalla de perfil que combine todo lo aprendido:

**Requisitos:**
- [ ] Foto de perfil circular
- [ ] Nombre del usuario
- [ ] Descripción
- [ ] Contador de seguidores (editable con botones +/-)
- [ ] Botón de "Editar Perfil"
- [ ] Lista de 3 posts recientes (cada uno en un Card)

**Estructura sugerida:**

```kotlin
@Composable
fun ProfileScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Header con foto y datos
        ProfileHeader()
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Estadísticas
        ProfileStats()
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Botón editar
        EditButton()
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Posts
        RecentPosts()
    }
}

@Composable
fun ProfileHeader() {
    // Tu código aquí
}

@Composable
fun ProfileStats() {
    var followers by remember { mutableStateOf(1234) }
    
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        StatItem(label = "Posts", value = "42")
        StatItem(label = "Seguidores", value = "$followers")
        StatItem(label = "Siguiendo", value = "500")
    }
}

@Composable
fun StatItem(label: String, value: String) {
    // Tu código aquí
}
```

---

## 📋 Checklist de Dominio

Marca cuando puedas hacer esto sin dudar:

- [ ] Crear funciones `@Composable` desde cero
- [ ] Usar `remember` y `mutableStateOf` correctamente
- [ ] Explicar qué es la recomposition
- [ ] Usar Column, Row y Box apropiadamente
- [ ] Combinar los 3 layouts en un diseño complejo
- [ ] Aplicar modifiers en el orden correcto
- [ ] Usar `weight` y `align` efectivamente
- [ ] Crear componentes clickeables
- [ ] Manejar estado local en un composable

---

## 🎓 Conceptos Clave para Recordar

1. **Composables**: Funciones que describen UI, no la construyen
2. **Estado**: Necesario para hacer la UI reactiva
3. **`remember`**: Preserva valores entre recomposiciones
4. **Recomposition**: Compose re-ejecuta funciones cuando cambia el estado
5. **Layouts**: Column (vertical), Row (horizontal), Box (apilado)
6. **Modifier**: Cambia apariencia y comportamiento, el orden importa

---

## 💪 Siguiente Paso

Una vez domines esta semana, estarás listo para la **Semana 2: Material 3 Design System**.

¡Practica, practica, practica! La mejor forma de aprender Compose es escribiendo código. 🚀

---

## 📚 Recursos Adicionales

- [Compose Basics Codelab](https://developer.android.com/codelabs/jetpack-compose-basics)
- [Thinking in Compose](https://developer.android.com/jetpack/compose/mental-model)
- [State in Compose](https://developer.android.com/jetpack/compose/state)
- [Layouts in Compose](https://developer.android.com/jetpack/compose/layouts/basics)
