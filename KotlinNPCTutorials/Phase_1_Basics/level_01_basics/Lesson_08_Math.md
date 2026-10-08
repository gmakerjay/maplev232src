# 🎓 Level 8: วิชาคณิตศาสตร์ (Math Operations)

NPC ไม่ได้มีไว้แค่คุย แต่คำนวณภาษี แลกของ หรือคำนวณ Exp ได้!

## 📜 ภารกิจที่ 12: บวก ลบ คูณ หาร
เครื่องหมายพื้นฐานที่ใช้ได้เลย:
*   `+` บวก
*   `-` ลบ
*   `*` คูณ
*   `/` หาร
*   `%` **Modulo** (เศษจากการหาร) - อันนี้เทพมาก ใช้บ่อย!

### **Code ตัวอย่าง (Math.kts)**
```kotlin
val pricePerItem = 500
val quantity = 10

// คูณ
val total = pricePerItem * quantity 

// หาร (ระวัง! Int หาร Int จะได้ Int เสมอ ตัดเศษทิ้ง)
val share = total / 2 

// Modulo (หาเศษ)
val number = 5
if (number % 2 == 0) {
    sm.sendSay("เลขคู่")
} else {
    sm.sendSay("เลขคี่")
}
```

---

## 🧐 **กับดักเลขจำนวนเต็ม (Integer Division Trap)**
ระวังให้ดี!
*   `5 / 2` ใน Kotlin จะได้ `2` (ไม่ใช่ 2.5!) เพราะ `Int / Int = Int`
*   ถ้าอยากได้ทศนิยม ต้องแปลงตัวใดตัวหนึ่งเป็น Double ก่อน
    *   `5.0 / 2` ได้ `2.5`
    *   `5.toDouble() / 2` ได้ `2.5`

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ระบบแลกแต้ม (Exchange System)
1.  สมมติผู้เล่นมี "เหรียญทอง" (Gold Coin)
2.  ถามผู้เล่นว่ามีกี่เหรียญ (Input)
3.  อัตราแลกเปลี่ยน: 1 เหรียญ = 10,000 Exp
4.  คำนวณ Exp ที่จะได้รับ แล้วแสดงผล
5.  (Optional) ถ้าแลกครบ 10 เหรียญ แถมโบนัสให้อีก 5,000 Exp

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val coins = sm.sendAskNumber("มีกี่เหรียญจ๊ะ?", 1, 1, 100)
var exp = coins * 10000

if (coins >= 10) {
    exp += 5000 // บวกโบนัส (Shorthand ของ exp = exp + 5000)
    sm.sendNext("ว้าว! แลกเยอะขนาดนี้ เอาโบนัสไปเลย!")
}

sm.sendSayOkay("คุณได้รับ $exp Exp!")
```
</details>
