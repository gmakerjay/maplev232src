package net.swordie.ms.kotlin.commands

import net.swordie.ms.client.character.Char
import net.swordie.ms.client.character.commands.AdminCommand
import net.swordie.ms.client.character.commands.Command
import net.swordie.ms.enums.AccountType
import net.swordie.ms.enums.ChatType
import net.swordie.ms.loaders.ItemData
import org.apache.logging.log4j.LogManager

/**
 * =====================================================
 * Kotlin Commands - ทดสอบการทำงานของ Kotlin ในเกม
 * =====================================================
 * 
 * คำสั่งทั้งหมดนี้เขียนด้วย Kotlin 100%
 * และทำงานร่วมกับ Java code เดิมได้อย่างสมบูรณ์
 * 
 * วิธีใช้งานในเกม:
 * - @kotlintest           - ทดสอบว่า Kotlin ทำงานได้
 * - @kgive <itemId> <qty> - ให้ไอเทม
 * - @kmeso <amount>       - ให้ meso
 * - @kexp <amount>        - ให้ exp
 * - @kinfo                - แสดงข้อมูลตัวละคร
 */
object KotlinCommands {

    private val log = LogManager.getLogger(KotlinCommands::class.java)

    /**
     * @kotlintest - ทดสอบว่า Kotlin ทำงานได้
     */
    @Command(names = ["kotlintest", "kt", "ktest"], requiredType = AccountType.Player)
    class KotlinTest : AdminCommand() {
        companion object {
            @JvmStatic
            fun execute(chr: Char, @Suppress("UNUSED_PARAMETER") args: Array<String>) {
                // ส่งข้อความหลายแบบ
                chr.chatMessage(ChatType.Notice2, "╔════════════════════════════════════╗")
                chr.chatMessage(ChatType.Notice2, "║   🎉 KOTLIN IS WORKING! 🎉         ║")
                chr.chatMessage(ChatType.Notice2, "╠════════════════════════════════════╣")
                chr.chatMessage(ChatType.Notice2, "║ Version: Kotlin 1.9.23             ║")
                chr.chatMessage(ChatType.Notice2, "║ JVM Target: 21                     ║")
                chr.chatMessage(ChatType.Notice2, "║ Status: ✅ SUCCESS                 ║")
                chr.chatMessage(ChatType.Notice2, "╚════════════════════════════════════╝")
                
                // ใช้ String Template ของ Kotlin
                val playerName = chr.name
                val playerLevel = chr.level
                val playerJob = chr.job
                
                chr.chatMessage(ChatType.Tip, "Hello $playerName! You are Lv.$playerLevel ($playerJob)")
                
                // Log ไปที่ server console
                log.info("[Kotlin] Command executed by $playerName (Lv.$playerLevel)")
            }
        }
    }

    /**
     * @kgive <itemId> [quantity] - ให้ไอเทมจาก Kotlin
     */
    @Command(names = ["kgive", "kotlingive", "kg"], requiredType = AccountType.Tester)
    class KotlinGive : AdminCommand() {
        companion object {
            @JvmStatic
            fun execute(chr: Char, args: Array<String>) {
                if (args.size < 2) {
                    chr.chatMessage(ChatType.Notice, "[Kotlin] Usage: @kgive <itemId> [quantity]")
                    return
                }
                
                val itemId = args[1].toIntOrNull()
                if (itemId == null) {
                    chr.chatMessage(ChatType.Notice, "[Kotlin] Invalid item ID!")
                    return
                }
                
                val quantity = if (args.size > 2) args[2].toIntOrNull() ?: 1 else 1
                
                // ใช้ Java class จาก Kotlin
                val item = ItemData.getEquipDeepCopy(itemId, true)
                    ?: ItemData.getItemDeepCopy(itemId)
                
                if (item != null) {
                    item.quantity = quantity
                    chr.addItemToInventory(item.invType, item, true)
                    chr.chatMessage(ChatType.Notice2, "[Kotlin] ✅ Gave item $itemId x$quantity")
                    log.info("[Kotlin] Gave item $itemId x$quantity to ${chr.name}")
                } else {
                    chr.chatMessage(ChatType.Notice, "[Kotlin] ❌ Item $itemId not found!")
                }
            }
        }
    }

    /**
     * @kmeso <amount> - ให้ Meso จาก Kotlin
     */
    @Command(names = ["kmeso", "kotlinmeso", "km"], requiredType = AccountType.Tester)
    class KotlinMeso : AdminCommand() {
        companion object {
            @JvmStatic
            fun execute(chr: Char, args: Array<String>) {
                if (args.size < 2) {
                    chr.chatMessage(ChatType.Notice, "[Kotlin] Usage: @kmeso <amount>")
                    return
                }
                
                val amount = args[1].toLongOrNull()
                if (amount == null || amount <= 0) {
                    chr.chatMessage(ChatType.Notice, "[Kotlin] Invalid amount!")
                    return
                }
                
                chr.addMoney(amount)
                
                // Format number with commas
                val formatted = String.format("%,d", amount)
                chr.chatMessage(ChatType.Notice2, "[Kotlin] ✅ Received $formatted meso!")
                log.info("[Kotlin] Gave $amount meso to ${chr.name}")
            }
        }
    }

    /**
     * @kexp <amount> - ให้ EXP จาก Kotlin
     */
    @Command(names = ["kexp", "kotlinexp", "ke"], requiredType = AccountType.Tester)
    class KotlinExp : AdminCommand() {
        companion object {
            @JvmStatic
            fun execute(chr: Char, args: Array<String>) {
                if (args.size < 2) {
                    chr.chatMessage(ChatType.Notice, "[Kotlin] Usage: @kexp <amount>")
                    return
                }
                
                val amount = args[1].toLongOrNull()
                if (amount == null || amount <= 0) {
                    chr.chatMessage(ChatType.Notice, "[Kotlin] Invalid amount!")
                    return
                }
                
                val beforeLevel = chr.level
                chr.addExp(amount)
                val afterLevel = chr.level
                
                val formatted = String.format("%,d", amount)
                chr.chatMessage(ChatType.Notice2, "[Kotlin] ✅ Received $formatted EXP!")
                
                if (afterLevel > beforeLevel) {
                    chr.chatMessage(ChatType.Notice2, "[Kotlin] 🎉 LEVEL UP! Lv.$beforeLevel → Lv.$afterLevel")
                }
                
                log.info("[Kotlin] Gave $amount EXP to ${chr.name}")
            }
        }
    }

    /**
     * @kinfo - แสดงข้อมูลตัวละครแบบ Kotlin Style
     */
    @Command(names = ["kinfo", "kotlininfo", "ki"], requiredType = AccountType.Player)
    class KotlinInfo : AdminCommand() {
        companion object {
            @JvmStatic
            fun execute(chr: Char, @Suppress("UNUSED_PARAMETER") args: Array<String>) {
                chr.chatMessage(ChatType.SpeakerChannel, "╔══════════════════════════════════╗")
                chr.chatMessage(ChatType.SpeakerChannel, "║     CHARACTER INFO (Kotlin)      ║")
                chr.chatMessage(ChatType.SpeakerChannel, "╠══════════════════════════════════╣")
                
                // ดึงข้อมูลจาก CharacterStat
                val stat = chr.avatarData.characterStat
                
                // ใช้ Kotlin features
                val stats = mapOf(
                    "Name" to chr.name,
                    "Level" to chr.level.toString(),
                    "Job" to chr.job.toString(),
                    "STR" to stat.str.toString(),
                    "DEX" to stat.dex.toString(),
                    "INT" to stat.int.toString(),
                    "LUK" to stat.luk.toString(),
                    "HP" to "${stat.hp}/${stat.maxHp}",
                    "MP" to "${stat.mp}/${stat.maxMp}",
                    "Meso" to String.format("%,d", stat.money)
                )
                
                stats.forEach { (key, value) ->
                    chr.chatMessage(ChatType.SpeakerChannel, "║ $key: $value")
                }
                
                chr.chatMessage(ChatType.SpeakerChannel, "╚══════════════════════════════════╝")
                
                log.info("[Kotlin] Info command used by ${chr.name}")
            }
        }
    }

    /**
     * @khelp - แสดงคำสั่ง Kotlin ทั้งหมด
     */
    @Command(names = ["khelp", "kotlinhelp", "kh"], requiredType = AccountType.Player)
    class KotlinHelp : AdminCommand() {
        companion object {
            @JvmStatic
            fun execute(chr: Char, @Suppress("UNUSED_PARAMETER") args: Array<String>) {
                chr.chatMessage(ChatType.Notice2, "╔══════════════════════════════════╗")
                chr.chatMessage(ChatType.Notice2, "║      KOTLIN COMMANDS HELP        ║")
                chr.chatMessage(ChatType.Notice2, "╠══════════════════════════════════╣")
                chr.chatMessage(ChatType.Notice2, "║ @kotlintest - Test Kotlin        ║")
                chr.chatMessage(ChatType.Notice2, "║ @kgive <id> [qty] - Give item    ║")
                chr.chatMessage(ChatType.Notice2, "║ @kmeso <amt> - Give meso         ║")
                chr.chatMessage(ChatType.Notice2, "║ @kexp <amt> - Give EXP           ║")
                chr.chatMessage(ChatType.Notice2, "║ @kinfo - Show character info     ║")
                chr.chatMessage(ChatType.Notice2, "║ @khelp - Show this help          ║")
                chr.chatMessage(ChatType.Notice2, "╚══════════════════════════════════╝")
            }
        }
    }
}
