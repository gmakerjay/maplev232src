using System.IO;
using SwordieLauncher.Models;

namespace SwordieLauncher.Services;

public static class ConfigService
{
    public static string FindProjectRoot()
    {
        string current = AppDomain.CurrentDomain.BaseDirectory;
        // Check current directory first
        if (File.Exists(Path.Combine(current, "pom.xml")) || File.Exists(Path.Combine(current, "server.bat")))
        {
            return current;
        }

        // Try climbing up up to 4 levels
        DirectoryInfo? dir = new DirectoryInfo(current);
        while (dir != null)
        {
            if (File.Exists(Path.Combine(dir.FullName, "pom.xml")) || File.Exists(Path.Combine(dir.FullName, "server.bat")))
            {
                return dir.FullName;
            }
            dir = dir.Parent;
        }

        return current;
    }

    public static DatabaseConfig LoadConfig(string projectRoot)
    {
        var config = new DatabaseConfig();
        string dbPropPath = Path.Combine(projectRoot, "resources", "db.properties");

        if (File.Exists(dbPropPath))
        {
            var lines = File.ReadAllLines(dbPropPath);
            foreach (var line in lines)
            {
                var trimmed = line.Trim();
                if (string.IsNullOrEmpty(trimmed) || trimmed.StartsWith("#") || !trimmed.Contains("="))
                    continue;

                var parts = trimmed.Split('=', 2);
                var key = parts[0].Trim();
                var value = parts[1].Trim();

                switch (key.ToLowerInvariant())
                {
                    case "db.host":
                        config.Host = value;
                        break;
                    case "db.port":
                        if (int.TryParse(value, out int p)) config.Port = p;
                        break;
                    case "db.user":
                        config.User = value;
                        break;
                    case "db.password":
                        config.Password = value;
                        break;
                    case "db.name":
                        config.Name = value;
                        break;
                }
            }
        }

        return config;
    }

    public static bool SaveConfig(string projectRoot, DatabaseConfig config, out string message)
    {
        try
        {
            string resourcesDir = Path.Combine(projectRoot, "resources");
            if (!Directory.Exists(resourcesDir))
            {
                Directory.CreateDirectory(resourcesDir);
            }

            string dbPropPath = Path.Combine(resourcesDir, "db.properties");
            var lines = new List<string>
            {
                "# Database Configuration for SwordieMS v232",
                $"# Updated by Swordie Launcher on {DateTime.Now:yyyy-MM-dd HH:mm:ss}",
                $"db.host={config.Host.Trim()}",
                $"db.port={config.Port}",
                $"db.user={config.User.Trim()}",
                $"db.password={config.Password.Trim()}",
                $"db.name={config.Name.Trim()}"
            };

            File.WriteAllLines(dbPropPath, lines, System.Text.Encoding.UTF8);
            message = "บันทึกการตั้งค่าลง resources/db.properties สำเร็จเรียบร้อยแล้ว!";
            return true;
        }
        catch (Exception ex)
        {
            message = $"เกิดข้อผิดพลาดในการบันทึก: {ex.Message}";
            return false;
        }
    }
}
