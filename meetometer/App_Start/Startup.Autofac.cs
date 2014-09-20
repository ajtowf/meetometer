using System.Reflection;
using Autofac;
using Autofac.Integration.WebApi;
using meetometer.Repository;
using Owin;

namespace meetometer
{
    public partial class Startup
    {
        public IContainer ConfigureAutofac(IAppBuilder app)
        {
            var builder = new ContainerBuilder();
            builder.RegisterType<MeetingRepository>().As<IMeetingRepository>().AsImplementedInterfaces().InstancePerRequest();
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            
            return builder.Build();            
        }
    }
}