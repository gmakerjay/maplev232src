# 🎓 Level 25: นักแลกเปลี่ยน (Consuming Items)

มีให้ก็ต้องมีรับ! การยึดของจากผู้เล่น (ทำเควส, แลกของ) ใช้ `sm.consumeItem`

## 📜 ภารกิจที่ 28: เอาของเจ้านั่นมาให้ข้า!
คำสั่ง: `sm.consumeItem(itemID, quantity)`
*   ลบ 1 ชิ้น: `sm.consumeItem(4000000)`
*   ลบ 20 ชิ้น: `sm.consumeItem(4000000, 20)`

**กฎเหล็ก:** ห้าม `consume` ก่อน `has` เด็ดขาด!
ถ้าผู้เล่นไม่มีของ แล้วไปสั่งลบ... **ไม่เกิดอะไรขึ้น** (แต่ Logic เราจะพัง เพราะนึกว่าลบไปแล้ว)

### **Code ตัวอย่าง (Consume.kts)**
```kotlin
val itemID = 4000000 // Snail Shell
val cost = 5

sm.sendNext("ฉันต้องการเปลือกหอย $cost อัน")

if (sm.hasItem(itemID, cost)) {
    // 1. มีของครบ -> ลบของ
    sm.consumeItem(itemID, cost)
    
    // 2. แจกรางวัล
    sm.giveItem(2000000, 10) // แจกยา 10 ขวด
    
    sm.sendSayOkay("ขอบใจมาก! แลกเปลี่ยนสำเร็จ")
} else {
    sm.sendSayOkay("ของไม่ครบนี่หว่า! ไปหามาใหม่เลย")
}
```

---

## 🧐 **ระบบ Trade ที่สมบูรณ์แบบ**
ลำดับการทำงานที่ถูกต้องของ NPC แลกของ:
1.  เช็คช่องว่าง (Inventory Full Check) - *สำคัญสุด*
2.  เช็คของวัตถุดิบ (Has Item Check)
3.  ลบของวัตถุดิบ (Consume)
4.  แจกของรางวัล (Give)

(ถ้าข้ามข้อ 1 ระวังผู้เล่นของเต็ม -> วัตถุดิบหายฟรี -> ผู้เล่นด่า GM -> ปิดเซิร์ฟหนี)

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ร้านกาแฟแลกเปลี่ยน (Coffee Shop)
1.  กาแฟ 1 แก้ว ต้องใช้:
    *   เมล็ดกาแฟ (4033006) 1 อัน
    *   นมสด (2022000) 1 ขวด
    *   เงิน 100 Mesos
2.  ถ้าครบ -> หักของ, หักเงิน, แจก Coffee (2022138)
3.  ถ้าไม่ครบ บอกว่าขาดอะไร

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val bean = 4033006
val milk = 2022000
val price = 100
val reward = 2022138 // Coffee

if (sm.hasItem(bean) && sm.hasItem(milk) && chr.getMesos() >= price) {
    sm.consumeItem(bean)
    sm.consumeItem(milk)
    chr.deductMoney(price)
    
    sm.giveItem(reward)
    sm.sendSayOkay("กาแฟร้อนๆ มาเสิร์ฟแล้วจ้า!")
} else {
    sm.sendSayOkay("วัตถุดิบหรือเงินไม่พอนะ (ใช้ Bean, Milk, 100 Meso)")
}
```
</details>
