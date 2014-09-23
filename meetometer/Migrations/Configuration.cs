using meetometer.Repository.Entities;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace meetometer.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<meetometer.Repository.AppDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(meetometer.Repository.AppDbContext context)
        {
            var userId = string.Empty;

            if (!context.Users.Any())
            {
                var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context));
                var testUser = new ApplicationUser { UserName = "test" };
                manager.Create(testUser, "test123test!");
                userId = testUser.Id;
            }

            if (!context.Meetings.Any())
            {
                context.Meetings.Add(new Meeting { UserId = userId, AvgSalary = 40000, Date = DateTime.Now, DurationSeconds = 300, People = 10 });
                context.Meetings.Add(new Meeting { UserId = userId, AvgSalary = 55000, Date = DateTime.Now, DurationSeconds = 300, People = 10 });
                context.Meetings.Add(new Meeting { UserId = userId, AvgSalary = 60000, Date = DateTime.Now, DurationSeconds = 900, People = 5 });
            }
        }
    }
}
