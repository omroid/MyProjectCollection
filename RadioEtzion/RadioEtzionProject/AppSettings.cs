namespace RadioEtzionProject
{
    public class AppSettings
    {
        public static string ConfigurationsAppSettings;
        public string Secret { get; set; }
  
        public AppSettings()
        {
            Secret = ConfigurationsAppSettings;
        }
    }

    
}