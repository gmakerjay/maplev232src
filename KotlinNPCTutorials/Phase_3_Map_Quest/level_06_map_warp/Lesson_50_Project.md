# 🎓 Level 50: โปรเจคจบเฟส 3 (The Dungeon Master)

ยินดีด้วย! คุณผ่าน Phase 3 แล้ว ตอนนี้คุณคุม **Map, Time, Sound, Spawn** ได้หมด
มาสร้าง "ประตูเข้าดันเจี้ยน" กันเถอะ

## 📜 ภารกิจ Final: "The Gate to Hell"

**Scenario:**
1.  NPC เป็นเสาหินเก่าแก่
2.  เงื่อนไขเข้า:
    *   ต้องมี Party (คนเดียวห้ามเข้า) `chr.party != null`
    *   หัวหน้าปาร์ตี้เป็นคนคุย `chr.party.leaderID == chr.id`
    *   เลเวลทุกคนต้อง 30+ (เช็คแค่หัวหน้าก่อนง่ายๆ)
3.  Effect:
    *   ก่อนเข้า: เขย่าจอ (Tremble)
    *   เล่นเสียง "Mob/Balrog/Cry"
4.  Warp:
    *   ส่งทั้งปาร์ตี้ไปแมพ 999999999

---

### **เฉลย (Full Script)**

```kotlin
import net.swordie.ms.connection.packet.field.FieldPacket

// 1. เช็คปาร์ตี้
val pt = chr.party
if (pt == null) {
    sm.sendSayOkay("เจ้าต้องมีปาร์ตี้ก่อนนะ")
    sm.dispose()
}

// 2. เช็คหัวหน้า
if (pt.leaderID != chr.id) {
    sm.sendSayOkay("ให้หัวหน้าปาร์ตี้มาคุยสิ")
    sm.dispose()
}

// 3. เช็คเลเวลหัวหน้า
if (chr.level < 30) {
    sm.sendSayOkay("เลเวลยังไม่ถึง 30 กลับไปซะ")
    sm.dispose()
}

val enter = sm.sendAskYesNo("พร้อมจะลุยดันเจี้ยนรึยัง?")

if (enter) {
    // 4. Effect & Sound
    sm.chatRed("ประตูนรกเปิดออกแล้ว!!!")
    sm.playSound("Mob/Balrog/Cry") // เสียงคำราม
    field.broadcastPacket(FieldPacket.tremble(1, 3000, 20)) // เขย่าจอ
    
    // 5. Warp Party (ต้องวนลูปสมาชิก)
    // sm.warpPartyIn(mapID) เป็นคำสั่งสะดวก (ถ้ามี) ถ้าไม่มีต้องวนลูปเอง:
    /*
    for (member in pt.members) {
        val ch = member.char
        if (ch != null && ch.fieldID == chr.fieldID) { // ต้องอยู่แมพเดียวกัน
            ch.warp(999999999)
        }
    }
    */
    
    // แบบง่าย (ถ้า Emulator รองรับ)
    sm.warp(999999999) // ไปคนเดียวก่อน (ถ้า Loop ยากไปสำหรับ Phase นี้)
    sm.sendSayOkay("ขอให้โชคดี...")
}
```

---

## 🎉 **Congratulations!**
เตรียมเข้าสู่ **Phase 4: Instance & Loops** (ดันเจี้ยนส่วนตัว, การวนลูปฆ่ามอน)
พักผ่อนแล้วลุยต่อ! 🚀
