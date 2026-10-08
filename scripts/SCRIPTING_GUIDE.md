# NPC Script Writing Guide

This server supports writing NPC scripts in both **Python** (.py) and **Kotlin** (.kts) languages.

## Script Location

All NPC scripts are located in the `scripts/npc/` folder. The filename should match the NPC template ID:
- Python: `{npcId}.py` (e.g., `9000001.py`)
- Kotlin: `{npcId}.kts` (e.g., `9000001.kts`)

If both `.py` and `.kts` files exist for the same NPC, the **.py** file takes priority.

## Available Bindings (Variables)

The following variables are automatically available in your scripts:

| Variable | Type | Description |
|----------|------|-------------|
| `sm` | ScriptManager | Main interface for NPC actions |
| `chr` | Char | Current character object |
| `field` | Field | Current map/field object |
| `parentID` | int | NPC template ID |
| `scriptType` | ScriptType | Type of script (Npc, Quest, etc.) |
| `objectID` | int | Object ID of the NPC |

---

## Python Scripts (.py)

Python scripts use **Jython** (Python 2.7 compatible).

### Basic Example

```python
# Simple greeting
sm.sendSay("Hello! Welcome to the server!")
```

### Menu Example

```python
def showMainMenu():
    choice = sm.sendNext("What would you like to do?\r\n\r\n" +
                         "#L0#Check my stats#l\r\n" +
                         "#L1#Get an item#l\r\n" +
                         "#L2#Exit#l")
    
    if choice == 0:
        showStats()
    elif choice == 1:
        giveItem()
    elif choice == 2:
        sm.sendSay("Goodbye!")

def showStats():
    sm.sendSay("Level: {}\r\nJob: {}".format(chr.getLevel(), chr.getJob()))
    showMainMenu()

def giveItem():
    itemId = 2000000  # Red Potion
    if sm.canHold(itemId, 10):
        sm.giveItem(itemId, 10)
        sm.sendSay("Here's 10 potions!")
    else:
        sm.sendSay("You don't have enough space!")
    showMainMenu()

showMainMenu()
```

### Importing Java Classes

```python
from net.swordie.ms.enums import InvType
from net.swordie.ms.loaders import ItemData

# Use the imported classes
itemInfo = ItemData.getItemInfoByID(2000000)
```

---

## Kotlin Scripts (.kts)

Kotlin scripts use the **Kotlin Script Engine** (JSR-223). They offer better IDE support with type checking and auto-completion.

### Basic Example

```kotlin
import net.swordie.ms.scripts.ScriptManager

val sm = bindings["sm"] as ScriptManager

sm.sendSay("Hello! Welcome to the server!")
```

### Menu Example

```kotlin
import net.swordie.ms.scripts.ScriptManager
import net.swordie.ms.client.character.Char

val sm = bindings["sm"] as ScriptManager
val chr = bindings["chr"] as Char

fun showMainMenu() {
    val choice = sm.sendNext("""
        What would you like to do?
        
        #L0#Check my stats#l
        #L1#Get an item#l
        #L2#Exit#l
    """.trimIndent())
    
    when (choice) {
        0 -> showStats()
        1 -> giveItem()
        2 -> sm.sendSay("Goodbye!")
    }
}

fun showStats() {
    sm.sendSay("Level: ${chr.level}\nJob: ${chr.job}")
    showMainMenu()
}

fun giveItem() {
    val itemId = 2000000  // Red Potion
    if (sm.canHold(itemId, 10)) {
        sm.giveItem(itemId, 10)
        sm.sendSay("Here's 10 potions!")
    } else {
        sm.sendSay("You don't have enough space!")
    }
    showMainMenu()
}

showMainMenu()
```

---

## Common ScriptManager Methods

### Dialog Methods

| Method | Description |
|--------|-------------|
| `sm.sendSay(text)` | Show a simple message |
| `sm.sendNext(text)` | Show message with Next button, returns selection |
| `sm.sendPrev(text)` | Show message with Prev button |
| `sm.sendOk(text)` | Show message with OK button |
| `sm.sendAskYesNo(text)` | Ask yes/no question, returns true/false |
| `sm.sendAskText(text, default, min, max)` | Ask for text input |

### Item Methods

| Method | Description |
|--------|-------------|
| `sm.canHold(itemId)` | Check if can hold 1 item |
| `sm.canHold(itemId, quantity)` | Check if can hold quantity of item |
| `sm.hasItem(itemId)` | Check if has item |
| `sm.hasItem(itemId, quantity)` | Check if has quantity of item |
| `sm.giveItem(itemId)` | Give 1 item |
| `sm.giveItem(itemId, quantity)` | Give quantity of item |
| `sm.takeItem(itemId)` | Take 1 item |
| `sm.takeItem(itemId, quantity)` | Take quantity of item |

### Player Methods

| Method | Description |
|--------|-------------|
| `sm.warp(mapId)` | Warp to map |
| `sm.warp(mapId, portal)` | Warp to map at portal |
| `sm.addMeso(amount)` | Give mesos |
| `sm.addExp(amount)` | Give experience |
| `sm.getLevel()` | Get player level |
| `sm.getJob()` | Get player job |
| `sm.getMeso()` | Get player mesos |
| `sm.getFieldID()` | Get current map ID |

### Shop/Storage

| Method | Description |
|--------|-------------|
| `sm.openShop(shopId)` | Open NPC shop |
| `sm.openTrunk(npcId)` | Open storage |

---

## Reloading Scripts

Use the in-game command to reload all scripts:
```
@reloadscripts
```
or
```
@rs
```

This clears both Python and Kotlin script caches.

---

## Comparison: Python vs Kotlin

| Feature | Python (.py) | Kotlin (.kts) |
|---------|-------------|---------------|
| Syntax | Simpler, more concise | More verbose but type-safe |
| IDE Support | Basic | Full IntelliJ/VS Code support |
| Type Checking | None (dynamic) | Full static type checking |
| Import Syntax | `from x import y` | `import x.y` |
| String Formatting | `"{}".format(x)` | `"${x}"` or `"$x"` |
| Learning Curve | Lower | Higher (need to know Kotlin) |

### When to use Python
- Quick scripts
- Simple NPCs
- When you're familiar with Python

### When to use Kotlin
- Complex NPCs with lots of logic
- When you want IDE auto-completion
- When you want compile-time error checking
- For maintainability in larger projects

---

## Example Scripts

See the sample scripts in `scripts/npc/`:
- `sample_python.py` - Comprehensive Python example
- `sample_kotlin.kts` - Comprehensive Kotlin example
