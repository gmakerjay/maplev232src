# 🎓 Level 18: เจ้าแห่งกาลเวลา (Time & Date)

อยากทำ Event แจกของเฉพาะ "วันเสาร์"? หรือแจกเฉพาะ "ตอนกลางคืน"? 
Kotlin มี `LocalDateTime` ให้ใช้ ง่ายกว่า Java สมัยก่อนเยอะ

## 📜 ภารกิจที่ 22: ตอนนี้กี่โมง?
เราต้อง Import `java.time.LocalDateTime`

### **Code ตัวอย่าง (Time.kts)**
```kotlin
import java.time.LocalDateTime

val now = LocalDateTime.now() // เวลาปัจจุบันของ Server

val hour = now.hour // ชั่วโมง (0-23)
val day = now.dayOfWeek.toString() // MONDAY, TUESDAY...

sm.sendSay("ตอนนี้เวลา $hour นาฬิกา วัน $day")

// เช็คว่ากลางคืนไหม? (หลัง 6 โมงเย็น หรือก่อน 6 โมงเช้า)
if (hour >= 18 || hour < 6) {
    sm.sendSayOkay("มืดแล้วนะ... ระวังผีหลอก")
} else {
    sm.sendSayOkay("อรุณสวัสดิ์! แดดจ้าเลย")
}
```

---

## 🧐 **Event เสาร์อาทิตย์ (Weekend Event)**
```kotlin
import java.time.DayOfWeek

val today = LocalDateTime.now().dayOfWeek

if (today == DayOfWeek.SATURDAY || today == DayOfWeek.SUNDAY) {
    sm.sendNext("เย้! วันหยุดสุดสัปดาห์ แจก x2 Exp!")
} else {
    sm.sendNext("ตั้งใจทำงานนะ... รอวันหยุดไปก่อน")
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ร้านข้าวแกง (Lunch Time)
1.  ถ้าเวลาอยู่ระหว่าง 11:00 ถึง 13:00 (11, 12) ให้บอก "ร้านเปิดจ้า! ข้าวมันไก่พิเศษ!"
2.  ถ้าไม่ใช่เวลาขาย ให้บอก "ร้านปิด! เปิดอีกที 11 โมง"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
import java.time.LocalDateTime

val h = LocalDateTime.now().hour

if (h >= 11 && h < 13) {
    sm.sendSayOkay("เชิญครับ! ไก่ตอนร้อนๆ")
} else {
    sm.sendSayOkay("ร้านปิดแล้วครับนายท่าน")
}
```
</details>
