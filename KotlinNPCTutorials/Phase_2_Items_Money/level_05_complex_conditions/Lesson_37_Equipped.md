# 🎓 Level 37: แฟชั่นนิสต้า (Equipped Item Check)

เช็คว่าใส่อะไรอยู่? (ไม่ใช่แค่มีในกระเป๋า แต่ต้อง **สวมใส่** อยู่จริงๆ)

## 📜 ภารกิจที่ 40: เช็คของที่ใส่อยู่
เราต้องใช้ `chr.getEquippedInventory().getItemBySlot(slotID)`... ยากไป!
ใน Swordie เราวนลูปเช็คเอาดีกว่า หรือใช้ Helper (ถ้ามี)

แต่วิธีที่ชัวร์ที่สุดคือ:
1.  ดึง `Inventory` แบบ `EQUIPPED` (Type 1)
2.  วนลูปหา Item ID

### **Code ตัวอย่าง (CheckWear.kts)**
```kotlin
import net.swordie.ms.enums.InvType

// ฟังก์ชันเช็คว่าใส่อยู่ไหม
fun isWearing(itemID: Int): Boolean {
    val equipped = chr.getInventoryByType(InvType.EQUIPPED)
    // .items คือ List ของในกระเป๋า
    for (item in equipped.items) {
        if (item.itemId == itemID) return true
    }
    return false
}

val hatID = 1000001 // หมวกใบหนึ่ง
if (isWearing(hatID)) {
    sm.sendSayOkay("โห! ใส่หมวกใบนี้เท่จัง")
} else {
    sm.sendSayOkay("ลองใส่หมวก ID $hatID มาโชว์หน่อยสิ")
}
```

---

## 🧐 **Body Parts (Slot ID)**
ถ้าอยากเจาะจงว่าใส่อยู่ที่ "หัว" หรือ "แหวน" ต้องเช็ค `BagIndex` (Slot ID)
*   แต่วิธีวนลูปข้างบนง่ายกว่าสำหรับมือใหม่

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** งานเต้นรำหน้ากาก
1.  ผู้เล่นต้องใส่ "Mask" (สมมติ ID 1012000)
2.  ถ้าใส่ -> "เชิญเข้างานครับ"
3.  ถ้าไม่ใส่ -> "ห้ามเข้า! ไปใส่หน้ากากมาก่อน"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
import net.swordie.ms.enums.InvType

val mask = 1012000
val inv = chr.getInventoryByType(InvType.EQUIPPED)
// ใช้แสกนหาด้วย stream (Advance หน่อยแต่น่ารู้)
val wearing = inv.items.stream().anyMatch { it.itemId == mask }

if (wearing) {
    sm.sendSayOkay("หน้ากากสวยนี่... เชิญ")
} else {
    sm.sendSayOkay("No Mask, No Entry!")
}
```
</details>
