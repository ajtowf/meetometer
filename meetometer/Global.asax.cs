﻿using System;
using System.Data.Entity;
using System.Web.Http;
using meetometer.Migrations;
using meetometer.Repository;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace meetometer
{
    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);

            var formatters = GlobalConfiguration.Configuration.Formatters;
            var jsonFormatter = formatters.JsonFormatter;
            var settings = jsonFormatter.SerializerSettings;
            settings.Formatting = Formatting.Indented;
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            Database.SetInitializer(
                new MigrateDatabaseToLatestVersion<AppDbContext, Configuration>()); 
        }
    }
}