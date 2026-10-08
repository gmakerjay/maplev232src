# 🎓 Level 49: เรียกอสูร (Spawn Mob)

NPC เสกมอนสเตอร์ออกมาได้ด้วยนะ! เอาไว้ทำกิจกรรมตีบอส

## 📜 ภารกิจที่ 51: จงออกมาซะ!
คำสั่ง: `sm.spawnMob(mobID, x, y, respawn)`
*   `mobID`: รหัสตัว
*   `x, y`: พิกัด (ใช้ `chr.position.x`, `chr.position.y` ได้ถ้าอยากให้เกิดตรงหน้า)
*   `respawn`: (Boolean) ตายแล้วเกิดใหม่ไหม? (ปกติ false สำหรับ Event)

### **Code ตัวอย่าง (Spawn.kts)**
```kotlin
val slime = 100006 // Slime
val x = chr.position.x
val y = chr.position.y

sm.sendNext("ข้าจะเสกสไลม์มาให้เจ้าตบเล่น!")
sm.spawnMob(slime, x, y, false) // เสกตรงตัวผู้เล่นเลย

// เสกห่างไปหน่อย
sm.spawnMob(slime, x + 100, y, false)
```

---

## 🧐 **Mob Stats (Advance Phase 4)**
ถ้าอยากเสกบอสเลือดเยอะกว่าปกติ ต้องแก้ `MobStats` ก่อน `spawn` (เดี๋ยวสอนใน Phase 4)

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** กองทัพเห็ด
1.  วนลูปเสก Mushroom (100005) 5 ตัว
2.  ให้เกิดเรียงเป็นแถวหน้ากระดาน (x + 50 ไปเรื่อยๆ)

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val mushroom = 100005
var startX = chr.position.x
val y = chr.position.y

for (i in 0..4) {
    sm.spawnMob(mushroom, startX, y, false)
    startX += 50 // ขยับขวา 50 pixel
}
sm.sendSayOkay("กองทัพเห็ดบุก!")
```
</details>
