# 🎓 Level 46: แข่งกับเวลา (Clock & Timer)

เควสจับเวลา (Time Limit) เป็นของคู่กันกับเกม RPG
มาสร้างนาฬิกานับถอยหลังกัน!

## 📜 ภารกิจที่ 48: จับเวลา 60 วินาที
คำสั่ง: `field.startTimer(seconds)` หรือ `sm.invokeAfter(delay) { ... }`

### **Code ตัวอย่าง (Timer.kts)**
```kotlin
// สร้างนาฬิกาบนหัว 60 วินาที
sm.showFieldEffect("quest/party/clear") // โชว์ Effect เริ่ม
sm.showClock(60) 

// ตั้งเวลาให้ระบบทำงานเมื่อครบ 60 วิ
// นี่คือ Lambda Function (Callback)
sm.invokeAfter(60 * 1000) { // หน่วยเป็น Millisecond
    // สิ่งที่จะทำเมื่อเวลาหมด
    if (field.getChars().contains(chr)) { // เช็คว่าคนเล่นยังอยู่แมพเดิมไหม
        sm.warp(100000000) // ดีดกลับเมือง
        sm.chat("หมดเวลาสนุกแล้วสิ!")
    }
}
```

---

## 🧐 **คำเตือนเรื่อง Thread**
`invokeAfter` ทำงานแยก Thread
ดังนั้นถ้าจะยุ่งกับ API บางอย่างต้องระวัง หรือเช็ค `chr` ให้ดีว่ายัง online อยู่ไหม (`chr != null`)

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ระเบิดเวลา
1.  นับถอยหลัง 5 วินาที showClock(5)
2.  เมื่อครบเวลา ให้แสดง Effect "mob/5120503/die1/0" (ระเบิด) หรืออะไรก็ได้ที่หาเจอ
3.  ลดเลือดผู้เล่นครึ่งหลอด

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
sm.showClock(5)
sm.chat("ระเบิดทำงานใน 5...")

sm.invokeAfter(5000) {
    sm.chat("ตูมมมม!")
    val damage = chr.maxHp / 2
    chr.damage(damage) // บาดเจ็บ
}
```
</details>
