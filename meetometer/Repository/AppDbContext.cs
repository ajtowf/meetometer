using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Web;
using meetometer.Repository.Entities;

namespace meetometer.Repository
{
    public class AppDbContext : DbContext
    {
        public AppDbContext() : 
            base(ConfigurationManager.AppSettings["DatabaseName"])
        {
        }

        public DbSet<Meeting> Meetings { get; set; }
    }
}