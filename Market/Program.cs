var builder = WebApplication.CreateBuilder(args);

var clientUrl = builder.Configuration.GetSection("ApplicationUrls").GetSection("clientUrl").Value;

builder.Services.AddCors(options =>
{
    options.AddPolicy("AppPolicy", options =>
    {
        options.AllowAnyHeader()
               .AllowCredentials()
               .AllowAnyMethod()
               .WithOrigins(clientUrl);
    });
});
// Add services to the container.

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCors("AppPolicy");
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");


app.MapFallbackToFile("index.html");

app.Run();
