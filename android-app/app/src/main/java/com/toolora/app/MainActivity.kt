package com.toolora.app

import android.os.Bundle
import android.util.Base64
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Code
import androidx.compose.material.icons.outlined.ContentCopy
import androidx.compose.material.icons.outlined.DataObject
import androidx.compose.material.icons.outlined.Key
import androidx.compose.material.icons.outlined.TextFields
import androidx.compose.material.icons.outlined.Tune
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.json.JSONArray
import org.json.JSONObject
import java.security.SecureRandom

private val Ink = Color(0xFF152238)
private val Blue = Color(0xFF345CFF)
private val PaleBlue = Color(0xFFEAF0FF)
private val Canvas = Color(0xFFF6F8FC)
private val Muted = Color(0xFF68758A)

private enum class Tool(val title: String, val description: String) {
    CASE("Case Converter", "Change text capitalization"),
    COUNTER("Character Counter", "Count words and characters"),
    JSON("JSON Formatter", "Format and validate JSON"),
    BASE64("Base64 Encoder", "Encode or decode text"),
    PASSWORD("Password Generator", "Create secure passwords")
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { TooloraApp() }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun TooloraApp() {
    var selected by remember { mutableStateOf<Tool?>(null) }
    var input by remember { mutableStateOf("") }
    var output by remember { mutableStateOf("") }
    var message by remember { mutableStateOf("") }
    var passwordLength by remember { mutableIntStateOf(20) }

    MaterialTheme {
        Scaffold(
            containerColor = Canvas,
            topBar = {
                TopAppBar(
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier.size(38.dp).clip(RoundedCornerShape(12.dp)).background(Blue),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Outlined.Tune, contentDescription = null, tint = Color.White)
                            }
                            Spacer(Modifier.width(10.dp))
                            Column {
                                Text("Toolora", fontWeight = FontWeight.ExtraBold, color = Ink, fontSize = 21.sp)
                                Text("Smart tools. Simple solutions.", color = Muted, fontSize = 11.sp)
                            }
                        }
                    },
                    navigationIcon = {
                        if (selected != null) {
                            IconButton(onClick = {
                                selected = null
                                input = ""
                                output = ""
                                message = ""
                            }) { Icon(Icons.Outlined.ArrowBack, contentDescription = "Back", tint = Ink) }
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = Canvas)
                )
            }
        ) { padding ->
            if (selected == null) {
                HomeScreen(
                    modifier = Modifier.padding(padding),
                    onSelect = {
                        selected = it
                        input = ""
                        output = ""
                        message = ""
                    }
                )
            } else {
                ToolScreen(
                    tool = selected!!,
                    input = input,
                    output = output,
                    message = message,
                    passwordLength = passwordLength,
                    onInput = { input = it; output = ""; message = "" },
                    onLength = { passwordLength = it },
                    onRun = {
                        try {
                            when (selected!!) {
                                Tool.CASE -> output = when (message) {
                                    "UPPER" -> input.uppercase()
                                    "LOWER" -> input.lowercase()
                                    "TITLE" -> input.split(Regex("\\s+")).joinToString(" ") { word ->
                                        word.lowercase().replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
                                    }
                                    else -> input
                                }
                                Tool.COUNTER -> output = "Characters (with spaces): ${input.length}\nCharacters (without spaces): ${input.count { !it.isWhitespace() }}\nWords: ${input.trim().split(Regex("\\s+")).count { it.isNotBlank() }}\nLines: ${if (input.isEmpty()) 0 else input.lines().size}"
                                Tool.JSON -> {
                                    val trimmed = input.trim()
                                    output = when {
                                        trimmed.startsWith("{") -> JSONObject(trimmed).toString(2)
                                        trimmed.startsWith("[") -> JSONArray(trimmed).toString(2)
                                        else -> throw IllegalArgumentException("Enter a JSON object or array.")
                                    }
                                    message = "VALID JSON"
                                }
                                Tool.BASE64 -> output = if (message == "DECODE") {
                                    String(Base64.decode(input.trim(), Base64.DEFAULT), Charsets.UTF_8)
                                } else {
                                    Base64.encodeToString(input.toByteArray(Charsets.UTF_8), Base64.NO_WRAP)
                                }
                                Tool.PASSWORD -> {
                                    val alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*+-_?"
                                    val random = SecureRandom()
                                    output = buildString { repeat(passwordLength) { append(alphabet[random.nextInt(alphabet.length)]) } }
                                }
                            }
                            if (selected != Tool.JSON) message = "Done — processed on this device."
                        } catch (e: Exception) {
                            output = ""
                            message = if (selected == Tool.JSON) "Invalid JSON: check brackets, commas and quotes." else "Could not process input. Please check the text and try again."
                        }
                    }
                )
            }
        }
    }
}

@Composable
private fun HomeScreen(modifier: Modifier = Modifier, onSelect: (Tool) -> Unit) {
    Column(modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 20.dp)) {
        Spacer(Modifier.height(12.dp))
        Card(
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = Ink),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(Modifier.padding(24.dp)) {
                Text("YOUR EVERYDAY TOOLKIT", color = Color(0xFFB9C7FF), fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.5.sp)
                Spacer(Modifier.height(12.dp))
                Text("Get things done.\nSimply.", color = Color.White, fontSize = 31.sp, lineHeight = 36.sp, fontWeight = FontWeight.ExtraBold)
                Spacer(Modifier.height(10.dp))
                Text("Useful tools in one clean workspace. Fast, private and easy to use.", color = Color(0xFFD1D8E6), fontSize = 14.sp, lineHeight = 21.sp)
                Spacer(Modifier.height(18.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.clip(CircleShape).background(Color(0xFF244538)).padding(horizontal = 10.dp, vertical = 6.dp)) {
                        Text("●  On-device processing", color = Color(0xFF9CE8C2), fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        }
        Spacer(Modifier.height(24.dp))
        Text("Popular tools", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Ink)
        Text("Choose a tool to get started", color = Muted, fontSize = 13.sp, modifier = Modifier.padding(top = 4.dp, bottom = 14.dp))
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.fillMaxWidth().height(440.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            userScrollEnabled = false
        ) {
            items(Tool.entries.toList()) { tool ->
                ToolCard(tool = tool, onClick = { onSelect(tool) })
            }
        }
        Spacer(Modifier.height(20.dp))
        Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(18.dp)) {
            Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Outlined.Code, contentDescription = null, tint = Blue, modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(12.dp))
                Column {
                    Text("Private by design", fontWeight = FontWeight.Bold, color = Ink)
                    Text("These tools run locally. Your text is not uploaded by this app.", color = Muted, fontSize = 12.sp, lineHeight = 17.sp)
                }
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun ToolCard(tool: Tool, onClick: () -> Unit) {
    val icon = when (tool) {
        Tool.CASE, Tool.COUNTER -> Icons.Outlined.TextFields
        Tool.JSON -> Icons.Outlined.DataObject
        Tool.BASE64 -> Icons.Outlined.Code
        Tool.PASSWORD -> Icons.Outlined.Key
    }
    Card(
        onClick = onClick,
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth().height(154.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Box(Modifier.size(42.dp).clip(RoundedCornerShape(14.dp)).background(PaleBlue), contentAlignment = Alignment.Center) {
                Icon(icon, contentDescription = null, tint = Blue, modifier = Modifier.size(23.dp))
            }
            Spacer(Modifier.height(12.dp))
            Text(tool.title, color = Ink, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(Modifier.height(4.dp))
            Text(tool.description, color = Muted, fontSize = 11.sp, lineHeight = 15.sp)
        }
    }
}

@Composable
private fun ToolScreen(
    tool: Tool,
    input: String,
    output: String,
    message: String,
    passwordLength: Int,
    onInput: (String) -> Unit,
    onLength: (Int) -> Unit,
    onRun: () -> Unit
) {
    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 20.dp, vertical = 12.dp)
    ) {
        Text(tool.title, color = Ink, fontSize = 26.sp, fontWeight = FontWeight.ExtraBold)
        Text(tool.description, color = Muted, modifier = Modifier.padding(top = 4.dp, bottom = 20.dp))
        if (tool == Tool.PASSWORD) {
            Text("Password length: $passwordLength", color = Ink, fontWeight = FontWeight.SemiBold)
            Slider(value = passwordLength.toFloat(), onValueChange = { onLength(it.toInt()) }, valueRange = 8f..64f, steps = 55)
            Text("Uses SecureRandom for cryptographically strong random characters.", color = Muted, fontSize = 12.sp)
            Spacer(Modifier.height(12.dp))
        }
        if (tool != Tool.PASSWORD) {
            OutlinedTextField(
                value = input,
                onValueChange = onInput,
                modifier = Modifier.fillMaxWidth().height(if (tool == Tool.COUNTER) 190.dp else 220.dp),
                label = { Text(if (tool == Tool.BASE64) "Text to encode / Base64 to decode" else "Enter your text") },
                placeholder = { Text(when (tool) {
                    Tool.JSON -> "{ \"name\": \"Toolora\" }"
                    Tool.BASE64 -> "Enter text here"
                    Tool.CASE -> "Type or paste your text"
                    Tool.COUNTER -> "Start typing to count words and characters"
                    else -> ""
                }) },
                shape = RoundedCornerShape(18.dp),
                supportingText = if (tool == Tool.COUNTER) { { Text("${input.length} characters · ${input.trim().split(Regex("\\s+")).count { it.isNotBlank() }} words") } } else null
            )
        }
        if (tool == Tool.CASE) {
            Spacer(Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(onClick = { onInput(input); }) { Text("Input") }
                OutlinedButton(onClick = { onRun(); }) { Text("Convert") }
            }
            Text("Choose conversion below", color = Muted, fontSize = 12.sp, modifier = Modifier.padding(top = 8.dp))
        }
        if (tool == Tool.BASE64) {
            Spacer(Modifier.height(12.dp))
            Text("Tap Encode for text → Base64, or Decode for Base64 → text.", color = Muted, fontSize = 12.sp)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = onRun) { Text("Encode") }
                OutlinedButton(onClick = onRun) { Text("Decode requires mode") }
            }
        } else {
            Button(
                onClick = onRun,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text(when (tool) {
                    Tool.CASE -> "Convert text"
                    Tool.COUNTER -> "Count text"
                    Tool.JSON -> "Format & validate"
                    Tool.BASE64 -> "Encode"
                    Tool.PASSWORD -> "Generate password"
                }, fontWeight = FontWeight.Bold)
            }
        }
        if (message.isNotBlank()) {
            Spacer(Modifier.height(12.dp))
            Text(message, color = if (message == "VALID JSON") Color(0xFF16794B) else Muted, fontSize = 13.sp)
        }
        if (output.isNotBlank()) {
            Spacer(Modifier.height(16.dp))
            Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(18.dp)) {
                Column(Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                        Text(if (tool == Tool.PASSWORD) "Generated result" else "Result", color = Ink, fontWeight = FontWeight.Bold)
                        Icon(Icons.Outlined.ContentCopy, contentDescription = "Copy result", tint = Blue)
                    }
                    Spacer(Modifier.height(10.dp))
                    Text(output, color = Ink, fontSize = 14.sp, lineHeight = 20.sp)
                }
            }
        }
        Spacer(Modifier.height(28.dp))
        Text("Toolora • Your data stays on this device", color = Muted, fontSize = 11.sp)
    }
}
