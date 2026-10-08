# 🎓 Level 40: โปรเจคจบเฟส 2 (The Merchant Graduate)

ยินดีด้วย! จบ Phase 2 แล้ว ตอนนี้คุณจัดการ **Items, Mesos, Quests, Stats, Skills** ได้คล่องปรื๋อ
มาทำโปรเจคใหญ่ส่งท้ายกัน!

## 📜 ภารกิจ Final: "The Black Market Trader" (พ่อค้าตลาดมืด)

**เนื้อเรื่อง:** พ่อค้าคนนี้แอบขายของผิดกฎหมาย (ยาเทพ) แต่เขาระแวงมาก
**เงื่อนไข:**
1.  **เพศ:** ขายให้เฉพาะผู้ชาย (Gender = 0)
2.  **เลเวล:** ต้องเลเวล 30+ ถึงจะคุยรู้เรื่อง
3.  **เงิน:** ต้องมีเงินติดตัวอย่างน้อย 50,000 Mesos (ค่าเปิดเมนู)
4.  **สินค้า:**
    *   **Power Elixir** (2000005) ราคา 5,000 Meso/ขวด
    *   **All Cure Potion** (2050004) ราคา 2,000 Meso/ขวด
5.  **ซื้อขาย:**
    *   ถามจำนวนที่จะซื้อ
    *   คำนวณราคา
    *   **เช็คช่องว่าง** (สำคัญ!)
    *   **เช็คเงิน**
    *   หักเงิน -> แจกของ
    *   ถ้าซื้อเกิน 100 ชิ้น ลดราคาให้ 10% (Discount Logic)

---

### **เฉลย (Full Script)**

```kotlin
import net.swordie.ms.enums.InvType

// 1. เช็คเพศ
if (chr.avatarData.avatarLook.gender != 0) {
    sm.sendSayOkay("ฉันไม่คุยกับผู้หญิง... ไปไกลๆ")
    sm.dispose()
}

// 2. เช็คเลเวล
if (chr.level < 30) {
    sm.sendSayOkay("ไอ้หนู... นมขวดยังไม่ทิ้งเลย กลับไปดูดนมก่อนไป๊")
    sm.dispose()
}

// 3. เช็คเงินเปิดเมนู
if (chr.getMesos() < 50000) {
    sm.sendSayOkay("ไม่มีตังค์ก็อย่ามาเกะกะ (ขั้นต่ำ 50k)")
    sm.dispose()
}

// เมนู
val menu = """
    อยากได้ยาดีๆ ไหม?
    #L0# Power Elixir (5,000)#l
    #L1# All Cure Potion (2,000)#l
""".trimIndent()

val sel = sm.sendAskMenu(menu)
var itemID = 0
var price = 0

if (sel == 0) {
    itemID = 2000005
    price = 5000
} else {
    itemID = 2050004
    price = 2000
}

// ถามจำนวน
val qty = sm.sendAskNumber("เอาเท่าไหร่ดี?", 1, 1, 999)

// คำนวณราคา
var total = price * qty.toLong()

// Logic ส่วนลด
if (qty >= 100) {
    total = (total * 0.9).toLong() // ลด 10%
    sm.sendNext("สั่งเยอะนี่หว่า... ลดให้ 10% เหลือ $total พอ")
} else {
    sm.sendNext("ราคาทั้งหมด $total Mesos")
}

// 4. เช็คช่อง & เงิน
val canHold = chr.getInventoryByType(InvType.CONSUME).canHold(itemID, qty)
val hasMoney = chr.getMesos() >= total

if (!canHold) {
    sm.sendSayOkay("กระเป๋าเต็ม! ไปเคลียร์มาก่อน")
} else if (!hasMoney) {
    sm.sendSayOkay("เงินไม่พอ! อย่ามาเนียน")
} else {
    // 5. Deal
    chr.deductMoney(total)
    sm.giveItem(itemID, qty)
    sm.sendSayOkay("เอ้า! รีบเอาไปซ่อนเร็วเข้า (ได้รับของเรียบร้อย)")
}
```

---

## 🎉 **Congratulations!**
เตรียมตัวเข้าสู่ **Phase 3: Map & Explorer** (การวาร์ป, จัดการแมพ, สคริปต์แมพ)
พักผ่อนแล้วลุยต่อยาวๆ! 🚀
