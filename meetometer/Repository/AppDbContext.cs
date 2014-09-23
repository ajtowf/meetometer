using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Web;
using meetometer.Repository.Entities;
using Microsoft.AspNet.Identity.EntityFramework;

namespace meetometer.Repository
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext() : 
            base(ConfigurationManager.AppSettings["DatabaseName"])
        {
        }

        public DbSet<Meeting> Meetings { get; set; }

        public static AppDbContext Create()
        {
            return new AppDbContext();
        }
    }
}