# 🎓 Level 28: แข็งแกร่งแค่ไหน? (Checking Player Stats)

NPC บางตัวคุยได้เฉพาะคนเก่ง (Level สูง) หรือเฉพาะอาชีพ (Job) เท่านั้น

## 📜 ภารกิจที่ 31: เช็คเลเวลและอาชีพ
*   `chr.level` (Int): เลเวล
*   `chr.job` (Int): รหัสอาชีพ

### **Code ตัวอย่าง (CheckStats.kts)**
```kotlin
val lv = chr.level
val job = chr.job

sm.sendNext("ดูซิ... เลเวล $lv อาชีพรหัส $job สินะ")

if (lv < 10) {
    sm.sendSayOkay("เจ้ายังเป็น Beginner อยู่เลย! ไปฝึกมาก่อน")
} else {
    sm.sendSayOkay("ใช้ได้นี่! เริ่มเป็นงานแล้ว")
}
```

---

## 🧐 **Job ID คืออะไร?**
ต้องเปิด `JobConstants` หรือหาในเน็ต
*   0 = Beginner
*   100 = Warrior (Koc 1000)
*   200 = Magician
*   ...
*   1012 = Viper (สมมติ)

**วิธีเช็คแบบ Advance:**
```kotlin
import net.swordie.ms.constants.JobConstants

if (JobConstants.isBeginnerJob(job)) {
    sm.sendSay("เด็กใหม่สินะ")
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** อาจารย์เปลี่ยนอาชีพ (Class Instructor)
1.  NPC นี้สำหรับ "Beginner" (Job 0) ที่มี Level 10 ขึ้นไปเท่านั้น
2.  ถ้าไม่ใช่ Beginner บอก "ข้าสอนเฉพาะเด็กใหม่"
3.  ถ้าเลเวลไม่ถึง 10 บอก "ไปเก็บเวลมาเพิ่มไป๊!"
4.  ถ้าผ่านเงื่อนไข ให้เปลี่ยนอาชีพเป็น Warrior (Job 100) -> คำสั่ง `chr.setJob(100)`

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
if (chr.job != 0) {
    sm.sendSayOkay("เจ้ามีอาชีพแล้วนี่! ข้าไม่สอนคนเก่ง")
} else if (chr.level < 10) {
    sm.sendSayOkay("อ่อนหัด! ไปฝึกให้ถึงเลเวล 10 ก่อน")
} else {
    val confirm = sm.sendAskYesNo("พร้อมจะเป็น Warrior แล้วรึยัง?")
    if (confirm) {
        chr.job = 100 // เปลี่ยนอาชีพ
        sm.sendSayOkay("ยินดีด้วย! ท่านคือ Warrior แล้ว")
    }
}
```
</details>
