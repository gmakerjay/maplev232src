# 🎓 Level 31: ชายหรือหญิง? (Gender Check)

NPC ร้านเสื้อผ้า หรือ Event วันวาเลนไทน์ อาจจะต้องเช็คเพศตัวละคร

## 📜 ภารกิจที่ 34: ตรวจเพศสภาพ
*   `chr.avatarData.avatarLook.gender`
*   **0** = ชาย (Male)
*   **1** = หญิง (Female)

### **Code ตัวอย่าง (WC.kts)**
```kotlin
val gender = chr.avatarData.avatarLook.gender

if (gender == 0) {
    sm.sendSayOkay("ห้องน้ำชายไปทางซ้ายครับลูกพี่")
} else {
    sm.sendSayOkay("ห้องน้ำหญิงไปทางขวาค่ะคุณหนู")
}
```

---

## 🧐 **การแต่งงาน (Marriage)**
ระบบแต่งงานจะใช้การเช็คเพศอย่างเข้มข้น (ในสมัยก่อน)
แต่สมัยนี้... จริงๆ มันแก้ Code ได้นะอิอิ
แต่เอา Logic พื้นฐานก่อน: การจะแต่งงานต้องมีเพศต่างกัน (ตามกฎเกมดั้งเดิม)

```kotlin
// สมมติคุยกับ NPC จัดงานแต่ง
if (gender == 1) {
    sm.sendSay("คุณต้องใส่ชุดเจ้าสาวนะ")
    // sm.giveItem(WeddingDressID)
} else {
    sm.sendSay("คุณต้องใส่ทักซิโด้นะ")
    // sm.giveItem(TuxedoID)
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ร้านขายแหวนคู่รัก
1.  ถ้าผู้เล่นเป็น "ชาย" ให้ขายแหวนสีฟ้า (สสมติ ID 111222)
2.  ถ้าเป็น "หญิง" ให้ขายแหวนสีชมพู (สมมติ ID 111333)
3.  แสดงข้อความว่า "นี่แหวนสำหรับคุณผู้ชาย/หญิง ครับ/ค่ะ"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val g = chr.avatarData.avatarLook.gender

if (g == 0) {
    sm.sendNext("นี่ครับ แหวนสำหรับสุภาพบุรุษ")
    sm.giveItem(111222)
} else {
    sm.sendNext("นี่ค่ะ แหวนสำหรับสุภาพสตรี")
    sm.giveItem(111333)
}
```
</details>
