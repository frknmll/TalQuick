using Microsoft.EntityFrameworkCore;
using TalQuickAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TalQuickAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);

// SignalR servisini ekleyelim
builder.Services.AddSignalR();

// ✅ CORS'u SignalR ile uyumlu hale getirelim
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // React uygulamamızın çalıştığı adres
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // ✅ SignalR için gerekli
        });
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"], // Issuer doğrulaması
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"], // Audience doğrulaması
            ValidateLifetime = true, // Token süresi doğrulaması
            ClockSkew = TimeSpan.Zero // Token süresi tam zamanında dolsun
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors("AllowFrontend"); // ✅ CORS’u SignalR için de aktif et!
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ✅ SignalR Hub'ını ekleyelim
app.MapHub<ChatHub>("/chatHub");

app.Run();
