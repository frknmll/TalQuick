using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalQuickAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGroupChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SenderUsername",
                table: "GroupMessages",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SenderUsername",
                table: "GroupMessages");
        }
    }
}
