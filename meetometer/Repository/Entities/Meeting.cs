using System;

namespace meetometer.Repository.Entities
{
    public class Meeting
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public int People { get; set; }
        public int AvgSalary { get; set; }
        public int DurationSeconds { get; set; }
    }
}