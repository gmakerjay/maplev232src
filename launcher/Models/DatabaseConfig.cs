namespace SwordieLauncher.Models;

public class DatabaseConfig
{
    public string Host { get; set; } = "127.0.0.1";
    public int Port { get; set; } = 3306;
    public string User { get; set; } = "root";
    public string Password { get; set; } = "root";
    public string Name { get; set; } = "swordie232";

    public int LoginPort { get; set; } = 8484;
    public int ChannelPort { get; set; } = 8585;
    public int ApiPort { get; set; } = 8483;
}
