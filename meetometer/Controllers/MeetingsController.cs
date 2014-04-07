using System.Web.Http;
using meetometer.Repository;
using meetometer.Repository.Entities;

namespace meetometer.Controllers
{
    public class MeetingsController : ApiController
    {
        private IMeetingRepository repository;

        public MeetingsController(IMeetingRepository repository)
        {
            this.repository = repository;
        }

        public IHttpActionResult Get()
        {
            return Ok(repository.GetAll());
        }

        public IHttpActionResult Post([FromBody] Meeting meeting)
        {
            return Ok(repository.SaveOrUpdate(meeting));
        }

        public IHttpActionResult Delete(int id)
        {
            if (repository.Delete(id))
            {
                return Ok();
            }

            return NotFound();
        }
    }
}
