using System.Diagnostics;
using System.Text.RegularExpressions;
using SwordieLauncher.Models;

namespace SwordieLauncher.Services;

public class PortMonitorService
{
    private static readonly (int Port, string Name)[] MonitoredPorts = new[]
    {
        (3306, "MariaDB / MySQL"),
        (8484, "Maple Login Server"),
        (8585, "Game Channel Bera-1"),
        (8483, "Maple Client API"),
        (3000, "Web API Server")
    };

    public List<PortStatus> CheckPorts(int? currentServerPid = null, int? currentDbPid = null)
    {
        var result = new List<PortStatus>();
        var netstatOutput = RunNetstat();

        foreach (var (port, name) in MonitoredPorts)
        {
            var status = new PortStatus
            {
                Port = port,
                Name = name,
                IsListening = false,
                ProcessId = 0,
                ProcessName = string.Empty,
                IsConflict = false
            };

            // Search for :port in listening state
            // Example line: TCP    127.0.0.1:8484         0.0.0.0:0              LISTENING       12345
            var pattern = $@":{port}\s+.*LISTENING\s+(\d+)";
            var match = Regex.Match(netstatOutput, pattern, RegexOptions.IgnoreCase);

            if (match.Success && int.TryParse(match.Groups[1].Value, out int pid))
            {
                status.IsListening = true;
                status.ProcessId = pid;
                status.ProcessName = GetProcessName(pid);

                // Check if this is an unexpected conflict
                bool isExpected = false;
                if (port == 3306 && (currentDbPid == pid || status.ProcessName.Contains("mysql", StringComparison.OrdinalIgnoreCase) || status.ProcessName.Contains("mariadb", StringComparison.OrdinalIgnoreCase)))
                {
                    isExpected = true;
                }
                else if (currentServerPid == pid)
                {
                    isExpected = true;
                }

                status.IsConflict = !isExpected && status.IsListening;
            }

            result.Add(status);
        }

        return result;
    }

    public static bool KillProcessByPid(int pid)
    {
        try
        {
            var p = Process.GetProcessById(pid);
            p.Kill(true);
            return true;
        }
        catch
        {
            try
            {
                using var cmd = Process.Start(new ProcessStartInfo
                {
                    FileName = "taskkill",
                    Arguments = $"/F /PID {pid}",
                    CreateNoWindow = true,
                    UseShellExecute = false
                });
                cmd?.WaitForExit(1000);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }

    public static void KillConflictingGamePorts()
    {
        var ports = new[] { 8484, 8585, 8483, 3000 };
        var netstat = RunNetstat();

        foreach (var port in ports)
        {
            var pattern = $@":{port}\s+.*LISTENING\s+(\d+)";
            var match = Regex.Match(netstat, pattern, RegexOptions.IgnoreCase);
            if (match.Success && int.TryParse(match.Groups[1].Value, out int pid))
            {
                KillProcessByPid(pid);
            }
        }
    }

    private static string RunNetstat()
    {
        try
        {
            using var proc = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "netstat",
                    Arguments = "-ano",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            proc.Start();
            string output = proc.StandardOutput.ReadToEnd();
            proc.WaitForExit(3000);
            return output;
        }
        catch
        {
            return string.Empty;
        }
    }

    private static string GetProcessName(int pid)
    {
        try
        {
            return Process.GetProcessById(pid).ProcessName;
        }
        catch
        {
            return "Unknown";
        }
    }
}
