# Sample NPC Script in Python (.py)
# ====================================
# This is a sample NPC script demonstrating how to write scripts in Python for Swordie
#
# Available bindings (variables available in script):
#   sm      - ScriptManager instance (main interface for NPC actions)
#   chr     - Current character (Char object)
#   field   - Current field/map (Field object)
#   parentID - NPC template ID
#   scriptType - ScriptType enum
#   objectID - Object ID of the NPC
#
# Usage:
#   Place this file in scripts/npc/ folder
#   File name should be {npcId}.py (e.g., 9999999.py)

# ==========================================
# Example 1: Simple message
# ==========================================
# sm.sendSay("Hello! I am a sample NPC.")

# ==========================================
# Example 2: Ask yes/no question
# ==========================================
# response = sm.sendAskYesNo("Do you want to continue?")
# if response:
#     sm.sendSay("You said yes!")
# else:
#     sm.sendSay("You said no!")

# ==========================================
# Example 3: Multiple choice menu
# ==========================================
def showMainMenu():
    choice = sm.sendNext("Welcome to the Sample NPC!\r\n\r\n" +
                         "#L0#Tell me about this server#l\r\n" +
                         "#L1#Check my stats#l\r\n" +
                         "#L2#Give me an item#l\r\n" +
                         "#L3#Warp me somewhere#l\r\n" +
                         "#L4#Exit#l")
    
    if choice == 0:
        showAbout()
    elif choice == 1:
        showStats()
    elif choice == 2:
        giveItem()
    elif choice == 3:
        warpPlayer()
    elif choice == 4:
        sm.sendSay("Goodbye!")

def showAbout():
    sm.sendSay("This is a Swordie MapleStory server!\r\n\r\n" +
               "You can write NPC scripts in both Python (.py) and Kotlin (.kts)")
    sm.sendSay("Python scripts use Jython, which is Python 2.7 compatible.\r\n" +
               "Kotlin scripts use the Kotlin Script Engine (JSR-223).")
    showMainMenu()

def showStats():
    sm.sendSay("Your stats:\r\n\r\n" +
               "#bName:#k {}\r\n".format(chr.getName()) +
               "#bLevel:#k {}\r\n".format(chr.getLevel()) +
               "#bJob:#k {}\r\n".format(chr.getJob()) +
               "#bMesos:#k {:,}\r\n".format(chr.getMoney()) +
               "#bHP:#k {:,} / {:,}\r\n".format(chr.getHp(), chr.getMaxHp()) +
               "#bMP:#k {:,} / {:,}".format(chr.getMp(), chr.getMaxMp()))
    showMainMenu()

def giveItem():
    itemId = 2000000  # Red Potion
    quantity = 10
    
    if sm.canHold(itemId, quantity):
        sm.giveItem(itemId, quantity)
        sm.sendSay("I gave you {} #i{}# #t{}#!".format(quantity, itemId, itemId))
    else:
        sm.sendSay("You don't have enough inventory space!")
    showMainMenu()

def warpPlayer():
    mapId = 100000000  # Henesys
    sm.sendSay("Warping you to Henesys!")
    sm.warp(mapId)

# Start the script
showMainMenu()
