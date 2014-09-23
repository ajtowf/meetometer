using System.Web.Http;
using meetometer.Repository;
using meetometer.Repository.Entities;
using Microsoft.AspNet.Identity;

namespace meetometer.Controllers
{
    [Authorize]
    public class MeetingsController : ApiController
    {
        private IMeetingRepository repository;

        public MeetingsController(IMeetingRepository repository)
        {
            this.repository = repository;
        }

        public IHttpActionResult Get()
        {
            return Ok(repository.GetAll(User.Identity.GetUserId()));
        }

        public IHttpActionResult Post([FromBody] Meeting meeting)
        {
            var existing = repository.GetById(meeting.Id);
            if (existing != null &&
                existing.UserId != User.Identity.GetUserId())
            {
                return BadRequest();
            }

            meeting.UserId = User.Identity.GetUserId();
            return Ok(repository.SaveOrUpdate(meeting));
        }

        public IHttpActionResult Delete(int id)
        {
            var existing = repository.GetById(id);
            if (existing == null)
            {
                return NotFound();
            }

            if (existing.UserId != User.Identity.GetUserId())
            {
                return BadRequest();
            }

            if (repository.Delete(id))
            {
                return Ok();
            }

            return NotFound();
        }
    }
}
