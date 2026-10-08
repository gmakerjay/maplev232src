# 🎓 Level 39: โลกคู่ขนาน (Server Info)

เช็คว่าผู้เล่นอยู่ "Channel" ไหน หรือ "World" ไหน

## 📜 ภารกิจที่ 42: เช็ค Channel
*   `chr.client.channel`: เลข Channel (1-20)
*   `chr.client.worldId`: เลข World (Scania=0, Bera=1, ...)

### **Code ตัวอย่าง (CheckCh.kts)**
```kotlin
val ch = chr.client.channel

sm.sendNext("นายอยู่ Channel $ch")

if (ch == 1) {
    sm.sendSayOkay("Channel 1 คนเยอะนะ ระวังแลค")
} else {
    sm.sendSayOkay("Channel นี้เงียบสงบดีจัง")
}
```

---

## 🧐 **กิจกรรมเฉพาะ Channel**
บางทีเราจัดกิจกรรมแค่ Channel 1
```kotlin
if (chr.client.channel != 1) {
    sm.sendSayOkay("กิจกรรมจัดที่ Channel 1 เท่านั้น! ย้ายแนลไปซะ!")
    sm.dispose()
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** GM ตรวจงาน
1.  NPC นี้คุยได้เฉพาะ GM (`chr.isGm()`) ที่อยู่ Channel 20
2.  ถ้าไม่ใช่ GM -> "อย่ามายุ่ง"
3.  ถ้าใช่ GM แต่ผิด Channel -> "ไปเจอที่ห้องลับ Channel 20"
4.  ถ้าถูกหมด -> "สวัสดีครับท่าน GM"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
if (!chr.isGm()) {
    sm.sendSayOkay("อย่ามายุ่ง! คนจะทำงาน")
} else if (chr.client.channel != 20) {
    sm.sendSayOkay("ท่านครับ... ไปคุยกันที่ Channel 20 เถอะ (ความลับ)")
} else {
    sm.sendSayOkay("สวัสดีครับท่าน GM! ทางสะดวกแล้ว")
}
```
</details>
