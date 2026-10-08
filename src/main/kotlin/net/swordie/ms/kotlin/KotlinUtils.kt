package net.swordie.ms.kotlin

import net.swordie.ms.client.character.Char
import net.swordie.ms.enums.ChatType
import net.swordie.ms.connection.packet.UserLocal
import net.swordie.ms.loaders.ItemData
import org.apache.logging.log4j.LogManager

/**
 * ตัวอย่างการใช้ Kotlin ร่วมกับ Java Code เดิม
 * 
 * วิธีใช้งาน:
 * 1. Import class นี้ใน Java: import net.swordie.ms.kotlin.KotlinUtils;
 * 2. เรียกใช้: KotlinUtils.sendMessage(chr, "Hello!");
 * 
 * หรือใน Kotlin:
 * KotlinUtils.sendMessage(chr, "Hello!")
 */
object KotlinUtils {
    
    private val log = LogManager.getLogger(KotlinUtils::class.java)
    
    /**
     * ส่งข้อความไปยังผู้เล่น
     */
    @JvmStatic
    fun sendMessage(chr: Char?, message: String, chatType: ChatType = ChatType.Notice) {
        chr?.let {
            it.write(UserLocal.chatMsg(chatType, message))
            log.info("[Kotlin] Sent message to ${it.name}: $message")
        }
    }
    
    /**
     * ส่งข้อความแบบ Popup
     */
    @JvmStatic
    fun sendPopup(chr: Char?, message: String) {
        sendMessage(chr, message, ChatType.Notice2)
    }
    
    /**
     * ตรวจสอบว่าผู้เล่นมี Item หรือไม่
     */
    @JvmStatic
    fun hasItem(chr: Char?, itemId: Int, quantity: Int = 1): Boolean {
        return chr?.hasItemCount(itemId, quantity) ?: false
    }
    
    /**
     * ให้ Item แก่ผู้เล่น
     */
    @JvmStatic
    fun giveItem(chr: Char?, itemId: Int, quantity: Int = 1): Boolean {
        return chr?.let {
            try {
                val item = ItemData.getEquipDeepCopy(itemId, true)
                    ?: ItemData.getItemDeepCopy(itemId)
                if (item != null) {
                    item.quantity = quantity
                    it.addItemToInventory(item.invType, item, true)
                    log.info("[Kotlin] Gave item $itemId x$quantity to ${it.name}")
                    true
                } else {
                    log.warn("[Kotlin] Item $itemId not found")
                    false
                }
            } catch (e: Exception) {
                log.error("[Kotlin] Error giving item: ${e.message}")
                false
            }
        } ?: false
    }
    
    /**
     * ให้ Meso แก่ผู้เล่น
     */
    @JvmStatic
    fun giveMeso(chr: Char?, amount: Long) {
        chr?.let {
            it.addMoney(amount)
            log.info("[Kotlin] Gave $amount meso to ${it.name}")
        }
    }
    
    /**
     * ให้ EXP แก่ผู้เล่น
     */
    @JvmStatic
    fun giveExp(chr: Char?, amount: Long) {
        chr?.let {
            it.addExp(amount)
            log.info("[Kotlin] Gave $amount EXP to ${it.name}")
        }
    }
    
    /**
     * Extension function: ส่งข้อความง่ายๆ
     * ใช้ใน Kotlin: chr.notify("Hello!")
     */
    fun Char.notify(message: String) {
        this.write(UserLocal.chatMsg(ChatType.Notice, message))
    }
    
    /**
     * Extension function: ให้ไอเทมง่ายๆ
     * ใช้ใน Kotlin: chr.give(itemId, quantity)
     */
    fun Char.give(itemId: Int, quantity: Int = 1): Boolean {
        return giveItem(this, itemId, quantity)
    }
}
