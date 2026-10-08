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
            File.WriteAllText("launcher_crash.log", args.ExceptionObject.ToString());
        };

        DispatcherUnhandledException += (s, args) =>
        {
            File.WriteAllText("launcher_crash.log", args.Exception.ToString());
            MessageBox.Show(args.Exception.Message, "Launcher Error", MessageBoxButton.OK, MessageBoxImage.Error);
        };

        try
        {
            var window = new MainWindow();
            MainWindow = window;
            window.Show();
        }
        catch (Exception ex)
        {
            File.WriteAllText("launcher_crash.log", ex.ToString());
            MessageBox.Show($"Failed to initialize MainWindow: {ex.Message}", "Startup Error", MessageBoxButton.OK, MessageBoxImage.Error);
            Shutdown(1);
        }
    }
}

