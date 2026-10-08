# 🎓 Level 22: การเงินหมุนเวียน (Give & Take Mesos)

เช็คเฉยๆ มันทำอะไรไม่ได้ มันต้อง "ให้" และ "เอาคืน" ได้ด้วย!

## 📜 ภารกิจที่ 25: แจกเงินและหักเงิน
1.  `chr.addMoney(amount)` -> เพิ่มเงิน (ใส่เลขติดลบไม่ได้)
2.  `chr.deductMoney(amount)` -> หักเงิน (ไม่ต้องใส่ลบ ใส่จำนวนเต็มได้เลย)

**คำเตือน:** ก่อนหักเงิน **ต้องเช็คก่อนเสมอ** ว่ามีพอไหม! ไม่งั้นเงินจะติดลบ หรือไม่ก็หักไม่ได้แล้วบั๊ก

### **Code ตัวอย่าง (Transaction.kts)**
```kotlin
val price = 500

val wantToBuy = sm.sendAskYesNo("น้ำแดง ราคา $price Mesos จะซื้อไหม?")

if (wantToBuy) {
    if (chr.getMesos() >= price) {
        // หักเงิน
        chr.deductMoney(price) 
        
        // อย่าลืมแจกของ (เดี๋ยวเรียนบทหน้า)
        sm.sendSayOkay("ขอบคุณที่อุดหนุน! (เงินหายไปแล้ว $price)")
    } else {
        sm.sendSayOkay("เงินไม่พอเว้ย! ไปหามาใหม่!")
    }
}
```

---

## 🧐 **ระบบภาษี (Vat Logic)**
ลองเขียนฟังก์ชันหักภาษีดูหน่อยไหม?

```kotlin
fun giveMoneyWithTax(amount: Long) {
    val tax = (amount * 0.07).toLong() // 7%
    val realGet = amount - tax
    
    chr.addMoney(realGet)
    sm.sendSay("คุณได้รับเงิน $realGet (ถูกหักภาษีไป $tax)")
}

giveMoneyWithTax(1000)
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ตู้ขโมยตังค์
1.  NPC หลอกถามว่า "ขอดูเงินหน่อย"
2.  ถ้ากดตกลง หักเงินผู้เล่น **ครึ่งตัว** ทันที!
3.  ถ้ากดไม่ตกลง ให้แจกเงินปลอบใจ 1 Meso

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val trust = sm.sendAskYesNo("นี่... นายไว้ใจฉันไหม? ขอดูเงินหน่อยสิ")

if (trust) {
    val current = chr.getMesos()
    val rob = current / 2
    
    chr.deductMoney(rob)
    sm.sendSayOkay("เสร็จโจร! ขอบใจสำหรับ $rob Mesos นะจ๊ะ")
} else {
    chr.addMoney(1)
    sm.sendSayOkay("ฉลาดนี่หว่า... เอานี่ไป 1 Meso ค่าฉลาด")
}
```
</details>
