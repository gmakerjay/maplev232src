# 🎓 Level 24: ผู้ให้ที่ยิ่งใหญ่ (Giving Items)

การแจกของคือหัวใจของ NPC เควส! มาดูวิธีเสกของเข้ากระเป๋าผู้เล่นกัน

## 📜 ภารกิจที่ 27: จงรับไปซะ!
คำสั่ง: `sm.giveItem(itemID, quantity)`
*   แจก 1 ชิ้น: `sm.giveItem(2000000)`
*   แจก 100 ชิ้น: `sm.giveItem(2000000, 100)`

**ข้อควรระวัง:** ถ้ากระเป๋าเต็ม... ของจะหล่นพื้น! หรือบาง Server อาจจะแจกไม่ได้เลย ดังนั้นต้องเช็คช่องว่างก่อนเสมอ (เดี๋ยวสอนเช็คช่องบทหน้า)

### **Code ตัวอย่าง (GiveItem.kts)**
```kotlin
val potion = 2000005 // Power Elixir

sm.sendNext("เจ้าดูเหนื่อยนะ... เอานี่ไปดื่มสิ")

// เสกของ
sm.giveItem(potion, 10)

sm.sendSayOkay("รับ Power Elixir ไป 10 ขวดแล้วนะ อย่าลืมกดใช้ล่ะ!")
```

---

## 🧐 **Equip Options (ของสวมใส่)**
ถ้าแจกของสวมใส่ (Equip) ปกติจะได้ Stat ธรรมดา (Average)
แต่ถ้าอยากแจกของเทพ (มี Stat พิเศษ) ต้องลงลึกไปใช้ Java Function (Phase 5 นู่นเลย)
ตอนนี้เอาแบบพื้นฐานไปก่อนครับ

```kotlin
val chair = 3010000 // เก้าอี้
sm.giveItem(chair) // ได้เก้าอี้ 1 ตัว
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** Starter Pack
1.  เมื่อคุยกับ NPC ให้แจกชุดเริ่มต้น 3 อย่าง:
    *   Red Potion (50 ขวด)
    *   Blue Potion (50 ขวด)
    *   Return Scroll (10 ใบ)
2.  แสดงข้อความบอกด้วยว่าได้อะไรบ้าง

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
sm.sendNext("ยินดีต้อนรับสู่โลกใหม่! นี่คือของขวัญต้อนรับ")

sm.giveItem(2000000, 50) // Red
sm.giveItem(2000003, 50) // Blue
sm.giveItem(2030000, 10) // Return Scroll

sm.sendSayOkay("ได้รับยาแดง ฟ้า และใบวาร์ป เรียบร้อยแล้ว!")
```
</details>
