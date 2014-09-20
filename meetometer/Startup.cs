using System.Data.Entity;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;
using meetometer.Migrations;
using meetometer.Repository;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(meetometer.Startup))]

namespace meetometer
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();
                                    
            WebApiConfig.Register(config);
            app.UseWebApi(config);

            var container = ConfigureAutofac(app);
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
            app.UseAutofacMiddleware(container);
            app.UseAutofacWebApi(config);

            Database.SetInitializer(new MigrateDatabaseToLatestVersion<AppDbContext, Configuration>()); 
        }
    }
}
