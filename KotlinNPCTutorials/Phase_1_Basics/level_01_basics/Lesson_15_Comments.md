# 🎓 Level 15: นักบันทึกตำนาน (Comments & Docs)

โค้ดที่ดีคือโค้ดที่ "คนอื่นอ่านรู้เรื่อง" (หรือตัวเราในอีก 3 เดือนข้างหน้าอ่านรู้เรื่อง)

## 📜 ภารกิจที่ 19: การเขียน Comment
มี 2 แบบหลักๆ:

### **1. Single Line (`//`)**
ใช้เม้าท์มอยสั้นๆ
```kotlin
val hp = 100 // นี่คือเลือดเริ่มต้น
// sm.sendSay("อันนี้ยังไม่เสร็จ อย่าเพิ่งใช้")
```

### **2. Multi Line (`/* ... */`)**
ใช้เขียนยาวๆ หรือแปะเครดิตหัวไฟล์
```kotlin
/*
 * Script Name: Npc_Healer.kts
 * Author: Admin อินดี้
 * Date: 2026-02-03
 * Description: NPC ฮีลเลือด แลกกับเงิน 500 mesos
 */
```

---

## 🧐 **TODO: สิ่งที่ต้องทำ**
โปรแกรมเมอร์ชอบใช้คำว่า `TODO` เพื่อมาร์คจุดที่ยังทำไม่เสร็จ
```kotlin
// TODO: เพิ่มระบบเช็คเลเวลอาชีพ Viper
if (true) {
    sm.sendSay("ผ่าน!")
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** เขียน NPC อะไรก็ได้ แต่ต้องมี Comment อธิบาย 3 ส่วน
1.  หัวไฟล์ (ใครเขียน, ทำอะไร)
2.  อธิบายตัวแปร
3.  อธิบาย Logic ที่ซับซ้อน (หรือสมมติว่าซับซ้อน)

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
/*
 * NPC: Magic Rock Seller
 * Author: Dev001
 * Logic: ขาย Magic Rock ราคาตามเลเวลผู้เล่น
 */

val basePrice = 5000 // ราคาพื้นฐาน

// คำนวณส่วนลด: เลเวลสูง ลดเยอะ (สูงสุด 50%)
val discount = if (chr.level > 200) 0.5 else 0.0
val finalPrice = (basePrice * (1.0 - discount)).toInt()

sm.sendSayOkay("ราคาลดแล้วเหลือ: $finalPrice")
```
</details>
