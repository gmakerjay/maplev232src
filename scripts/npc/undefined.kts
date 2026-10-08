/**
 * Default Undefined NPC Script (Kotlin)
 * This script is executed when no specific script is found for an NPC
 */

import net.swordie.ms.scripts.ScriptManager

val sm = bindings["sm"] as ScriptManager
val parentID = bindings["parentID"] as Int

sm.chat("(Npc) Not coded. ID: $parentID, Field: ${sm.fieldID}")
