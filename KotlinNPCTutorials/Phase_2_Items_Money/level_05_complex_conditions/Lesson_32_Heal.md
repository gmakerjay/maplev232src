# 🎓 Level 32: หมอเถื่อน (Heal & Stat Modification)

NPC หมอในเมือง (Doctor) สามารถรักษา HP/MP ได้

## 📜 ภารกิจที่ 35: เติมเลือดเต็มถัง
คำสั่ง: `chr.heal(hp)` หรือ `chr.heal(hp, mp)`
แต่ใน Swordie ถ้าจะฮีลเต็มหลอด:
*   `chr.avatarData.characterStat.hp = chr.avatarData.characterStat.maxHp`
*   ต้องเรียก `chr.write(WvsContext.statChanged(...))` เพื่ออัพเดท Client (อันนี้ยากไปหน่อย)

**ทางลัด:** สคริปต์ส่วนใหญ่ใช้ `chr.heal(amount)` ง่ายกว่า
แต่ Swordie มีคำสั่งเทพ: `chr.fullHeal()` (ซ่อนอยู่ใน Class ต้องไปขุดดู แต่ถ้าไม่มีให้ใช้ `heal`)

### **Code ตัวอย่าง (Doctor.kts)**
```kotlin
// ฮีลแบบบ้านๆ (เพิ่มเลือด 1000)
chr.heal(1000) 
sm.sendSayOkay("รักษาให้แล้วนะ (เพิ่ม 1000 HP)")

// ฮีลแบบเทพ (ตรวจสอบ MaxHP ก่อน)
val maxHp = chr.avatarData.characterStat.maxHp
if (chr.hp < maxHp) {
    chr.heal(maxHp) // ฮีลเต็มแม็กซ์
    sm.sendSayOkay("หายไวๆ นะจ๊ะ")
} else {
    sm.sendSayOkay("นายก็สบายดีนี่นา? จะมารักษาทำไม")
}
```

---

## 🧐 **ตายแล้วฟื้น?**
ถ้า HP เป็น 0 คือตาย... NPC คุยกับผีไม่ได้นะ! (ยกเว้นเราตั้งให้คุยได้)
การ `heal` ตอนตาย **จะไม่ฟื้นชีพ**
ต้องใช้คำสั่งเกิดใหม่ `chr.revive()` (แต่ปกติกดปุ่ม OK ในเกมเอานะ)

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** โรงพยาบาลหน้าเลือด
1.  คิดค่ารักษา 1 Meso ต่อ 1 HP ที่หายไป
2.  คำนวณว่าเลือดหายไปเท่าไหร่ (`maxHp - hp`)
3.  แจ้งราคาผู้เล่น
4.  ถ้าจ่าย -> ฮีลเต็ม
5.  ถ้าไม่มีเงิน -> ฮีลให้ 1 HP (สมน้ำหน้า)

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val lostHp = chr.maxHp - chr.hp

if (lostHp <= 0) {
    sm.sendSayOkay("สุขภาพดีเยี่ยม!")
    sm.dispose()
}

val cost = lostHp * 1
val yes = sm.sendAskYesNo("ค่ารักษา $cost Mesos จ่ายไหม?")

if (yes && chr.getMesos() >= cost) {
    chr.deductMoney(cost)
    chr.heal(lostHp)
    sm.sendSayOkay("หายดีเป็นปลิดทิ้ง!")
} else {
    chr.heal(1)
    sm.sendSayOkay("ไม่มีเงินก็เอาพลาสเตอร์แปะไปอันเดียวพอ!")
}
```
</details>
