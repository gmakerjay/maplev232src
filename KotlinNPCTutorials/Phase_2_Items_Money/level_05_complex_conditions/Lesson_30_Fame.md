# 🎓 Level 30: ชื่อเสียงมันกินไม่ได้ (Fame System)

Fame (Pop) คือค่าชื่อเสียง เพิ่มได้วันละครั้ง แต่อย่าไปหวังอะไรมากกับระบบนี้... เว้นแต่ NPC จะขอ!

## 📜 ภารกิจที่ 33: เช็คและเพิ่ม Fame
*   **Check:** `chr.fame` (หรือ `chr.getFame()`)
*   **Add:** `chr.addFame(amount)` (ใส่ลบได้เพื่อลด)

### **Code ตัวอย่าง (FameCheck.kts)**
```kotlin
val pop = chr.fame

sm.sendNext("นายมีชื่อเสียงระดับ: $pop")

// เงื่อนไขสวมใส่ของเทพ (สมมติ)
if (pop >= 100) {
    sm.sendSayOkay("นายมันดาราฮอลลีวู้ดชัดๆ!")
} else if (pop < 0) {
    sm.sendSayOkay("ยี้... คนนิสัยไม่ดี (Fame ติดลบ)")
}
```

---

## 🧐 **การซื้อ Fame?**
เราสามารถสร้าง NPC ขาย Fame ได้!

```kotlin
val price = 1_000_000 // 1m
val buy = sm.sendAskYesNo("ต้องการซื้อ 1 Fame ราคา $price ไหม?")

if (buy) {
    if (chr.getMesos() >= price) {
        chr.deductMoney(price)
        chr.addFame(1)
        sm.sendSayOkay("ขอบคุณ! ตอนนี้ Fame นายคือ ${chr.fame}")
    } else {
        sm.sendSayOkay("เงินไม่พอนะจ๊ะ")
    }
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** นักเลงปากซอย
1.  เรียกผู้เล่นมาคุย
2.  ถ้า Fame น้อยกว่า 10 -> "มองหน้าหาเรื่องเหรอ?" -> ลด Fame อีก 1 (-1)
3.  ถ้า Fame มากกว่า 10 -> "ครับพี่! เชิญครับพี่!" -> เพิ่ม Fame ให้ 1 (+1)

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
if (chr.fame < 10) {
    sm.sendNext("มองหน้าหาเรื่องเหรอวะ? เอาไปกิน!")
    chr.addFame(-1)
    sm.sendSayOkay("จำไว้! (Fame ลดลง 1)")
} else {
    sm.sendNext("หวัดดีครับลูกพี่! หน้าตาผ่องใสนะครับวันนี้")
    chr.addFame(1)
    sm.sendSayOkay("เอาใจไปเลยลูกพี่! (Fame เพิ่มขึ้น 1)")
}
```
</details>
