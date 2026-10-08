# 🎓 Level 45: ทุกครั้งที่มาเยือน (OnUserEnter)

ต่างจาก FirstEnterField ตรงที่ **"ทำงานทุกครั้ง"** ที่เข้าแมพ (ไม่ว่าจะวาร์ปกลับมา เดินเข้าวาร์ป หรือ login)
ปกติใช้ตั้งค่าแมพ เช่น เปลี่ยนเพลง สุ่มเกิดมอนสเตอร์ หรือเริ่มจับเวลา

## 📜 ภารกิจที่ 47: ตั้งค่าบรรยากาศ
### **Code ตัวอย่าง (scripts/field/enter_100000000.kts)**
```kotlin
// แสดงข้อความประกาศกลางจอ
sm.chatRed("Welcome to Henesys!")

// เปลี่ยนเพลง (BGM)
sm.changeMusic("Bgm01/FloraBeach")

// ใส่ Effect หิมะตก (Weather)
sm.showWeatherNotice("หิมะตกหนักมาก!", 2090000, 10000) // ข้อความ, ID Item, ระยะเวลา
```

---

## 🧐 **Map Variables**
ถ้าอยากจำค่าเฉพาะในแมพ (เช่น ฆ่ามอนครบ 10 ตัวในรอบนี้) เราต้องใช้ตัวแปรของ `field.properties` (Java Map)
```kotlin
// ตั้งค่าเริ่มต้น
field.properties["killCount"] = 0
```
(เดี๋ยวมาเรียนเรื่องนี้ลึกๆ ใน Phase 4: Instances)

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** แมพดิสโก้
1.  เมื่อเข้าแมพ ให้เปลี่ยนเพลงเป็น "BgmEvent/Disco"
2.  แสดงข้อความลอยกลางจอ (Balloon) หรือ Chat ก็ได้ว่า "Let's Dance!"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
sm.changeMusic("BgmEvent/Disco")
sm.chatRed("Let's Dance!")
chr.showBalloonMsg("Dance!", 300, 500) // ตัวอย่างท่าเสริม (ถ้ามี)
```
</details>
