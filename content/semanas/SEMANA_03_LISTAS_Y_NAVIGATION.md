# 📋 Semana 3: Listas y Navigation Básica

¡Ya vamos por la tercera semana! 🎉
Esta semana aprenderás a manejar **listas eficientes** y a **navegar entre pantallas** como un profesional.

---

## 📚 Temas de la Semana

1.  **LazyColumn y LazyRow** (Listas performantes)
2.  **Keys en listas** (Identidad de elementos)
3.  **Navigation Compose básica** (De pantalla en pantalla)
4.  **Pasar argumentos entre pantallas** (Comunicación)
5.  **State Hoisting pattern** (Dónde vive el estado)
6.  **Composables Stateless vs Stateful** (Arquitectura limpia)

---

## 1. LazyColumn y LazyRow 🚀

A diferencia de `Column` o `Row` que renderizan TODOS los elementos de golpe, `LazyColumn` y `LazyRow` solo renderizan lo visible en pantalla. ¡Perfectas para listas largas!

```kotlin
@Composable
fun ListaDeUsuarios(usuarios: List<Usuario>) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(usuarios) { usuario ->
            TarjetaUsuario(usuario)
        }
    }
}

@Composable
fun TarjetaUsuario(usuario: Usuario) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = { /* Navegar al detalle */ }
    ) {
        Row(modifier = Modifier.padding(16.dp)) {
            Icon(Icons.Default.Person, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(usuario.nombre)
        }
    }
}
```

### LazyRow (lista horizontal)
```kotlin
LazyRow(
    horizontalArrangement = Arrangement.spacedBy(8.dp)
) {
    items(imagenes) { imagen ->
        Image(/* ... */)
    }
}
```

---

## 2. Keys en Listas 🔑

Las **keys** ayudan a Compose a identificar cada elemento de una lista. Sin keys, si reordenas o eliminas elementos, Compose puede confundirse y reusar composables incorrectos.

```kotlin
// ❌ Sin keys (malo si la lista cambia)
items(usuarios) { usuario ->
    TarjetaUsuario(usuario)
}

// ✅ Con keys (bueno)
items(
    items = usuarios,
    key = { usuario -> usuario.id } // La KEY única
) { usuario ->
    TarjetaUsuario(usuario)
}
```

> **Pro Tip:** Usa el `id` único de cada objeto como key. Nunca uses el índice de la lista.

---

## 3. Navigation Compose Básica 🧭

Primero, agrega la dependencia en `build.gradle`:
```gradle
implementation "androidx.navigation:navigation-compose:2.7.5"
```

### Configuración básica
```kotlin
@Composable
fun MiApp() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        composable("home") {
            PantallaHome(
                onNavigateToDetails = {
                    navController.navigate("details")
                }
            )
        }
        composable("details") {
            PantallaDetalles(
                onBack = { navController.popBackStack() }
            )
        }
    }
}
```

### Las pantallas
```kotlin
@Composable
fun PantallaHome(onNavigateToDetails: () -> Unit) {
    Scaffold(
        topBar = { TopAppBar(title = { Text("Home") }) }
    ) { padding ->
        Column(
            modifier = Modifier.padding(padding),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Button(onClick = onNavigateToDetails) {
                Text("Ir a Detalles")
            }
        }
    }
}

@Composable
fun PantallaDetalles(onBack: () -> Unit) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Detalles") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Volver")
                    }
                }
            )
        }
    ) { padding ->
        Text("Pantalla de detalles", modifier = Modifier.padding(padding))
    }
}
```

---

## 4. Pasar Argumentos Entre Pantallas 📦

### Método 1: Argumentos en la ruta
```kotlin
NavHost(navController, startDestination = "home") {
    composable("home") {
        PantallaHome(
            onNavigateToUser = { userId ->
                navController.navigate("user/$userId")
            }
        )
    }
    composable(
        route = "user/{userId}",
        arguments = listOf(navArgument("userId") { type = NavType.IntType })
    ) { backStackEntry ->
        val userId = backStackEntry.arguments?.getInt("userId") ?: 0
        PantallaUsuario(userId)
    }
}
```

### Método 2: Objetos complejos (con kotlinx.serialization)
```kotlin
// En build.gradle:
// id("org.jetbrains.kotlin.plugin.serialization")

@Serializable
data class Usuario(val id: Int, val nombre: String)

// Rutas type-safe
@Serializable object Home
@Serializable data class UserDetails(val userId: Int)

NavHost(navController, startDestination = Home) {
    composable<Home> {
        PantallaHome(
            onNavigateToUser = { userId ->
                navController.navigate(UserDetails(userId))
            }
        )
    }
    composable<UserDetails> { backStackEntry ->
        val userDetails = backStackEntry.toRoute<UserDetails>()
        PantallaUsuario(userDetails.userId)
    }
}
```

---

## 5. State Hoisting Pattern 🎈

**State Hoisting** = "Elevar el estado". El estado vive en el padre, no en el hijo.

### ❌ Mal: Estado interno (stateful)
```kotlin
@Composable
fun CampoTextoMalo() {
    var texto by remember { mutableStateOf("") } // Estado DENTRO
    
    OutlinedTextField(
        value = texto,
        onValueChange = { texto = it }
    )
}
// Problema: Nadie más puede acceder al "texto"
```

### ✅ Bien: State Hoisting (stateless)
```kotlin
@Composable
fun CampoTextoBueno(
    texto: String,
    onTextoChange: (String) -> Unit
) {
    OutlinedTextField(
        value = texto,
        onValueChange = onTextoChange
    )
}

// Uso:
@Composable
fun PantallaPadre() {
    var texto by remember { mutableStateOf("") }
    
    CampoTextoBueno(
        texto = texto,
        onTextoChange = { texto = it }
    )
    
    // Ahora puedo usar "texto" en otros lugares
    Text("Escribiste: $texto")
}
```

---

## 6. Composables Stateless vs Stateful 🧩

### Stateless (sin estado)
- No usan `remember` ni `mutableStateOf`
- Reciben todo por parámetros
- **Ventajas**: Reusables, testeables, predecibles

```kotlin
@Composable
fun BotonContador(
    contador: Int,
    onIncrement: () -> Unit
) {
    Button(onClick = onIncrement) {
        Text("Clicks: $contador")
    }
}
```

### Stateful (con estado)
- Manejan su propio estado con `remember`
- Útiles para componentes "contenedores"

```kotlin
@Composable
fun PantallaContador() {
    var contador by remember { mutableStateOf(0) }
    
    BotonContador(
        contador = contador,
        onIncrement = { contador++ }
    )
}
```

> **Regla de oro:** Haz tus composables **stateless** cuando sea posible. El estado debe vivir lo más arriba que necesites compartirlo.

---

## 🎓 Tarea de la Semana

Crea una app de lista de tareas con navegación:

1.  **Pantalla Home**: `LazyColumn` con lista de tareas
2.  **Usa keys** para cada tarea (por ID)
3.  **Al hacer clic en una tarea**: Navega a pantalla de detalles
4.  **Pasa el ID de la tarea** como argumento
5.  **Aplica State Hoisting**: El estado de las tareas debe vivir en el nivel superior
6.  **Botón "+"**: Navega a pantalla de "Nueva Tarea"

**Bonus:** Agrega un `NavigationBar` en el bottom con dos tabs: "Tareas" y "Completadas".

¡A programar! 💻
