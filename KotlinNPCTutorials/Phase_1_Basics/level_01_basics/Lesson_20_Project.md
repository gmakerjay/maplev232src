# 🎓 Level 20: โปรเจคจบเฟส 1 (The Novice Graduate)

ยินดีด้วย! คุณเรียนจบหลักสูตรพื้นฐานแล้ว
ตอนนี้เราจะเอาทุกอย่างที่เรียนมา: **Inputs, Logic, Math, Loops, Colors, Time** มายำรวมกันเป็น NPC ตัวแรกที่ "ใช้งานได้จริง"

## 📜 ภารกิจ Final: "The Gatekeeper" (ผู้เฝ้าประตู)

**โจทย์:**
จงสร้าง NPC คนเฝ้าประตูเมืองลับแล โดยมีเงื่อนไขดังนี้:
1.  **เวลาเข้า:** เข้าได้เฉพาะตอนกลางคืน (18:00 - 05:00) เท่านั้น
2.  **ค่าผ่านทาง:** ต้องจ่ายเงิน 1,000 Mesos
3.  **รหัสผ่าน:** ต้องตอบคำถามคณิตศาสตร์สุ่ม (เช่น 5 + 3 = ?) ให้ถูก
4.  **Error Handling:** ต้องดักกรณีผู้เล่นพิมพ์มั่วตอนตอบคำถาม
5.  **Success:** ถ้าผ่านหมด ให้ Warp ไปแมพ 100000000 (Henesys)
6.  **Fail:** ถ้าไม่ผ่านข้อไหนเลย ให้ไล่กลับไป

---

### **เฉลย (Full Script)**
ลองเขียนเองก่อนนะ! ถ้าไม่ไหวค่อยดูเฉลย

```kotlin
import java.time.LocalDateTime
import java.util.Random

// 1. เช็คเวลา (Time)
val hour = LocalDateTime.now().hour
// ถ้าไม่ใช่ (18..23) และไม่ใช่ (0..5)
if (hour !in 18..23 && hour !in 0..5) {
    sm.sendSayOkay("กลับไปซะ! ประตูนี้เปิดเฉพาะยามวิกาลเท่านั้น (18:00 - 06:00)")
    sm.dispose() // จบการทำงาน
}

sm.sendNext("เจ้ามีความกล้าหาญมากที่มาเวลานี้...")

// 2. เช็คเงิน (Menu & Logic)
val money = sm.sendAskYesNo("ค่าผ่านทางคือ #b1,000 Mesos#k เจ้ามีจ่ายหรือไม่?")
if (!money) {
    sm.sendSayOkay("ไม่มีเงินก็ไสหัวไป!")
    sm.dispose()
}

// 3. สุ่มคำถาม (Random & Math)
val rand = Random()
val n1 = rand.nextInt(10) + 1 // 1-10
val n2 = rand.nextInt(10) + 1 // 1-10
val ans = n1 + n2

val input = sm.sendAskText("เพื่อพิสูจน์สติปัญญา... จงตอบข้า: #r$n1 + $n2 เท่ากับเท่าไหร่?#k", "", 1, 3)

try {
    val playerAns = input.toInt()
    
    if (playerAns == ans) {
        // 4. หักเงินและวาร์ป (สมมติฟังก์ชันหักเงิน เดี๋ยวเรียนเฟส 2)
        // sm.deductMesos(1000) 
        
        sm.sendSayOkay("ถูกต้อง! ยินดีต้อนรับสู่ดินแดนลับแล...")
        sm.warp(100000000)
        
    } else {
        sm.sendSayOkay("ผิด! เจ้าตัวปลอม!")
    }

} catch (e: Exception) {
    // 5. Error Handling
    sm.sendSayOkay("ข้าถามเป็นตัวเลข! เจ้าตอบบ้าอะไรมาเนี่ย!")
}
```

---

## 🎉 **Congratulations!**
คุณจบ Phase 1 แล้ว! ตอนนี้คุณสามารถเขียน NPC พื้นฐานได้ทุกรูปแบบ
*   เฟสต่อไป (Phase 2): เราจะไปยุ่งกับ **Inventory, Mesos, Stats** และการแจกของรางวัลจริงๆ กัน!
*   พักดื่มน้ำ แล้วลุยต่อเลย! 🚀
