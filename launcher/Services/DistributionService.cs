using System.IO;

namespace SwordieLauncher.Services;

public class DistributionService
{
    private readonly string _projectRoot;

    public DistributionService(string projectRoot)
    {
        _projectRoot = projectRoot;
    }

    public async Task<(bool Success, string Message)> ExportDistributionPackageAsync(string targetDirName = "dist_release", Action<string>? progressCallback = null)
    {
        return await Task.Run(() =>
        {
            try
            {
                string targetPath = Path.Combine(_projectRoot, targetDirName);
                progressCallback?.Invoke($"[*] Preparing distribution directory: {targetDirName}...");

                if (Directory.Exists(targetPath))
                {
                    progressCallback?.Invoke("[*] Cleaning existing distribution directory...");
                    Directory.Delete(targetPath, true);
                }

                Directory.CreateDirectory(targetPath);

                // Check that compiled jar exists
                string jarPath = Path.Combine(_projectRoot, "bin", "maplestory-1.77.3.jar");
                if (!File.Exists(jarPath))
                {
                    // Check for any jar in bin
                    var binJars = Directory.GetFiles(Path.Combine(_projectRoot, "bin"), "maplestory*.jar");
                    if (binJars.Length == 0)
                    {
                        return (false, "ไม่พบไฟล์คอมไพล์ .jar ในโฟลเดอร์ bin! กรุณากดปุ่ม [Build Project] ก่อนทำการสร้างชุดแจกจ่าย");
                    }
                }

                // Folders to include:
                // bin, dat, data, docs, libary, loadins, resources, scripts, sql, tools
                string[] foldersToCopy = new[]
                {
                    "bin",       // Compiled bytecode only! No raw source code!
                    "dat",       // WZ data cache
                    "docs",      // Guides
                    "libary",    // Portable JDK, Maven, MariaDB, Repo
                    "loadins",   // Forbidden words
                    "resources", // Configs, server properties
                    "scripts",   // Moddable Python and Kotlin scripts for custom game features
                    "sql",       // Base and custom SQL files
                    "tools"      // Scripts and tools
                };

                foreach (var folder in foldersToCopy)
                {
                    string src = Path.Combine(_projectRoot, folder);
                    string dst = Path.Combine(targetPath, folder);

                    if (Directory.Exists(src))
                    {
                        progressCallback?.Invoke($"  -> Copying {folder}/ (Compiled & Moddable assets)...");
                        CopyDirectory(src, dst);
                    }
                }

                // Copy root files
                string[] rootFilesToCopy = new[]
                {
                    "server.bat",
                    "import_db.bat",
                    "README.md",
                    "AGENTS.md",
                    "PROGRESS.md",
                    "LICENSE.md",
                    "SwordieLauncher.exe",
                    "bgasset.jpg"
                };

                foreach (var file in rootFilesToCopy)
                {
                    string src = Path.Combine(_projectRoot, file);
                    string dst = Path.Combine(targetPath, file);
                    if (File.Exists(src))
                    {
                        File.Copy(src, dst, true);
                    }
                }

                // Verify src/ is completely omitted
                if (Directory.Exists(Path.Combine(targetPath, "src")))
                {
                    Directory.Delete(Path.Combine(targetPath, "src"), true);
                }

                // Create a distribution README
                string distReadme = Path.Combine(targetPath, "README_DISTRIBUTION.txt");
                File.WriteAllText(distReadme, 
@"=====================================================
SwordieMS v232 - Portable Game Server Release Package
=====================================================

เซิร์ฟเวอร์ชุดนี้เป็นแพ็คเกจแบบพร้อมรัน (True Portable):
- ระบบซอร์สโค้ดหลักถูกคอมไพล์เป็น Bytecode ในโฟลเดอร์ bin/ เรียบร้อยแล้ว
- คุณสามารถปรับแต่ง NPC, Quest, Event ผ่านโฟลเดอร์ scripts/ (.py และ .kts)
- ปรับแต่งไอเทมและดรอปได้ที่ sql/custom/
- ปรับแต่งการเชื่อมต่อและพอร์ตได้ที่ resources/db.properties หรือผ่าน SwordieLauncher.exe

วิธีเปิดใช้งาน:
1. ดับเบิ้ลคลิก SwordieLauncher.exe หรือ server.bat
2. กด [Start MariaDB] หรือกด [Start Server] ได้ทันที!
", System.Text.Encoding.UTF8);

                progressCallback?.Invoke("[OK] Distribution package created successfully!");
                return (true, $"สร้างชุดแจกจ่ายสำเร็จที่โฟลเดอร์:\n{targetPath}\n(ซอร์สโค้ด src/ ถูกแยกออก ปลอดภัยต่อการแจกจ่าย 100%)");
            }
            catch (Exception ex)
            {
                return (false, $"เกิดข้อผิดพลาดในการสร้างชุดแจกจ่าย: {ex.Message}");
            }
        });
    }

    private static void CopyDirectory(string sourceDir, string targetDir)
    {
        Directory.CreateDirectory(targetDir);

        foreach (var file in Directory.GetFiles(sourceDir))
        {
            var fileName = Path.GetFileName(file);
            // Skip git and temp files
            if (fileName.StartsWith(".git") || fileName.EndsWith(".tmp") || fileName.EndsWith(".log"))
                continue;

            File.Copy(file, Path.Combine(targetDir, fileName), true);
        }

        foreach (var subDir in Directory.GetDirectories(sourceDir))
        {
            var dirName = Path.GetFileName(subDir);
            // Skip .git, .idea, .vscode, test-classes, etc.
            if (dirName.Equals(".git", StringComparison.OrdinalIgnoreCase) ||
                dirName.Equals(".idea", StringComparison.OrdinalIgnoreCase) ||
                dirName.Equals(".vscode", StringComparison.OrdinalIgnoreCase) ||
                dirName.Equals("test-classes", StringComparison.OrdinalIgnoreCase))
                continue;

            CopyDirectory(subDir, Path.Combine(targetDir, dirName));
        }
    }
}
