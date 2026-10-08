/**
 * Sample NPC Script in Kotlin (.kts)
 * ====================================
 * This is a sample NPC script demonstrating how to write scripts in Kotlin for Swordie
 *
 * Available bindings (variables available in script):
 *   sm       - ScriptManager instance (main interface for NPC actions)
 *   chr      - Current character (Char object)
 *   field    - Current field/map (Field object)
 *   parentID - NPC template ID
 *   scriptType - ScriptType enum
 *   objectID - Object ID of the NPC
 *
 * Usage:
 *   Place this file in scripts/npc/ folder
 *   File name should be {npcId}.kts (e.g., 9999999.kts)
 *
 * Note: Kotlin scripts have better IDE support and type safety compared to Python
 */

import net.swordie.ms.scripts.ScriptManager
import net.swordie.ms.client.character.Char
import net.swordie.ms.world.field.Field

// Get bindings
val sm = bindings["sm"] as ScriptManager
val chr = bindings["chr"] as Char
val field = bindings["field"] as Field
val parentID = bindings["parentID"] as Int

// ==========================================
// Helper functions
// ==========================================

fun showMainMenu() {
    val choice = sm.sendNext("""
        Welcome to the Sample NPC (Kotlin)!
        
        #L0#Tell me about this server#l
        #L1#Check my stats#l
        #L2#Give me an item#l
        #L3#Warp me somewhere#l
        #L4#Exit#l
    """.trimIndent())
    
    when (choice) {
        0 -> showAbout()
        1 -> showStats()
        2 -> giveItem()
        3 -> warpPlayer()
        4 -> sm.sendSay("Goodbye!")
    }
}

fun showAbout() {
    sm.sendSay("""
        This is a Swordie MapleStory server!
        
        You can write NPC scripts in both Python (.py) and Kotlin (.kts)
    """.trimIndent())
    
    sm.sendSay("""
        Python scripts use Jython, which is Python 2.7 compatible.
        Kotlin scripts use the Kotlin Script Engine (JSR-223).
        
        Kotlin has better IDE support with type checking and auto-completion!
    """.trimIndent())
    
    showMainMenu()
}

fun showStats() {
    val stats = """
        Your stats:
        
        #bName:#k ${chr.name}
        #bLevel:#k ${chr.level}
        #bJob:#k ${chr.job}
        #bMesos:#k ${String.format("%,d", chr.money)}
        #bHP:#k ${String.format("%,d", chr.hp)} / ${String.format("%,d", chr.maxHp)}
        #bMP:#k ${String.format("%,d", chr.mp)} / ${String.format("%,d", chr.maxMp)}
        #bCurrent Map:#k ${field.id} (${field.name})
    """.trimIndent()
    
    sm.sendSay(stats)
    showMainMenu()
}

fun giveItem() {
    val itemId = 2000000  // Red Potion
    val quantity = 10
    
    if (sm.canHold(itemId, quantity)) {
        sm.giveItem(itemId, quantity)
        sm.sendSay("I gave you $quantity #i$itemId# #t$itemId#!")
    } else {
        sm.sendSay("You don't have enough inventory space!")
    }
    showMainMenu()
}

fun warpPlayer() {
    val mapId = 100000000  // Henesys
    sm.sendSay("Warping you to Henesys!")
    sm.warp(mapId)
}

// ==========================================
// Start the script
// ==========================================
showMainMenu()
