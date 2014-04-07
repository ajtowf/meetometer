using meetometer.Repository.Entities;

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
            if (!context.Meetings.Any())
            {
                context.Meetings.Add(new Meeting { AvgSalary = 40000, Date = DateTime.Now, DurationSeconds = 300, People = 10 });
                context.Meetings.Add(new Meeting { AvgSalary = 55000, Date = DateTime.Now, DurationSeconds = 300, People = 10 });
                context.Meetings.Add(new Meeting { AvgSalary = 60000, Date = DateTime.Now, DurationSeconds = 900, People = 5 });
            }
        }
    }
}
