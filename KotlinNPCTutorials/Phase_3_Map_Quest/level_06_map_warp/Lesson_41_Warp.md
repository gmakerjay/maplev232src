# 🎓 Level 41: วาร์ปข้ามมิติ (Warping)

ยินดีต้อนรับสู่ **Phase 3: Explorer**!
สกิลสำคัญที่สุดของ NPC คือการ "ส่งผู้เล่นไปที่อื่น"

## 📜 ภารกิจที่ 43: ย้ายแมพ
คำสั่ง: `sm.warp(mapID)`
*   Map ID หาได้จาก `@map` หรือเว็บฐานข้อมูล

### **Code ตัวอย่าง (Warp.kts)**
```kotlin
val henesys = 100000000
val perion = 102000000

val choice = sm.sendAskMenu("ไปไหนดี?\r\n#L0# Henesys#l\r\n#L1# Perion#l")

if (choice == 0) {
    sm.warp(henesys)
    // ปกติ warp แล้วมันจะจบ Script เอง แต่ใส่ dispose กันเหนียวก็ได้
    sm.dispose()
} else {
    sm.warp(perion)
    sm.dispose()
}
```

---

## 🧐 **Portal ID (วาร์ปไปจุดเฉพาะ)**
`sm.warp(mapID, portalID)`
*   Portal ID 0 = จุดเกิด Defualt
*   ถ้าอยากรู้ Portal ID ในเกมให้ใช้ `@whereami` หรือเปิดดูใน WZ

```kotlin
// ไป Henesys ตกตรง Portal หมายเลข 2
sm.warp(100000000, 2)
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** Taxi เถื่อน
1.  คิดค่าบริการ 1,000 Mesos
2.  ถ้าจ่าย -> วาร์ปไป Kerning City (103000000)
3.  ถ้าไม่จ่าย -> ไม่ไป

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val price = 1000
val dest = 103000000

val yes = sm.sendAskYesNo("ไป Kerning ไหม? $price เอง")

if (yes && chr.getMesos() >= price) {
    chr.deductMoney(price)
    sm.warp(dest)
} else {
    sm.sendSayOkay("ไม่มีตังค์ก็เดินไปเองนะจ๊ะ")
}
```
</details>
