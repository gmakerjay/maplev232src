# 🎓 Level 23: ค้นกระเป๋า (Checking Items)

เงินไม่ใช่ทุกอย่าง! บางทีเราต้องการ "เปลือกหอย" "หัวกะโหลก" หรือ "บัตรผ่าน"
มาดูวิธีเช็คไอเทมกัน

## 📜 ภารกิจที่ 26: มีของไหม?
คำสั่ง: `sm.hasItem(itemID, quantity)`
*   `itemID` (Int): รหัสไอเทม (เช่น 4000000 = Blue Snail Shell)
*   `quantity` (Int): จำนวนที่ต้องการ (Optional: ถ้าไม่ใส่คือเช็คว่ามีอย่างน้อย 1 ชิ้น)

### **Code ตัวอย่าง (CheckItem.kts)**
```kotlin
val snailShell = 4000000 // ใส่ตัวแปรไว้ จะได้แก้ง่ายๆ

if (sm.hasItem(snailShell)) {
    sm.sendNext("โอ๊ะ! นายมีเปลือกหอยนี่นา")
    
    // เช็คจำนวน
    if (sm.hasItem(snailShell, 10)) {
        sm.sendSayOkay("มีตั้ง 10 อันแน่ะ! สุดยอด!")
    } else {
        sm.sendSayOkay("แต่เสียดายมีไม่ครบ 10 อัน ไปหามาเพิ่มนะ")
    }
} else {
    sm.sendSayOkay("นายไม่มีเปลือกหอยสีฟ้าเลย... อ่อนหัด!")
}
```

---

## 🧐 **หา ID Item ยังไง?**
1.  ในเกมพิมพ์ `@search item ชื่อของ` (เช่น `@search item snail`)
2.  ใช้เว็บ Maplestory Design / MapleTip
3.  ดูใน `String.wz` (ถ้าเป็น Dev)

**ตัวอย่าง ID พื้นฐาน:**
*   4000000: Blue Snail Shell
*   2000000: Red Potion
*   2000005: Power Elixir

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ยามเฝ้าหอคอย
1.  ต้องมี "Red Potion" (2000000) อย่างน้อย 5 ขวด ถึงจะผ่านได้
2.  ถ้าไม่มี ให้ไล่ไปซื้อ

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val passItem = 2000000 // Red Potion
val reqCount = 5

if (sm.hasItem(passItem, reqCount)) {
    sm.sendSayOkay("มีน้ำแดงครบดีนี่... ผ่านได้")
} else {
    sm.sendSayOkay("คอแห้งจะตายอยู่แล้ว! ไปเอาน้ำแดงมา $reqCount ขวด เดี๋ยวนี้!")
}
```
</details>
