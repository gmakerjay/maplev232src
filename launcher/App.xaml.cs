using System.Configuration;
using System.Data;
using System.IO;
using System.Windows;

namespace SwordieLauncher;

/// <summary>
/// Interaction logic for App.xaml
/// </summary>
public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        AppDomain.CurrentDomain.UnhandledException += (s, args) =>
        {
            try { File.WriteAllText("launcher_crash.log", args.ExceptionObject.ToString()); } catch { }
        };

        DispatcherUnhandledException += (s, args) =>
        {
            try { File.WriteAllText("launcher_crash.log", args.Exception.ToString()); } catch { }
            MessageBox.Show(args.Exception.Message, "Launcher Error", MessageBoxButton.OK, MessageBoxImage.Error);
        };
    }
}

