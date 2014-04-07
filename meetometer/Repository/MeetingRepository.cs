using System.Collections.Generic;
using System.Linq;
using meetometer.Repository.Entities;

namespace meetometer.Repository
{
    public interface IMeetingRepository
    {
        IEnumerable<Meeting> GetAll();
        Meeting SaveOrUpdate(Meeting meeting);
        bool Delete(int id);
    }

    public class MeetingRepository : IMeetingRepository
    {
        private AppDbContext db = new AppDbContext();

        public IEnumerable<Meeting> GetAll()
        {
            return db.Meetings;
        }

        public Meeting SaveOrUpdate(Meeting meeting)
        {
            var entity = db.Meetings.FirstOrDefault(x => x.Id == meeting.Id);
            if (entity == null)
            {
                entity = new Meeting();
                db.Meetings.Add(entity);
            }

            entity.People = meeting.People;
            entity.AvgSalary = meeting.AvgSalary;
            entity.Date = meeting.Date;
            entity.DurationSeconds = meeting.DurationSeconds;

            db.SaveChanges();
            return entity;
        }

        public bool Delete(int id)
        {
            var didDelete = false;

            var entity = db.Meetings.FirstOrDefault(x => x.Id == id);
            if (entity != null)
            {
                db.Meetings.Remove(entity);
                db.SaveChanges();
                didDelete = true;
            }

            return didDelete;
        }
    }
}