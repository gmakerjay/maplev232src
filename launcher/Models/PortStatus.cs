namespace SwordieLauncher.Models;

public class PortStatus
{
    public int Port { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsListening { get; set; }
    public int ProcessId { get; set; }
    public string ProcessName { get; set; } = string.Empty;
    public bool IsConflict { get; set; }
    public string StatusText => IsListening ? $"In Use (PID: {ProcessId} - {ProcessName})" : "Available";
}
