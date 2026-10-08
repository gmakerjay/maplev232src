# 🎓 Level 27: กระเป๋าเต็มไหม? (Inventory Full Check)

นี่คือ **บอสตัวจริง** ของการเขียน NPC ถ้าไม่เช็คจุดนี้ สคริปต์พังแน่นอน!

## 📜 ภารกิจที่ 30: ตรวจช่องว่าง
คำสั่ง: `sm.getEmptyInventorySlots(InvType)`
*   ต้อง Import `net.swordie.ms.enums.InvType` ก่อนถึงจะใช้ชื่อได้
*   ถ้าขี้เกียจ Import... ผมจะบอกความลับให้:
    *   ใช้ `checkIfCanHold(itemID, quantity)` ของ `InventoryModule` ง่ายกว่า! (แต่ยุ่งยากในสคริปต์)

เอาแบบมาตรฐานที่ใช้บ่อยสุดคือ **เช็คช่องว่างตามประเภทไอเทมที่เราจะแจก**

### **Code ตัวอย่าง (CheckSlots.kts)**
```kotlin
import net.swordie.ms.enums.InvType

// เช็คว่ากระเป๋า ETC (Type 4) ว่างไหม?
// InvType.ETC
if (chr.getInventoryByType(InvType.ETC).isFull()) {
    sm.sendSayOkay("กระเป๋า ETC เต็ม! ไปเคลียร์ก่อน!")
    sm.dispose() // จบข่าว
} 

// ถ้าจะแจกของ ก็ทำต่อได้เลย
sm.giveItem(4000000, 1)
```

---

## 🧐 **Helper Function (แนะนำให้ใช้)**
ปกติควรสร้าง function เช็คไว้เลย

```kotlin
fun canHold(type: InvType): Boolean {
    return !chr.getInventoryByType(type).isFull()
}
```

หรือถ้าจะแจกของหลายชิ้น:
```kotlin
// Swordie มีฟังก์ชันช่วยใน chr (User)
if (chr.canHold(2000000, 10)) { // เช็คว่าถือ Item ID นี้ จำนวนนี้ ได้ไหม?
    sm.giveItem(2000000, 10)
} else {
    sm.sendSayOkay("ช่องเต็มจ้า!")
}
```
**แนะนำ:** ใช้ `chr.canHold(itemID, quantity)` คือ The Best! มันเช็คให้ทั้ง Slot ว่าง และเช็คว่า Stack ได้ไหมด้วย

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** กล่องสุ่มใจเกเร (Lucky Box)
1.  กล่องนี้จะสุ่มแจกของ 1 อย่าง (Equip หรือ Consume ก็ได้)
2.  ผู้เล่นต้องมีช่องว่างใน **ทั้ง Equip และ Consume** อย่างน้อย 1 ช่อง (กันเหนียว)
3.  ถ้าช่องเต็มให้เตือน

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
import net.swordie.ms.enums.InvType

val eqFull = chr.getInventoryByType(InvType.EQUIP).isFull()
val useFull = chr.getInventoryByType(InvType.CONSUME).isFull()

if (eqFull || useFull) {
    sm.sendSayOkay("กรุณาทำช่อง Equip และ Consume ให้ว่างอย่างน้อย 1 ช่อง")
} else {
    // สุ่มแจก
    sm.giveItem(2000000)
    sm.sendSayOkay("ได้รับของแล้ว!")
}
```
</details>
